const fetch = require('node-fetch');

exports.handler = async function(event) {


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

   console.log(JSON.stringify(formdata))


var textbody = `name: ${formdata.fname} ${formdata.lname}\n email: ${formdata.email}\n phone: ${formdata.phone}\n`
var htmlbody = `name: ${formdata.fname} ${formdata.lname}<br> email: ${formdata.email}<br> phone: ${formdata.phone}<br>`

  try {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbz0yEPTZBGeGQpYSqOZ9-irRAOK4LbRxAwQrDkvpqU44MBVi_vExwRD3IRqK0QVMQXT/exec?'+qstring; // Replace with the API endpoint you want to fetch

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data)
    
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching data' }),
    };
  }
};

return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.body),
    },
  };
};

