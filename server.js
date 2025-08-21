// server.js
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Удалим скрипты и стили, чтобы не мешали
    await page.evaluate(() => {
      document
        .querySelectorAll("script, style, noscript")
        .forEach((el) => el.remove());
    });

    const content = await page.evaluate(() => document.body.innerText);

    await browser.close();

    res.json({ text: content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Puppeteer scraper running at http://localhost:${PORT}`);
});
