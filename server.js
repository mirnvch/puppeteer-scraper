const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing URL in request body" });
  }

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: "/opt/render/.cache/puppeteer/chrome/chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Удалим скрипты/стили, чтобы они не мешали тексту
    await page.evaluate(() => {
      document
        .querySelectorAll("script, style, noscript")
        .forEach((el) => el.remove());
    });

    const content = await page.evaluate(() => {
      return document.body.innerText || "";
    });

    await browser.close();

    return res.json({ text: content.trim() });
  } catch (err) {
    console.error("[SCRAPE ERROR]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Puppeteer scraper running at http://localhost:${PORT}`);
});
