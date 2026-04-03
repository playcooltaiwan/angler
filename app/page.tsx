import Link from 'next/link'
import casesData from '../public/cases.json'
import eventsData from '../public/events.json'

export default function Page() {
  const casesWithCount = casesData.map(c => ({
    ...c,
    eventCount: eventsData.filter(e => e.case === c.name).length,
  }))

  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#e8e0d0',
      fontFamily: '"Noto Serif TC", Georgia, serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '0.15em', color: '#fff', margin: '0 0 12px' }}>
          ANGLER
        </h1>
        <p style={{ fontSize: '13px', color: '#333', letterSpacing: '0.2em', margin: 0 }}>
          讓原始文件說話
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {casesWithCount.map(c => (
          <Link
            key={c.id}
            href={`/${c.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <div className="case-card" style={{
              width: '280px',
              padding: '32px 28px',
              background: '#0c0c0c',
              border: '1px solid',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: '11px', color: '#333', letterSpacing: '0.3em', marginBottom: '16px' }}>
                {c.documents[0].status}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: '0 0 20px', letterSpacing: '0.06em' }}>
                {c.name}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {c.documents.map(doc => (
                  <div key={doc.id} style={{
                    fontSize: '12px', padding: '8px 10px',
                    border: '1px solid #1e1e1e',
                    color: '#666',
                    letterSpacing: '0.04em',
                  }}>
                    {doc.label} · {doc.year_month}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '24px', fontSize: '11px', color: '#2a2a2a', letterSpacing: '0.1em' }}>
                {c.eventCount} 個事件
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
