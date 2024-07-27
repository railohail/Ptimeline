// utils/xmlParser.ts

interface TimelineItem {
  id: number
  content: string
  start: Date
  className: string
  title: string
  image: string
  link: string
}

export function parseTimelineXML(xmlString: string): TimelineItem[] {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
  const events = xmlDoc.getElementsByTagName('event')

  return Array.from(events).map((event, index) => ({
    id: index + 1,
    content: event.getAttribute('title') || '',
    start: new Date(event.getAttribute('start') || ''),
    className: event.getAttribute('classname') || '',
    title: event.getAttribute('title') || '',
    image: event.getAttribute('image') || '',
    link: event.getAttribute('link') || ''
  }))
}
