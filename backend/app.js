require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.listen(3001, () => console.log('✅ Backend running on http://localhost:3001'));
