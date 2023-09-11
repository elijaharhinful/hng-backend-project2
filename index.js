const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator");

// create an express app
const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "persondb",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
});

// to create a user
app.post(
  "/api",
  [check("name").isString().withMessage("Name must be a string")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // const msg = errors.formatWith((error) => error.msg);
      // return res.status(400).json({ errors: msg.array() });
      return res.status(400).json({ errors: errors.array() });
    }
    let name = req.body.name;
    let sql = "INSERT INTO persons (name) VALUES (?)";
    db.query(sql, [name], (err, result) => {
      if (err) throw err;
      res.send("Person added...");
    });
  }
);

// to retrieve user data
app.get("/api/:user_id", (req, res) => {
  let sql = "SELECT * FROM persons WHERE id = ?";
  db.query(sql, [req.params.user_id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// to update a user detail
app.put(
  "/api/:user_id",
  [check("name").isString().withMessage("Name must be a string")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let sql = "UPDATE persons SET name = ? WHERE id = ?";
    db.query(
      sql,
      [req.body.name, req.params.user_id],
      (err, result) => {
        if (err) throw err;
        res.send("Person updated...");
      }
    );
  }
);

// to delete user detail
app.delete("/api/:user_id", (req, res) => {
  let sql = "DELETE FROM persons WHERE id = ?";
  db.query(sql, [req.params.user_id], (err, result) => {
    if (err) throw err;
    res.send("Person deleted...");
  });
});

// listening to server on selected port
const port = process.env.PORT || 8000;
app.listen(port, () => {});
console.log(`Server is running on http://localhost:${port}`);
