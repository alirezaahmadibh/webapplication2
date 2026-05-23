const formData = require('form-data'); // Import the form-data library to handle form data when sending emails with attachments (not used in the provided code but can be implemented for sending emails with attachments)
const Mailgun = require('mailgun.js'); // Import the Mailgun library to send emails using the Mailgun API
const mailgun = new Mailgun(formData); // Create a new instance of the Mailgun client, passing in the formData library for handling form data
const mg = mailgun.client({ username: 'api', key: 'your_mailgun_api_key' }); // Create a Mailgun client with the specified username and API key for authentication

mg.Mailgun.messages.create('sandbox-123.mailgun.org', {
  from: 'Excited User <mailgun@sandbox-123.mailgun.org>',
  to: ['test@example.com'],
    subject: 'Hello',
    text: 'Testing some Mailgun awesomeness!',
    html: '<html>Testing some Mailgun awesomeness!</html>',
})
.then(msg => console.log(msg)) // Log the response message from Mailgun if the email is sent successfully
.catch(err => console.error(err)); // Log any errors that occur during the email sending process    
