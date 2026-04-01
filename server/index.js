import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Allow requests from the front-end (Vite dev server)
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.json({ ok: true }));

app.post('/api/submit-form', async (req, res) => {
  try {
    const payload = req.body || {};

    // Build multipart/form-data to forward to web3forms
    const form = new FormData();
    Object.keys(payload).forEach((key) => {
      // Skip undefined
      if (typeof payload[key] !== 'undefined' && payload[key] !== null) {
        form.append(key, String(payload[key]));
      }
    });

    // Prefer server-side env var if present
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      form.set('access_key', process.env.WEB3FORMS_ACCESS_KEY);
    }

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const result = await response.json();
      return res.status(response.status).json(result);
    } else {
      // If web3forms returned HTML (error page) or plain text, capture it and forward for debugging
      const text = await response.text();
      console.error('web3forms returned non-json response:', text);
      res.status(response.status).type('text').send(text);
      return;
    }
  } catch (err) {
    console.error('Error proxying to web3forms:', err);
    return res.status(500).json({ success: false, message: 'Proxy error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
