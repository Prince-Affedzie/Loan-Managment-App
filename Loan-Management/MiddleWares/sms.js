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