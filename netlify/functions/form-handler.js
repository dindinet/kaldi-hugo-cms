const fetch = require('node-fetch');

exports.handler = async function(event) {
  //if (event.httpMethod !== 'GET') {
 //   return {
 //     statusCode: 405,
 //     body: 'Method Not Allowed'
 //   };
 // }


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
  var qstring = new URLSearchParams(event.body)
  var formdata = Object.fromEntries(qstring);
  console.log(formdata)
  theConditionsWeFound = [];
  for (const [key, value] of Object.entries(formdata))
   if(key.includes('cb_conditions_')){
     theConditionsWeFound.push(key.replace('cb_conditions_', '').replace(/_/g,' '));
     delete formdata[key];
   }
   formdata['cb_conditions'] = theConditionsWeFound.toString();

   console.log(formdata)

  return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.body),
    },
  };
};
}
