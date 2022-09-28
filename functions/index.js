exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
