const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

// In-memory store for URLs
const urlMap = {};
const baseUrl = 'http://localhost:3000/';

app.use(bodyParser.json());

// Route to shorten URL
app.post('/shorten', (req, res) => {
    const longUrl = req.body.url;
    if (!longUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Generate a unique ID for the shortened URL
    const id = crypto.randomBytes(4).toString('hex');
    const shortUrl = `${baseUrl}${id}`;

    // Store the URL mapping
    urlMap[id] = longUrl;

    res.json({ shortUrl });
});

// Route to handle redirection
app.get('/:id', (req, res) => {
    const id = req.params.id;
    const longUrl = urlMap[id];

    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send('Not Found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
