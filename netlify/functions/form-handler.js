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
  if (event.httpMethod == 'GET') {
    console.log('GET')
  console.log(event.queryStringParameters);
  return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.queryStringParameters),
    },
  };
};
if (event.httpMethod == 'POST') {
  console.log('POST')
  console.log(JSON.stringify(event.body));
  return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.body),
    },
  };
};
}
