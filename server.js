const express = require('express');

const app = express();
app.use(express.json());

app.post('/submit', async (req, res) => {
  const { name, content, userId } = req.body;

  if (
    typeof name !== 'string' ||
    typeof content !== 'string' ||
    typeof userId !== 'string' ||
    !name.trim() ||
    !content.trim()
  ) {
    return res.status(400).json({ success: false });
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;

  if (!webhook) {
    return res.status(500).json({ success: false });
  }

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title: '새 설문 접수',
          fields: [
            { name: '이름', value: name.trim().slice(0, 80) },
            { name: '내용', value: content.trim().slice(0, 1000) }
          ],
          timestamp: new Date().toISOString()
        }]
      })
    });

    if (!response.ok) {
      return res.status(502).json({ success: false });
    }

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
