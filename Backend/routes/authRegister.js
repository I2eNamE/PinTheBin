const express = require('express');
const bcrypt = require('bcrypt');

const conn = require('../database.js');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const { email, name, password, confirmPassword } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send({ error: true, message: "Password mismatch" });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Define your SQL commands
        const commandAdd = `INSERT INTO user_info (email, display_name, username, password, dob) VALUES (?, ?, ?, ?, ?)`;
        const commandSearch = `SELECT * FROM user_info WHERE email = ?`;

        // Check if the email already exists in the database
        conn.query(commandSearch, [email], async (err, result) => {
            if (err) {
                res.send(err);
            } else if (result.length !== 0) {
                res.status(409).send({
                    ok: false,
                    error: "Email already exists in the database"
                });
            } else {
                // Store the hashed password in the database
                conn.query(commandAdd, [email, name, email, hashedPassword, null], (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send({
                            ok: false,
                            error: "Error while creating a new user"
                        });
                    } else {
                        res.status(200).send({
                            ok: true
                        });
                    }
                });
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
