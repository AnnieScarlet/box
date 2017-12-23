import axios from 'axios'

const WebResult = {
  Success: Symbol(''),
  ServerError: Symbol(''),
  InvalidRequest: Symbol('')
}

const client = axios.create({
  xsrfHeaderName: 'X-CSRF-Token',
  withCredentials: true
})

client.interceptors.response.use((response) => {
  return Promise.resolve({
    data: response.data
  })
}, (error) => {
  return Promise.resolve({
    error: error.response
  })
})

const send = async (method, url) => {
  return method(url)
}

const get = async (url) => {
  return send(client.get, url)
}

export default {
  WebResult,
  async getPosts () {
    return get('https://s3-ap-northeast-1.amazonaws.com/eorzeabox-dev/api/posts.json')
  }
}
