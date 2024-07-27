// utils/fetchXml.ts
export async function fetchXmlFile(filename: string): Promise<string> {
  const response = await fetch(filename)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const xmlContent = await response.text()
  console.log('Fetched XML content:', xmlContent)
  return xmlContent
}
