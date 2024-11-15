const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

// List of security headers to check
const securityHeaders = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-XSS-Protection",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Expect-CT",
    "Cross-Origin-Opener-Policy",
    "Permissions-Policy",
    "X-DNS-Prefetch-Control",
    "Cross-Origin-Resource-Policy",
    "Cross-Origin-Embedder-Policy",
    "Access-Control-Allow-Origin",
];

// Middleware to parse JSON request body
app.use(express.json());

// Serve the frontend
app.get("/api", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint to check security headers
app.post('/api/headers', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Please provide a valid URL.' });
    }

    try {
        // Perform a HEAD request to fetch headers
        const response = await axios.head(url, { validateStatus: () => true });

        // Prepare the headers report
        const headersReport = {};
        securityHeaders.forEach(header => {
            headersReport[header] = response.headers[header.toLowerCase()] || "missing";
        });

        // Return the report
        res.json({ url, headers: headersReport });
    } catch (error) {
        console.error('Error fetching headers:', error.message);
        res.status(500).json({ error: 'Failed to fetch headers' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
