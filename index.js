const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");

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
const app = express();
app.use(cors());
app.use(express.json());

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

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
