const express = require("express");
const axios = require("axios");
const fs = require("fs");

const app = express();
app.use(express.json());

// 🔑 PUT YOUR ELEVENLABS API KEY HERE
const API_KEY = "YOUR_ELEVENLABS_API_KEY";

// Serve homepage
app.get("/", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>AniStory AI</title>
      <style>
        body {
          font-family: Arial;
          text-align: center;
          background: #111;
          color: white;
        }
        textarea {
          width: 80%;
          height: 150px;
          margin: 20px;
          padding: 10px;
        }
        button {
          padding: 10px 20px;
          background: #00ffcc;
          border: none;
          cursor: pointer;
        }
      </style>
    </head>
    <body>

      <h1>AniStory AI 🎬</h1>

      <textarea id="script" placeholder="Enter your story..."></textarea>
      <br>
      <button onclick="generate()">Generate Voice</button>
      <br><br>

      <audio id="audio" controls></audio>

      <script>
        async function generate() {
          const text = document.getElementById("script").value;

          const res = await fetch("/generate-voice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ text })
          });

          const data = await res.json();

          if (data.success) {
            const audio = document.getElementById("audio");
            audio.src = data.file;
            audio.play();
          } else {
            alert("Error generating voice");
          }
        }
      </script>

    </body>
    </html>
  `);
});

// Voice generation
app.post("/generate-voice", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios({
      method: "POST",
      url: "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
      },
      data: {
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7
        }
      },
      responseType: "arraybuffer"
    });

    fs.writeFileSync("voice.mp3", response.data);

    res.json({ success: true, file: "voice.mp3" });

  } catch (error) {
    res.status(500).json({ error: "Voice generation failed" });
  }
});

// Serve audio file
app.use(express.static(__dirname));

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
