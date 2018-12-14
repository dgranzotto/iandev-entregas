export default {
  getFilenameExtension (filename) {
    if (filename) {
      let idx = filename.lastIndexOf('.')
      return (idx > 0 ? filename.substring(idx + 1) : '')
    }
    return ''
  },
  getFileContentAsBase64 (path, callback) {
    window.resolveLocalFileSystemURL(path, (fileEntry) => {
      fileEntry.file((file) => {
        let reader = new FileReader()
        reader.onloadend = function (e) {
          let base64 = this.result
          callback(base64)
        }
        // The most important point, use the readAsDataURL Method from the file plugin
        reader.readAsDataURL(file)
      })
    }, (error) => {
      console.log(error)
      callback(null)
    })
  }
}
