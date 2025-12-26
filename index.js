import express from "express"
import fetch from "node-fetch"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json({ limit: "2mb" }))

const HF_TOKEN = process.env.HF_TOKEN
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0"

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt) return res.status(400).json({ error: "No prompt" })

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    )

    const buffer = await response.arrayBuffer()
    res.set("Content-Type", "image/png")
    res.send(Buffer.from(buffer))
  } catch (e) {
    res.status(500).json({ error: "Generation failed" })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("AuraGen backend running on", PORT)
})
