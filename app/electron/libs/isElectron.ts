const isElectron = () => {
  var userAgent = navigator.userAgent.toLowerCase()
  return userAgent.indexOf(' electron/') > -1
}

export default isElectron
