const fetch = require('node-fetch');

exports.handler = async function(event) {
  //if (event.httpMethod !== 'GET') {
 //   return {
 //     statusCode: 405,
 //     body: 'Method Not Allowed'
 //   };
 // }

  //const formData = JSON.parse(event.body);
  //console.log('formData');
  console.log(event.queryStringParameters);
  return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.queryStringParameters),
    },
  };
}
