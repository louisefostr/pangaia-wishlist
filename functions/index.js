import fetch from 'node-fetch'

const apiKey = process.env.API_KEY || ''
const storeUrl = process.env.STORE_URL
const apiVersion = process.env.API_VERSION

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body)

  const graphql = async gql => {
    const res = await fetch(
      `https://${storeUrl}/admin/api/${apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/graphql',
          'X-Shopify-Access-Token': apiKey
        },
        body: gql
      }
    )
    return await res.json()
  }
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

  console.log(data)

  const customerQuery = `
  {
    customer(id: "gid://shopify/Customer/${data.customer}") {
      tags,
      legacyResourceId
    }
  }
  `
  const customer = await graphql(customerQuery)
  const tags = customer.data.customer.tags

  console.log('customer tags:', tags)

  // Logic goes here
  if (data.action === 'add') {
    tags.push(data.tag)
    console.log('tags after add:', tags)
  }

  if (data.action === 'remove') {
    tags.splice(tags.indexOf(data.tag), 1)
    console.log('tags after remove:', tags)
  }

  await put(`customers/${data.customer}.json`, {
    customer: { id: data.customer, tags: tags.join(',') }
  })

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}
