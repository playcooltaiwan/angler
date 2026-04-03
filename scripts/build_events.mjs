import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const { events: rawEvents, characters } = JSON.parse(readFileSync(join(root, 'public/nodes.json'), 'utf-8'))
const embeddings = JSON.parse(readFileSync(join(root, 'public/embeddings.json'), 'utf-8'))

// 將民國日期字串轉成可排序格式，回傳 { date, date_display }
function parseDate(raw) {
  const display = raw
  // 嘗試解析「109年3月10日」→「109-03-10」
  const full = raw.match(/^(\d+)年(\d+)月(\d+)日/)
  if (full) {
    const [, y, m, d] = full
    return {
      date: `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`,
      date_display: display
    }
  }
  // 「109年2月至4月」→ 取開始月份
  const rangeMonth = raw.match(/^(\d+)年(\d+)月/)
  if (rangeMonth) {
    const [, y, m] = rangeMonth
    return {
      date: `${y}-${m.padStart(2,'0')}-01`,
      date_display: display
    }
  }
  // 「109年3月24至26日」
  const rangeDay = raw.match(/^(\d+)年(\d+)月(\d+)/)
  if (rangeDay) {
    const [, y, m, d] = rangeDay
    return {
      date: `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`,
      date_display: display
    }
  }
  // 「106至111年」「112至113年」→ 取開始年
  const rangeYear = raw.match(/^(\d+)/)
  if (rangeYear) {
    return {
      date: `${rangeYear[1]}-01-01`,
      date_display: display
    }
  }
  return { date: '000-01-01', date_display: display }
}

// 事件類型對應
const TYPE_MAP = {
  meeting_20200218:    '對話紀錄',
  meeting_20200220:    '對話紀錄',
  bento_20200310:      '行政程序',
  sign_rejected:       '行政程序',
  '210wan':            '賄賂金流',
  '1500wan':           '賄賂金流',
  '5250wan':           '賄賂金流',
  wash_money:          '賄賂金流',
  ducweihui_765:       '會議',
  ducweihui_765_special: '會議',
  ducweihui_768:       '會議',
  kp_fund:             '賄賂金流',
  wangwang_fund:       '賄賂金流',
  jinghuacheng_permit: '行政程序',
}

// 用 search_query 關鍵詞在 embeddings 文本中找相關段落（不需要 API）
// 中文沒有空格，拆成 2-gram 和 3-gram 做關鍵字比對
function findSourceSegments(searchQuery, topN = 3) {
  const grams = new Set()
  // 以空格/逗號分詞（英文或已分詞的中文）
  for (const tok of searchQuery.split(/[\s,，]+/).filter(k => k.length >= 2)) {
    grams.add(tok)
  }
  // 2-gram 和 3-gram 滑動窗口（針對連續中文）
  for (let i = 0; i < searchQuery.length - 1; i++) {
    grams.add(searchQuery.slice(i, i + 2))
    if (i < searchQuery.length - 2) grams.add(searchQuery.slice(i, i + 3))
  }
  const keywords = [...grams].filter(k => k.length >= 2)

  const scored = embeddings.map(seg => {
    let score = 0
    for (const kw of keywords) {
      if (seg.text.includes(kw)) score++
    }
    return { id: seg.id, score }
  })
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(s => s.id)
}

// 建立人物 id → name 映射
const charNameMap = Object.fromEntries(characters.map(c => [c.id, c.name]))

const events = rawEvents.map(e => {
  const { date, date_display } = parseDate(e.date)
  const persons = (e.connected_characters || []).map(id => charNameMap[id] || id)
  const source_segments = findSourceSegments(e.search_query, 6)

  return {
    id: e.id,
    date,
    date_display,
    title: e.title,
    type: TYPE_MAP[e.id] || '其他',
    persons,
    summary: e.description,
    significance: e.significance,
    search_query: e.search_query,
    source_segments,
    connected_events: e.connected_events || [],
    dialogue: [],
  }
})

// 按日期排序
events.sort((a, b) => a.date.localeCompare(b.date))

writeFileSync(join(root, 'public/events.json'), JSON.stringify(events, null, 2), 'utf-8')
console.log(`✓ 輸出 ${events.length} 個事件到 public/events.json`)
events.forEach(e => console.log(`  ${e.date}  [${e.type}]  ${e.title}`))
