function handleDownloadResponse (blobFileData, filename) {
  const url = window.URL.createObjectURL(new Blob([blobFileData]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename) // nama file dan extension sesuaikan dengan file yang di download
  document.body.appendChild(link)
  link.click()
  
}

export default handleDownloadResponse