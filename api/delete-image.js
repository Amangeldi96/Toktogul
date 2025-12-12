import cloudinary from "cloudinary";

// === Cloudinary конфигурациясы ===
console.log("🌐 Cloudinary конфигурация:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET ? "✅ бар" : "❌ жок",
});

// === Vercel Serverless Function ===
export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      // 👇 req.body кээде string болуп келет — парсинг кыл
      const { publicId } = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      console.log("🧹 Cloudinary сүрөт өчүрүү суроосу:", publicId);

      if (!publicId || typeof publicId !== "string") {
        return res.status(400).json({ error: "publicId жарактуу текст болушу керек" });
      }

      const result = await cloudinary.v2.uploader.destroy(publicId);

      if (result.result === "ok") {
        return res.status(200).json({ success: true, result });
      } else {
        console.error("❌ Cloudinary жооп:", result);
        return res.status(500).json({ error: "Cloudinary сүрөт өчүрө алган жок", result });
      }
    } catch (err) {
      console.error("❌ Cloudinary API катасы:", err);
      return res.status(500).json({ error: "Cloudinary API катасы", details: err.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}