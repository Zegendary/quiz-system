const dev = process.env.NODE_ENV !== 'production'
const cdn = (path = '') => {
  if (path === '') {
    return undefined
  }
  let host = dev ? "cdn.jscode.me": "static.xiedaimala.com"
  return /^(https?:)?\/\//.test(path) ? path : `//${host}/${path}`
}

export default cdn