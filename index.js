require("dotenv").config();
const fs = require("fs");
const fsx = require('fs-extra');
const date = require("date-and-time");
const nodemailer = require("nodemailer");

async function sendEmail(toEmail, subject, text, fromEmail, fromPass, files) {
  // create reusable transporter object using the default SMTP transport

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", //replace with your SMTP host
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: fromEmail,
      pass: fromPass,
    },
  });

  let ataq = files.map((filename) => {
    return {
      filename: filename,
      path: "./upload/" + filename,
    };
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Sender Name" <${fromEmail}>`, // sender address
    to: toEmail, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    attachments: ataq
  });

  console.log(
    `Message sent: ${info.messageId} \n With the following attachments: ${ataq}`
  );

  try {
    fsx.emptyDirSync('./upload/');
    console.log('Folder content deleted successfully.');
  } catch (err) {
    console.error('Error deleting folder content:', err);
  }


}

// Path to the folder you want to monitor
const folderPath = "./upload";

// Function to check the folder for new content
function checkFolder() {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }
    if (files.length > 0) {
      //   console.log('New content found:', files);
      const subject = new Date();
      date.format(subject, "YYYY/MM/DD HH:mm:ss");
        console.log(files)
      // usage
      sendEmail(
        process.env.EMAIL,
        `Date: ${subject}`,
        "This is an automatic email",
        process.env.EMAIL,
        process.env.PASSWORD,
        files
      )
        .then(console.log("email sent"))
        .catch(console.error);
      // Perform desired operations on the new files here
    } else {
      //   console.log('No new content found.');
    }
  });
}

// Check the folder periodically every 5 seconds (adjust as needed)
setInterval(checkFolder, 5000);
