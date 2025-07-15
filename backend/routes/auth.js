const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

const JWT_SECRET = 'your_secret_key';  // 建议后续放入 .env 文件

// 注册接口
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO User (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hashed]);
        res.json({ message: '✅ User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: '❌ Registration failed', details: err.message });
    }
});

// 登录接口
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
        if (!rows.length) return res.status(400).json({ error: '❌ Invalid credentials' });

        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(400).json({ error: '❌ Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: '❌ Login failed', details: err.message });
    }
});

module.exports = router;
