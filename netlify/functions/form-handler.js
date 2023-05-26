const fetch = require('node-fetch');
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

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

var textbody = `name: ${formdata.fname} ${formdata.lname}\n email: ${formdata.email}\n phone: ${formdata.phone}\n`
var htmlbody = `name: ${formdata.fname} ${formdata.lname}<br> email: ${formdata.email}<br> phone: ${formdata.phone}<br>`

const mailersend = new MailerSend({
  api_key: process.env.MAILERSEND_KEY,
});

const recipients = [new Recipient("elena@dindi.net", "Your Client")];
const bcc = [ new Recipient("your_bcc@client.com", "Your Client BCC")];

const emailParams = new EmailParams()
  .setFrom("info@thaiyom.com")
  .setFromName("Web Form")
  .setRecipients(recipients)
  .setBcc(bcc)
  .setSubject("Health Questionaire")
  .setHtml(textbody)
  .setText(htmlbody);

mailersend.send(emailParams);

console.log(emailParams)
   

  return {
    statusCode: 302,
    headers: {
        "Location": "/thanks.html?" + new URLSearchParams(event.body),
    },
  };
};
}
