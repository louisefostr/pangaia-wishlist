import fetch from 'node-fetch'

const apiKey = process.env.API_KEY || ''
const apiPassword = process.env.API_PASSWORD
const storeUrl = process.env.STORE_URL
const apiVersion = process.env.API_VERSION

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body)

  const put = async (endpoint, data) => {
    const res = await fetch(
      `https://${storeUrl}/admin/api/${apiVersion}/${endpoint}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': apiKey
        },
        body: JSON.stringify(data)
      }
    )
    return await res.json()
  }

  const get = async (endpoint, data) => {
    const url = new URL(
      `https://${storeUrl}/admin/api/${apiVersion}/${endpoint}`
    )
    Object.entries(data).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    )
    const res = await fetch(url.href, {
      method: 'GET',
      headers: { 'X-Shopify-Access-Token': apiKey }
    })
    return await res.json()
  }

  const customer = await get(`customers/${data.customer}.json`)
  console.log(customer)
  const tags = customer.tags.split(',').push(data.wishlist).join(',')
  // Logic goes here
  await put(`customers/${data.customer}.json`, {
    customer: { id: data.customer, tags }
  })

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}
