const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Cs84961426",
//   database: "users",
// });

const connection = mysql.createConnection({
  host: "bvbqlyto2sik183mzybt-mysql.services.clever-cloud.com",
  user: "uu423aahcmi2g2af",
  password: "U4QYH8cvSOtgFpJEe92a",
  database: "bvbqlyto2sik183mzybt",
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MySQL database!");
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;
    connection.query(createTableQuery, (err, results) => {
      if (err) {
        console.log("Error creating table:", err);
      } else {
        console.log("user_info table is ready.");
      }
    });
  }
});

// User Signup Endpoint
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const query =
    "INSERT INTO user_info (name, email, password) VALUES (?, ?, ?)";
  connection.query(query, [name, email, password], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to add user." });
    }
    res
      .status(200)
      .json({ message: "User added successfully!", userId: results.insertId });
  });
});

app.get("/signin", (req, res) => {
  const query = "SELECT * FROM user_info";
  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to retrieve users." });
    }
    res.status(200).json(results);
  });
});

// Stripe Checkout Session Endpoint
const YOUR_DOMAIN = "http://localhost:8090";

app.post("/create-checkout-session", async (req, res) => {
  const totalAmount = req.body.totalAmount;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Total Purchase",
            },
            unit_amount: totalAmount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = 8050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
