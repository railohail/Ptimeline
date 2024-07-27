// utils/fetchXml.ts

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/'

export async function fetchXmlFile(
  filename: string,
  useCorsProxy: boolean = false
): Promise<string> {
  try {
    let url = filename
    if (useCorsProxy && !filename.startsWith('http')) {
      console.warn(
        'CORS proxy is meant to be used with remote URLs. Ignoring proxy for local file.'
      )
    } else if (useCorsProxy) {
      url = `${CORS_PROXY}${filename}`
    }

    const response = await fetch(url)

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
