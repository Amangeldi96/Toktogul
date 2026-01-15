import React, { useState } from "react";

export default function CloudUpload({ onUpload }) {
  const [preview, setPreview] = useState("");
  const [type, setType] = useState("image"); // файл түрүн сактоо

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "cmpoo6ij"); // 👈 preset атын туура жаз

    // Сүрөт же видео URL
    const url = file.type.startsWith("video")
      ? "https://api.cloudinary.com/v1_1/dqzgtlvlu/video/upload"
      : "https://api.cloudinary.com/v1_1/dqzgtlvlu/image/upload";

    const res = await fetch(url, { method: "POST", body: data });
    const json = await res.json();

    if (!json.secure_url) {
      alert("Ошибка загрузки файла в Cloudinary");
      return null;
    }

    return {
      url: json.secure_url,
      publicId: json.public_id,
      type: file.type.startsWith("video") ? "video" : "image",
    };
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setType(file.type.startsWith("video") ? "video" : "image");
    setPreview(URL.createObjectURL(file));

    const result = await uploadToCloudinary(file);
    if (result && onUpload) onUpload(result);
  };

  return (
    <div>
      <input type="file" accept="image/*,video/*" onChange={handleChange} />
      {preview && type === "image" && (
        <img
          src={preview}
          alt=""
          style={{ width: 150, marginTop: 10, borderRadius: 10 }}
        />
      )}
      {preview && type === "video" && (
        <video
          src={preview}
          controls
          style={{ width: 200, marginTop: 10, borderRadius: 10 }}
        />
      )}
    </div>
  );
}