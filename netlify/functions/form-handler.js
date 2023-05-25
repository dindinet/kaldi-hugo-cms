import fetch from 'node-fetch';

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const formData = JSON.parse(event.body);
console.log(formData);
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbxCg6EMHb1lk5HhFr0VoGIbUw8mylhq9OSpyFGmnuiMbtkAGKgm0XE19puQWebqwJPW/exec', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to submit form to remote API');
    }

    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(response.data)
    } 
  } catch(err){
    body: JSON.stringify({
      status: 'FAIL',
      message: err.message
    })
  }
  }
