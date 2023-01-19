function handleDownloadResponse (blobFileData, filename) {
  const url = window.URL.createObjectURL(new Blob([blobFileData]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  
}

export default handleDownloadResponse