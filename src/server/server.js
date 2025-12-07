import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const CLOUD_NAME = "<сениң_cloud_name>";
const API_KEY = "<сениң_api_key>";
const API_SECRET = "<сениң_api_secret>";

// Cloudinary сүрөттү өчүрүү
app.post("/delete-image", async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ error: "No publicId provided" });

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_ids: [publicId] }),
    });

    const json = await response.json();
    res.json(json);
  } catch (err) {
    console.error("Cloudinary DELETE Error:", err);
    res.status(500).json({ error: "Cloudinary delete failed" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
