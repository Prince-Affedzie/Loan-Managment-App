const africastalking = require('africastalking')

const credentials = {
    apiKey: 'atsk_d2b03e3411190601b8b6144459a427bc9d6c4e680f8d7dbeb6d5d0c7285f17cf27038164',      // Replace with your Africa's Talking API key
    username: 'sandbox'    // Use 'sandbox' if you're in development mode
  };
  
  // Initialize the SDK with your credentials
  const at = africastalking(credentials);
  
  // Get the SMS service
  const sms = at.SMS;

function sendSMS(to,message) {
    const options = {
        to: to,    // Replace with the recipient phone number (international format)
        message: message,  // Your message
       // from: 'YourSenderId'     // Optional: Use a registered Sender ID (if available)
    };

    sms.send(options)
        .then(response => {
            console.log(response);  // Log the successful response
        })
        .catch(error => {
            console.log(error);    // Log any error
        });
}

// Call the function to send the SMS
module.exports = sendSMS