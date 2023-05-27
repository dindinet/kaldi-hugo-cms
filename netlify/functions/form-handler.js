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

  //try {

    const apiUrl = 'https://api.mailersend.com/v1/email'; // MailerSend API endpoint

    const requestBody = {
      to: [{ email: process.env.TO_EMAIL }], // Replace with recipient's email address
      from: { email: process.env.FROM_EMAIL }, // Replace with sender's email address
      subject: 'Health Questionaire Form',
      text: textbody,
      html: htmlbody,
    };

    const apiKey = process.env.MAILERSEND_KEY; // Replace with your MailerSend API key
    console.log(requestBody)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

   console.log(response)
   //const responseData = await response.json();
   // console.log(responseData)
    //return {
    //  statusCode: response.status,
     // body: JSON.stringify(responseData),
    //}; 
  
  /*
  catch (error) {
    console.error('Error sending email:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
  */
  

}

return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.body),
    },
  };
};

