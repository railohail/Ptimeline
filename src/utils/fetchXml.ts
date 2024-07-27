// utils/fetchXml.ts

export async function fetchXmlFile(filename: string): Promise<string> {
  try {
    const response = await fetch(filename, {
      credentials: 'include', // This line is added
      mode: 'cors' // This line is added
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlContent = await response.text()
    console.log('Fetched XML content:', xmlContent)
    return xmlContent
  } catch (error) {
    console.error('Error fetching XML file:', error)
    throw error
  }
}
