import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const events = JSON.parse(readFileSync(join(root, 'public/events.json'), 'utf-8'))
const draft = JSON.parse(readFileSync(join(root, 'scripts/dialogue_draft.json'), 'utf-8'))

const draftMap = Object.fromEntries(draft.map(d => [d.event_id, d.dialogue]))

const merged = events.map(e => ({
  ...e,
  dialogue: draftMap[e.id] ?? [],
}))

writeFileSync(join(root, 'public/events.json'), JSON.stringify(merged, null, 2), 'utf-8')

const total = merged.reduce((s, e) => s + e.dialogue.length, 0)
console.log(`✓ 合併完成：${total} 條史料分佈在 ${merged.filter(e => e.dialogue.length > 0).length} 個事件`)
merged.forEach(e => {
  if (e.dialogue.length > 0) console.log(`  ${e.id}: ${e.dialogue.length} 條`)
})
