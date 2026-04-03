'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface DialogueItem {
  speaker: string | null
  channel: string
  content: string
  source_segment: number
}

interface Event {
  id: string
  date: string
  date_display: string
  title: string
  type: string
  case: string
  source_doc: string
  persons: string[]
  summary: string
  significance: string
  source_segments: number[]
  connected_events: string[]
  dialogue: DialogueItem[]
}

interface Document {
  id: string
  label: string
  year_month: string
  perspective: string
  type: string
  status: string
  embeddings: string
}

interface Character {
  id: string
  name: string
  role: string
}

interface Props {
  events: Event[]
  characters: Character[]
  caseLabel: string
  caseDocuments: Document[]
}

const TYPE_COLOR: Record<string, string> = {
  '行政程序': '#4a9eff',
  '賄賂金流': '#ff6600',
  '會議':    '#aa66ff',
  '對話紀錄': '#00cc88',
  '境外聯繫': '#cc44aa',
  '選舉介入': '#ff4455',
  '金流':    '#ff8800',
  '詐欺':    '#cc8844',
  '違法入境': '#9933cc',
}

const PERSON_COLOR: Record<string, string> = {
  '柯文哲': '#ff4444',
  '沈慶京': '#ff7700',
  '應曉薇': '#ff4444',
  '彭振聲': '#ffaa00',
  '黃景茂': '#ffaa00',
  '邵琇珮': '#888888',
  '李文宗': '#888888',
  '吳順民': '#777777',
  '張懿萱': '#00cc66',
  '徐春鶯': '#e05560',
  '鍾錦明': '#d4804a',
  '楊文濤': '#cc44aa',
  '孫憲':   '#aa33cc',
  '黃珊珊': '#4488dd',
}

export default function Timeline({ events, characters, caseLabel, caseDocuments }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showSources, setShowSources] = useState(false)

  const filteredEvents = useMemo(() => {
    if (!selectedPerson) return events
    return events.filter(e => e.persons.includes(selectedPerson))
  }, [events, selectedPerson])

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) ?? null : null

  function handlePersonClick(name: string) {
    setSelectedPerson(prev => prev === name ? null : name)
    setSelectedEventId(null)
    setAnswer('')
  }

  const docLabel = caseDocuments[0]
    ? `${caseDocuments[0].type} · ${caseDocuments[0].year_month}`
    : ''

  function handleEventClick(id: string) {
    setSelectedEventId(prev => prev === id ? null : id)
    setQuestion('')
    setAnswer('')
    setSources([])
    setShowSources(false)
  }

  async function handleAsk() {
    if (!question.trim() || !selectedEvent) return
    setLoading(true)
    setAnswer('')
    setSources([])
    setShowSources(false)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          context: `目前正在看的事件：${selectedEvent.title}\n${selectedEvent.summary}`,
          source_doc: selectedEvent.source_doc,
        }),
      })
      const data = await res.json()
      setAnswer(data.answer ?? '無法取得回答')
      setSources(data.sources ?? [])
    } catch {
      setAnswer('發生錯誤，請再試一次。')
    }
    setLoading(false)
  }

  const detailOpen = !!selectedEvent

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0a', color: '#e8e0d0', fontFamily: '"Noto Serif TC", Georgia, serif', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid #1a1a1a', padding: '14px 40px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '0.12em', margin: 0, color: '#fff', cursor: 'pointer' }}>ANGLER</h1>
        </Link>
        <span style={{ color: '#1e1e1e', fontSize: '14px' }}>/</span>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#c8c0b0', letterSpacing: '0.08em' }}>{caseLabel}</span>
        <span style={{ fontSize: '11px', color: '#2a2a2a', letterSpacing: '0.1em' }}>{docLabel}</span>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#1e1e1e' }}>判決書出來後將更新對照</span>
      </div>

      {/* ── Person filter ── */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid #1a1a1a', padding: '12px 40px', display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: '#333', letterSpacing: '0.3em', marginRight: '4px' }}>人物</span>
        <FilterChip
          label="全部"
          active={!selectedPerson}
          color="#888"
          onClick={() => { setSelectedPerson(null); setSelectedEventId(null); setAnswer('') }}
        />
        {characters.map(c => (
          <FilterChip
            key={c.id}
            label={c.name}
            active={selectedPerson === c.name}
            color={PERSON_COLOR[c.name] ?? '#888'}
            onClick={() => handlePersonClick(c.name)}
          />
        ))}
        {selectedPerson && (
          <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#444' }}>
            {filteredEvents.length} 個事件
          </span>
        )}
      </div>

      {/* ── Two-panel layout ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: detailOpen ? 'minmax(0, 1fr) 400px' : '1fr',
        overflow: 'hidden',
        transition: 'grid-template-columns 0.2s',
      }}>

        {/* ── Timeline ── */}
        <div style={{ padding: '48px 40px 80px', overflowY: 'auto', height: '100%' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', paddingLeft: '140px' }}>

            {/* Vertical spine */}
            <div style={{ position: 'absolute', left: '128px', top: 0, bottom: 0, width: '1px', background: '#181818' }} />

            {filteredEvents.length === 0 && (
              <div style={{ textAlign: 'center', color: '#333', fontSize: '14px', paddingTop: '80px' }}>
                此人物無相關事件紀錄
              </div>
            )}

            {filteredEvents.map(event => {
              const isActive = selectedEventId === event.id
              const typeColor = TYPE_COLOR[event.type] ?? '#666'
              return (
                <div
                  key={event.id}
                  style={{ position: 'relative', marginBottom: '24px', cursor: 'pointer' }}
                  onClick={() => handleEventClick(event.id)}
                >
                  {/* Date label */}
                  <div style={{
                    position: 'absolute', left: '-140px', top: '14px',
                    width: '120px', textAlign: 'right',
                    fontSize: '11px', color: '#3a3a3a', lineHeight: '1.4',
                    letterSpacing: '0.03em',
                  }}>
                    {event.date_display}
                  </div>

                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '-17px', top: '13px',
                    width: '11px', height: '11px', borderRadius: '50%',
                    background: isActive ? typeColor : '#111',
                    border: `2px solid ${isActive ? typeColor : '#2a2a2a'}`,
                    transition: 'all 0.15s',
                    zIndex: 1,
                  }} />

                  {/* Card */}
                  <div style={{
                    padding: '14px 18px',
                    background: isActive ? '#111' : '#0c0c0c',
                    border: '1px solid transparent',
                    borderLeft: `3px solid ${isActive ? typeColor : '#1a1a1a'}`,
                    outline: isActive ? `1px solid #222` : 'none',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#0f0f0f' }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#0c0c0c' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '10px', padding: '1px 7px',
                        border: `1px solid ${typeColor}50`, color: typeColor,
                        letterSpacing: '0.08em', flexShrink: 0,
                      }}>
                        {event.type}
                      </span>
                      {event.case === '跨案' && (
                        <span style={{
                          fontSize: '10px', padding: '1px 7px', flexShrink: 0,
                          border: '1px solid #55441a', color: '#aa8833',
                          letterSpacing: '0.08em',
                        }}>
                          跨案
                        </span>
                      )}
                      <span style={{ fontSize: '15px', fontWeight: '600', color: isActive ? '#fff' : '#c8c0b0', lineHeight: '1.3' }}>
                        {event.title}
                      </span>
                    </div>

                    {/* Person chips + source badge */}
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {event.persons.map(name => {
                        const pc = PERSON_COLOR[name] ?? '#666'
                        const highlight = selectedPerson === name
                        return (
                          <span key={name} style={{
                            fontSize: '11px', padding: '1px 8px',
                            border: `1px solid ${pc}${highlight ? '80' : '25'}`,
                            color: highlight ? pc : `${pc}99`,
                          }}>
                            {name}
                          </span>
                        )
                      })}
                      <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#252418', letterSpacing: '0.05em' }}>
                        {(() => {
                          const doc = caseDocuments.find(d => d.id === event.source_doc)
                          return doc ? `${doc.type} · ${doc.year_month}` : null
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        {detailOpen && selectedEvent && (
          <div style={{
            borderLeft: '1px solid #161616',
            background: '#070707',
            padding: '40px 28px 60px',
            overflowY: 'auto',
            height: '100%',
          }}>
            <button
              onClick={() => { setSelectedEventId(null); setAnswer('') }}
              style={{ fontSize: '11px', color: '#444', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.12em', marginBottom: '28px', padding: 0 }}
            >
              ← 關閉
            </button>

            {/* Type + date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '10px', padding: '2px 8px',
                border: `1px solid ${(TYPE_COLOR[selectedEvent.type] ?? '#666')}50`,
                color: TYPE_COLOR[selectedEvent.type] ?? '#666',
                letterSpacing: '0.08em',
              }}>
                {selectedEvent.type}
              </span>
              <span style={{ fontSize: '12px', color: '#3a3a3a' }}>{selectedEvent.date_display}</span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 18px', lineHeight: '1.45' }}>
              {selectedEvent.title}
            </h2>

            {/* Persons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '22px' }}>
              {selectedEvent.persons.map(name => (
                <span key={name} style={{
                  fontSize: '12px', padding: '3px 10px',
                  border: `1px solid ${(PERSON_COLOR[name] ?? '#888')}40`,
                  color: PERSON_COLOR[name] ?? '#888',
                }}>
                  {name}
                </span>
              ))}
            </div>

            {/* Summary */}
            <p style={{ fontSize: '14px', lineHeight: '2', color: '#b0a898', marginBottom: '22px' }}>
              {selectedEvent.summary}
            </p>

            {/* Significance */}
            <div style={{ borderLeft: '3px solid #ff333340', paddingLeft: '14px', marginBottom: '32px' }}>
              <div style={{ fontSize: '10px', color: '#ff3333', letterSpacing: '0.25em', marginBottom: '8px' }}>為什麼重要</div>
              <p style={{ fontSize: '13px', lineHeight: '1.85', color: '#666', margin: 0 }}>
                {selectedEvent.significance}
              </p>
            </div>

            {/* ── Primary Sources ── */}
            {selectedEvent.dialogue.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px',
                  paddingBottom: '10px', borderBottom: '1px solid #141414',
                }}>
                  <span style={{
                    fontSize: '9px', padding: '2px 7px', letterSpacing: '0.2em',
                    border: '1px solid #3a3a2a', color: '#aa9944', background: '#1a1800',
                  }}>
                    一級史料
                  </span>
                  <span style={{ fontSize: '10px', color: '#333', letterSpacing: '0.1em' }}>
                    起訴書原始紀錄
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedEvent.dialogue.map((item, i) => (
                    <div key={i} style={{
                      background: '#0d0c08',
                      border: '1px solid #252418',
                      borderLeft: '3px solid #3a3520',
                      padding: '12px 14px',
                    }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {item.speaker && (
                          <span style={{ fontSize: '11px', color: '#aa9944', fontWeight: '600' }}>
                            {item.speaker}
                          </span>
                        )}
                        <span style={{
                          fontSize: '10px', padding: '1px 6px',
                          border: '1px solid #2a2818', color: '#555540',
                          letterSpacing: '0.05em',
                        }}>
                          {item.channel}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '13px', lineHeight: '1.85', color: '#908870',
                        margin: 0, fontFamily: '"Noto Serif TC", serif',
                      }}>
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Q&A */}
            <div style={{ borderTop: '1px solid #141414', paddingTop: '22px' }}>
              <div style={{ fontSize: '10px', color: '#333', letterSpacing: '0.2em', marginBottom: '12px' }}>查詢起訴書原文</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAsk()}
                  placeholder="輸入問題…"
                  style={{
                    flex: 1, background: '#0c0c0c', border: '1px solid #222',
                    color: '#e8e0d0', padding: '9px 12px', fontSize: '13px',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                />
                <button
                  onClick={handleAsk}
                  disabled={loading}
                  style={{
                    background: loading ? '#111' : '#c41',
                    color: '#fff', border: 'none',
                    padding: '9px 16px', cursor: loading ? 'default' : 'pointer',
                    fontSize: '12px', fontFamily: 'inherit', flexShrink: 0,
                  }}
                >
                  {loading ? '…' : '問'}
                </button>
              </div>

              {answer && (
                <div style={{ marginTop: '14px' }}>
                  <div style={{
                    padding: '16px', background: '#0c0c0c', border: '1px solid #1a1a1a',
                    fontSize: '13px', lineHeight: '1.95', color: '#a8a098',
                    marginBottom: '10px',
                  }}>
                    {answer}
                  </div>
                  {sources.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowSources(s => !s)}
                        style={{
                          fontSize: '11px', color: '#444', background: 'none',
                          border: 'none', cursor: 'pointer', letterSpacing: '0.12em',
                          padding: 0, marginBottom: '8px',
                        }}
                      >
                        {showSources ? '▼' : '▶'} 起訴書原文依據
                      </button>
                      {showSources && sources.map((src, i) => (
                        <div key={i} style={{
                          padding: '12px 14px', background: '#080808',
                          borderLeft: '2px solid #222', marginBottom: '6px',
                          fontSize: '12px', lineHeight: '1.8', color: '#555',
                        }}>
                          {src}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function FilterChip({ label, active, color, onClick }: {
  label: string; active: boolean; color: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '3px 11px', fontSize: '12px', cursor: 'pointer',
        border: `1px solid ${active ? color : '#222'}`,
        color: active ? color : '#444',
        background: active ? `${color}12` : 'transparent',
        fontFamily: 'inherit',
        transition: 'all 0.12s',
      }}
    >
      {label}
    </button>
  )
}
