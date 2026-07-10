const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;
const YTDLP = path.join(__dirname, "yt-dlp.exe");
const DOWNLOADS = path.join(__dirname, "downloads");

if (!fs.existsSync(DOWNLOADS)) fs.mkdirSync(DOWNLOADS);

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>YT Downloader</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f0f;
          font-family: 'Segoe UI', sans-serif;
          color: #fff;
        }
        .card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        h1 { font-size: 1.5rem; font-weight: 700; }
        h1 span { color: #ff4444; }
        p { color: #888; font-size: 0.9rem; }
        input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #333;
          background: #111;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          transition: border 0.2s;
        }
        input:focus { border-color: #ff4444; }
        .buttons { display: flex; gap: 10px; }
        button {
          flex: 1;
          padding: 13px;
          border-radius: 10px;
          border: none;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        button:hover { opacity: 0.85; }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        #btn-video { background: #ff4444; color: #fff; }
        #btn-audio { background: #222; color: #fff; border: 1px solid #333; }
        #status {
          font-size: 0.85rem;
          color: #aaa;
          min-height: 20px;
          text-align: center;
        }
        #status.error { color: #ff6b6b; }
        #status.success { color: #4caf50; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>YT <span>Downloader</span></h1>
        <p>Paste a YouTube URL and choose your format.</p>
        <input id="url-input" type="text" placeholder="https://www.youtube.com/watch?v=..." autofocus />
        <div class="buttons">
          <button id="btn-video" onclick="startDownload('video')">⬇ Video (MP4)</button>
          <button id="btn-audio" onclick="startDownload('audio')">🎵 Audio (MP3)</button>
        </div>
        <div id="status"></div>
      </div>

      <script>
        async function startDownload(type) {
          const url = document.getElementById("url-input").value.trim();
          const status = document.getElementById("status");
          const btnVideo = document.getElementById("btn-video");
          const btnAudio = document.getElementById("btn-audio");

          if (!url) {
            status.textContent = "⚠ Paste a URL first.";
            status.className = "error";
            return;
          }

          status.textContent = "⏳ Downloading... please wait.";
          status.className = "";
          btnVideo.disabled = true;
          btnAudio.disabled = true;

          try {
            const res = await fetch("/download/" + type, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url })
            });

            const data = await res.json();

            if (data.success) {
              // Trigger file download
              window.location.href = "/file/" + encodeURIComponent(data.filename);
              status.textContent = "✅ Done! Check your downloads folder.";
              status.className = "success";
            } else {
              status.textContent = "❌ Error: " + data.error;
              status.className = "error";
            }
          } catch (err) {
            status.textContent = "❌ Something went wrong.";
            status.className = "error";
          }

          btnVideo.disabled = false;
          btnAudio.disabled = false;
        }
      </script>
    </body>
    </html>
  `);
});

// ── Parse JSON body ────────────────────────────────────────────────────────
app.use(express.json());

// ── Helper: run yt-dlp and save to disk ───────────────────────────────────
function runYtdlp(args) {
  return new Promise((resolve, reject) => {
    console.log("[yt-dlp] running:", args.join(" "));
    const proc = spawn(YTDLP, args);
    let stderr = "";

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
      console.error("[yt-dlp]", d.toString().trim());
    });

    proc.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr));
    });

    proc.on("error", reject);
  });
}

// ── Download: Video ────────────────────────────────────────────────────────
app.post("/download/video", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ success: false, error: "No URL provided." });

  const filename = `video_${Date.now()}.mp4`;
  const filepath = path.join(DOWNLOADS, filename);

  try {
    await runYtdlp([
      "-f", "best[ext=mp4]/best",
      "-o", filepath,
      "--no-playlist",
      "--no-warnings",
      url
    ]);
    res.json({ success: true, filename });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// ── Download: Audio ────────────────────────────────────────────────────────
app.post("/download/audio", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.json({ success: false, error: "No URL provided." });

  const filename = `audio_${Date.now()}.mp3`;
  const filepath = path.join(DOWNLOADS, filename);

  try {
    await runYtdlp([
      "-f", "bestaudio/best",
      "-o", filepath,
      "--no-playlist",
      "--no-warnings",
      "--cookies", "./cookies.txt",
      url
    ]);
    res.json({ success: true, filename });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});

// ── Serve file to browser ──────────────────────────────────────────────────
app.get("/file/:filename", (req, res) => {
  const filepath = path.join(DOWNLOADS, req.params.filename);
  if (!fs.existsSync(filepath)) return res.status(404).send("File not found.");
  res.download(filepath);
});

// ── Start ──────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Running at http://localhost:${PORT}`);
});