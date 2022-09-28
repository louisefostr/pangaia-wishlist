const fetch = require('node-fetch')

const apiKey = process.env.API_KEY
const apiPassword = process.env.API_PASSWORD
const storeUrl = process.env.STORE_URL
const apiVersion = process.env.API_VERSION

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body)

  const put = async (endpoint, data) => {
    const res = await fetch(
      `https://${apiKey}:${apiPassword}@${storeUrl}/admin/api/${apiVersion}/${endpoint}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    )
    return await res.json()
  }

  const get = async (endpoint, data) => {
    const url = new URL(
      `https://${apiKey}:${apiPassword}@${storeUrl}/admin/api/${apiVersion}/${endpoint}`
    )
    Object.entries(data).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    )
    const res = await fetch(url, { method: 'GET' })
    return await res.json()
  }

  // Logic goes here
  console.log(data)

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}
