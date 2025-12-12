import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cloudinary from "cloudinary";

// === Cloudinary конфигурациясы ===
cloudinary.v2.config({
  cloud_name: "dqzgtlvlu",
  api_key: "455915719989692",      // сенин API key
  api_secret: "OhiueYXedMfKIID0vOhUpgs2wT0", // сенин Cloudinary secret, фронтендке салбоо
});

const app = express();

// === Орточо middleware ===
app.use(cors());
app.use(bodyParser.json());

// === Өчүрүү API ===
app.delete("/delete-image", async (req, res) => {
  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ error: "publicId керек" });
  }

  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Cloudinary өчүрүү катасы:", err);
    res.status(500).json({ error: "Cloudinary өчүрүү мүмкүн болгон жок" });
  }
});

// === Серверди иштетүү ===
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
