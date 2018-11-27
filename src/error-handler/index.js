import Backend from './backend'

export default (context, error) => {
  if (error.response && error.response.data && error.response.data.backend) {
    Backend(error)
    return
  }
  console.log('Error handler', error)
}
