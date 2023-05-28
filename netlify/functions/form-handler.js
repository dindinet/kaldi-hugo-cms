const fetch = require('node-fetch');

exports.handler = async function(event) {

// == GET ==
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
// == POST ==
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

// Airtable  POST
    var atdata = {}
    atdata["fields"] = formdata;
    var health_url = 'https://api.airtable.com/v0/appBRoeXT5DKvfDLa/health';
    //const apiKey = process.env.AIRTABLE_KEY; // Replace with your MailerSend API key
    const newHealthRecord = await fetch(health_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_KEY}`,
      },
      body: JSON.stringify(atdata), 
    });
    let returnedrecord = await newHealthRecord.json();
console.log('Here comes the returnedrecord')
console.log(JSON.stringify(returnedrecord))
console.log(JSON.stringify(returnedrecord.id))
var healthRecordId = returnedrecord.id
//console.log(healthRecordId)

// STARTGoogle Apps Script 
/*
  try {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbz0yEPTZBGeGQpYSqOZ9-irRAOK4LbRxAwQrDkvpqU44MBVi_vExwRD3IRqK0QVMQXT/exec?'+qstring; // Replace with the API endpoint you want to fetch

    const response = await fetch(apiUrl);
    const data = await response.json();
    var healthRecordId = data.healthRecordid
    console.log(data.healthRecordid)
    
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching data' }),
    };
  }
  */ // END Google Apps Script

  var textbody = `name: ${formdata.fname} ${formdata.lname}\n email: ${formdata.email}\n phone: ${formdata.phone}\n`
  var htmlbody = `name: ${formdata.fname} ${formdata.lname}<br> email: ${formdata.email}<br> phone: ${formdata.phone}<br><br><a href="https://airtable.com/appBRoeXT5DKvfDLa/tblzoCa2sjvxKgiaD/viwzuaSUywHuSl7Nh/${healthRecordId}?blocks=hide">View in Database</a>` 

  //try {

    const apiUrl = 'https://api.mailersend.com/v1/email'; // MailerSend API endpoint

    const requestBody = {
      to: [{ email: process.env.TO_EMAIL }],
      bcc: [{ email: process.env.BCC_EMAIL }],
      from: { email: process.env.FROM_EMAIL }, 
      subject: 'Health Questionaire Form',
      text: textbody,
      html: htmlbody,
    };

    //</br>const apiKey = process.env.MAILERSEND_KEY; // Replace with your MailerSend API key
    console.log(requestBody)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERSEND_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

   console.log(JSON.stringify(response))
   

}

return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.body),
    },
  };
};

