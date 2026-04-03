import { notFound } from 'next/navigation'
import casesData from '../../public/cases.json'
import eventsData from '../../public/events.json'
import nodesData from '../../public/nodes.json'
import Timeline from '../components/Timeline'

interface Props {
  params: Promise<{ caseId: string }>
}

export function generateStaticParams() {
  return casesData.map(c => ({ caseId: c.slug }))
}

export default async function CasePage({ params }: Props) {
  const { caseId } = await params
  const caseInfo = casesData.find(c => c.slug === caseId)
  if (!caseInfo) notFound()

  const caseEvents = eventsData.filter(e => e.case === caseInfo.name)

  // 取出這個案件中出現的人物
  const personNames = new Set(caseEvents.flatMap(e => e.persons))
  const characters = nodesData.characters.filter(c => personNames.has(c.name))

  return (
    <Timeline
      events={caseEvents}
      characters={characters}
      caseLabel={caseInfo.name}
      caseDocuments={caseInfo.documents}
    />
  )
}
