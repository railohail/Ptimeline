// utils/fetchXml.ts

export async function fetchXmlFile(filename: string): Promise<string> {
  try {
    // Check if the URL is a Google Drive fife URL
    if (filename.includes('googleusercontent.com') && filename.includes('fife')) {
      // Extract the file ID from the fife URL
      const fileId = filename.split('/').pop()?.split('=').pop()
      if (fileId) {
        // Construct the Google Drive direct link
        filename = `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }

    const response = await fetch(filename, {
      credentials: 'omit', // Don't send cookies
      mode: 'cors' // Explicitly request CORS
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
