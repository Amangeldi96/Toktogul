export const config = {
  runtime: "nodejs",
};

import cloudinary from "cloudinary";

// ✅ Cloudinary ТУУРА конфигурация
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔍 Текшерүү үчүн лог
console.log("🌐 Cloudinary ENV:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✅ бар" : "❌ жок",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ бар" : "❌ жок",
});

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { publicId } =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    console.log("🧹 Өчүрүлүп жаткан publicId:", publicId);

    if (!publicId || typeof publicId !== "string") {
      return res.status(400).json({ error: "publicId жарактуу текст болушу керек" });
    }

    const result = await cloudinary.v2.uploader.destroy(publicId);

    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("❌ Cloudinary API катасы:", err);
    return res.status(500).json({ error: err.message });
  }
}
