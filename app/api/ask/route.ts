import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
)

export async function POST(req: NextRequest) {
  const { question, context, source_doc } = await req.json()

  // 1. 問題向量化（Voyage AI）
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

  // 2. Supabase pgvector 相似度搜尋
  const { data: matches, error } = await supabase.rpc('match_documents', {
    query_embedding: queryVec,
    match_case_id: source_doc,
    match_count: 5,
  })

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ answer: '搜尋失敗，請稍後再試', sources: [] }, { status: 500 })
  }

  const topChunks = (matches as { text: string }[]).map(m => m.text).join('\n\n---\n\n')
  const sources = (matches as { text: string }[]).map(m => m.text)

  // 3. Claude 回答
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
如果起訴書內容裡找不到答案，只回覆「這份文件裡沒有提到」這句話，句號為止，不要任何其他文字。

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
