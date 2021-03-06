const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages!");
  }
});

app.get("/api/hello", (req, res) => {
  res.send({ message: "Hello!!!" });
});

app.post("/api/message", (req, res) => {
  const email = req.body.email;
  const message = req.body.message;
  const content = `email: ${email} \nmessage: ${message}`;
  const mail = {
    from: process.env.MAIL_ACCOUNT,
    to: "tuanthanh2067@gmail.com",
    subject: `Message from ${email}`,
    text: content,
  };

  transporter.sendMail(mail, (error, data) => {
    if (error) {
      res.status(404).json({ status: "fail" });
    } else {
      res.status(200).json({ status: "success" });
    }
  });
});

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
