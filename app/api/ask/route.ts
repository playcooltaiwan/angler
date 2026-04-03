import { NextRequest, NextResponse } from 'next/server'
import casesData from '../../../public/cases.json'

export async function POST(req: NextRequest) {
  const { question, context, source_doc } = await req.json()

  // 找出這份文件用哪個 embeddings 檔
  const doc = casesData.flatMap(c => c.documents).find(d => d.id === source_doc)
  const embeddingsFile = doc?.embeddings ?? 'embeddings.json'

  // 1. 用 voyage 把問題變成向量
  const embedRes = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [question],
      model: 'voyage-law-2',
      input_type: 'query',
    }),
  })
  const embedData = await embedRes.json()
  const queryVec = embedData.data[0].embedding

  // 2. 載入對應文件的 embeddings
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const embeddingsRes = await fetch(`${baseUrl}/${embeddingsFile}`)
  const embeddings = await embeddingsRes.json()

  // 3. 找 top 5 相關段落
  const scored = embeddings.map((item: { id: number; text: string; embedding: number[] }) => {
    const dot = item.embedding.reduce((sum: number, val: number, i: number) => sum + val * queryVec[i], 0)
    return { text: item.text, score: dot }
  })
  scored.sort((a: { score: number }, b: { score: number }) => b.score - a.score)
  const top5 = scored.slice(0, 5)
  const topChunks = top5.map((s: { text: string }) => s.text).join('\n\n---\n\n')
  const sources = top5.map((s: { text: string }) => s.text)

  // 4. 問 Claude
  const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      messages: [
        {
          role: 'user',
          content: `你是一個熟讀這份起訴書的朋友，用自然的對話方式回答問題。
說話直接、清楚，不要條列，不要說「根據段落」之類的話。
回答控制在150字以內。
如果找不到答案，就說你知道的部分。

${context ? `背景：${context}\n\n` : ''}起訴書相關內容：
${topChunks}

問題：${question}`,
        },
      ],
    }),
  })

  const claudeData = await claudeRes.json()
  const answer = claudeData.content?.[0]?.text || '無法取得回答'

  return NextResponse.json({ answer, sources })
}
