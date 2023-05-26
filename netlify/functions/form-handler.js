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

   console.log(JSON.stringify(formdata))

// Send email using mailersend API
var textbody = `name: {$formdata.fname} {$formdata.lname}\n email: {$formdata.email}\n phone: {$formdata.phone}\n`
var htmlbody = `name: {$formdata.fname} {$formdata.lname}<br> email: {$formdata.email}<br> phone: {$formdata.phone}<br>`
var emailmessage = JSON.stringify({
  "from": {"email": "info@thaiyom.com", "name": "Web Form"},
      "to": [{"email": "elena@dindi.net"},{"email":"dklongley@gmail.com"}],
  "subject": "Health Questionaire",
  "text": textbody,
  "html": htmlbody
})

fetch('https://api.mailersend.com/v1/email', {
method: 'POST',
body: emailmessage,
headers: {
'Content-type': 'text/html; charset=UTF-8',
'Authorization': 'Bearer mlsn.be2cae5b751cea33edd0b813abacccb31ee9f0269b1425b05333c5fba6c6566a',
},
})
.then((response) => response.json())
.then((json) => console.log(json));
   
console.log(emailmessage)
  return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.body),
    },
  };
};
}
