import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Load .env.local
const env = readFileSync(join(root, '.env.local'), 'utf-8')
const API_KEY = env.match(/ANTHROPIC_API_KEY=([^\r\n]+)/)?.[1]?.trim()
if (!API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1) }
console.log('API key loaded, length:', API_KEY.length)

const events = JSON.parse(readFileSync(join(root, 'public/events.json'), 'utf-8'))
const embeddings = JSON.parse(readFileSync(join(root, 'public/embeddings.json'), 'utf-8'))

const PROMPT = (title, segments) => `你是一個法律文件分析師，正在整理起訴書中的一級史料。
事件主題：「${title}」

請從以下起訴書原文段落中，抽取所有「有來源根據的具體事實陳述」，包括：
- 直接引用：LINE 訊息、會議發言、書面簽呈內容（起訴書中有引號或書名號的）
- 行為描述：根據在場者陳述的具體行為（例如「面露滿意微笑」、「拍桌說」）
- 關鍵事實：有具體數字、時間、地點的事實記錄（例如「38 分鐘內跑兩家銀行」）

channel 必須是以下之一：LINE / 會議發言 / 書面文件 / 證人陳述 / 起訴書記載

輸出純 JSON 陣列，每條格式：
{
  "speaker": "說話者或行為主體（辨識不到填 null）",
  "channel": "channel 類型",
  "content": "逐字引用或事實描述，保留原文用語",
  "source_segment": 段落編號（整數）
}

如果段落中沒有可抽取的內容，輸出 []。
只輸出 JSON 陣列，不要任何說明文字。

---
${segments}`

async function callClaude(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await res.json()
  if (data.error) { console.warn('  API error:', data.error.message); return '[]' }
  return data.content?.[0]?.text ?? '[]'
}

function parseJSON(text, eventId) {
  try {
    const match = text.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : []
  } catch {
    console.warn(`  ⚠ JSON parse failed for ${eventId}`)
    return []
  }
}

async function main() {
  const draft = []

  for (const event of events) {
    process.stdout.write(`[${event.id}] ${event.title}...`)

    if (event.source_segments.length === 0) {
      console.log(' (no segments, skip)')
      draft.push({ event_id: event.id, event_title: event.title, dialogue: [] })
      continue
    }

    const segText = event.source_segments
      .map(id => {
        const seg = embeddings.find(e => e.id === id)
        return seg ? `[段落 ${seg.id}]\n${seg.text.slice(0, 800)}` : null
      })
      .filter(Boolean)
      .join('\n\n---\n\n')

    const raw = await callClaude(PROMPT(event.title, segText))
    const dialogue = parseJSON(raw, event.id)

    console.log(` → ${dialogue.length} 條`)
    draft.push({ event_id: event.id, event_title: event.title, dialogue })

    await new Promise(r => setTimeout(r, 400))
  }

  const outPath = join(root, 'scripts/dialogue_draft.json')
  writeFileSync(outPath, JSON.stringify(draft, null, 2), 'utf-8')
  console.log(`\n✓ 輸出 ${draft.length} 個事件到 scripts/dialogue_draft.json`)

  // Summary
  const total = draft.reduce((s, e) => s + e.dialogue.length, 0)
  console.log(`  共 ${total} 條史料`)
}

main().catch(console.error)
