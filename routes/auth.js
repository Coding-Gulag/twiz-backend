const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.collection('users').insertOne({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', userId: newUser.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
        console.log(error.message)
    }
});

module.exports = router;
