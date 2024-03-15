const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json()); // Accepter les formats json
app.use(cors()); // Autoriser les requettes de toutes origines

// Configuration Mailgun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Romain Mosser",
  key: process.env.MAILGUN_API_KEY,
});

app.get("/", (req, res) => {
  try {
    res.status(200).json("Server running.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/form", async (req, res) => {
  try {
    // Destructuration des données envoyées via le formulaire en front
    const { firstname, lastname, email, message } = req.body;

    // Création d'un objet contenant les informations envoyées via le formulaire
    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: process.env.MAILGUN_RECIPIENT,
      subject: `Message from Tripadvisor`,
      text: message,
    };

    // Création d'un message Mailgun
    const response = await client.messages.create(
      process.env.MAILGUN_URI,
      messageData
    );

    res.status(200).json("Message sent.");
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

app.all("*", (req, res) => {
  try {
    res.json("This route does not exist.");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running.");
});
