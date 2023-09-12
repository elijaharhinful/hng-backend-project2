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

// root
app.get("/api", (req, res) => {
  return res.status(200).json({
    message:
      "api is working, follow instructions to make real time requests to the api!",
  });
});

// to create a user
app.post(
  "/api",
  [check("name").isString().withMessage("Name must be a string")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let name = req.body.name;
      if (!name) {
        return res
          .status(400)
          .json({ status: false, message: "Please provide a name" });
      }
      let sql = "INSERT INTO persons (name) VALUES (?)";
      db.query(sql, [name], (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ status: false, message: "Error creating person", result });
        }
        res.status(201).json({
          status: true,
          message: "Person created succesfully",
          data: {
            name: name,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({ message: "Error creating person", error });
    }
  }
);

// to retrieve user data
app.get(
  "/api/:user_id",
  [check("user_id").isString().withMessage("Name must be a string")],
  (req, res) => {
    let user_id = req.params.user_id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let sql = "SELECT * FROM persons WHERE id = ?";
      db.query(sql, [user_id], (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Error retrieving person data", err });
        }
        if (isNaN(user_id) || result.length === 0) {
          return res.status(404).json({
            status: false,
            message: `No Person found with id: ${user_id}`,
          });
        }
        let data = result[0];
        res.status(200).json({
          status: true,
          message: "Person found",
          data,
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving person", error });
    }
  }
);

// to update a user detail
app.put(
  "/api/:user_id",
  [check("user_id").isString().withMessage("Id must be a string")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let name = req.body.name;
    let user_id = req.params.user_id;
    try {
      let sql = "UPDATE persons SET name = ? WHERE id = ?";
      db.query(sql, [name, user_id], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Error updating person", err });
        }
        if (isNaN(user_id) || result.length === 0) {
          return res.status(404).json({
            status: false,
            message: `No Person found with id: ${user_id}`,
          });
        }
        let person = {
          id: user_id,
          name: name,
        };
        res.status(200).json({
          status: true,
          message: "Person updated succefully",
          data: { person },
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating person", error });
    }
  }
);

// to delete user detail
app.delete(
  "/api/:user_id",
  [check("user_id").isString().withMessage("Id must be a string")],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user_id = req.params.user_id;
    try {
      let sql = "DELETE FROM persons WHERE id = ?";
      db.query(sql, [user_id], (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ message: "Error deleting person", err });
        }
        if (isNaN(user_id) || result.affectedRows === 0) {
          return res.status(404).json({
            status: false,
            message: `No Person found with id: ${user_id}`,
          });
        }
        res.status(204).json({
          status: true,
          message: "Person deleted successfully",
        });
      });
    } catch (error) {
      res.status(500).json({ message: "Error deleting person", error });
    }
  }
);

// listening to server on selected port
const port = process.env.PORT || 8000;
app.listen(port, () => {});
console.log(`Server is running on http://localhost:${port}`);
