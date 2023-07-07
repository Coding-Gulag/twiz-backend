const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/signup', async (req, res) => {
    let { username, email, password } = req.body;

    email = email.toLowerCase();

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const db = req.app.locals.db;

        const usernameExists = await db.collection('users').findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const emailExists = await db.collection('users').findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.collection('users').insertOne({ username, email, password: hashedPassword });

        res.status(201).json({
            message: 'User created successfully',
            userId: newUser.insertedId,
            username: newUser.username,
            email: newUser.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
});


router.post('/login', async (req, res) => {
    let { identifier, password } = req.body;
    identifier = identifier.toLowerCase();

    try {
        const db = req.app.locals.db;

        // Check if the user exists using either username or email
        const user = await db.collection('users').findOne({
            $or: [{ username: identifier }, { email: identifier }],
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(400).json({ message: 'Invalid username/email or password' });
        }

        // User is authenticated
        res.status(200).json({
            message: 'Logged in successfully',
            userId: user._id,
            username: user.username,
            email: user.email
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
});



module.exports = router;
