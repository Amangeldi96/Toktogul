import cloudinary from "cloudinary";

// === Cloudinary конфигурациясы ===
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// === Vercel Serverless Function ===
export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: "publicId керек" });
    }

    try {
      const result = await cloudinary.v2.uploader.destroy(publicId);
      return res.json({ success: true, result });
    } catch (err) {
      console.error("Cloudinary өчүрүү катасы:", err);
      return res.status(500).json({ error: "Cloudinary өчүрүү мүмкүн болгон жок" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}