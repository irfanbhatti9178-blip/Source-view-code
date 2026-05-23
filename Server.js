const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const cache = new Map();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("URL required");

    if (cache.has(targetUrl)) return res.send(cache.get(targetUrl));

    try {
        const response = await fetch(targetUrl);
        const data = await response.text();
        cache.set(targetUrl, data);
        setTimeout(() => cache.delete(targetUrl), 300000);
        res.send(data);
    } catch (err) {
        res.status(500).send("Error fetching content");
    }
});

app.listen(PORT, () => console.log('Proxy running...'));
