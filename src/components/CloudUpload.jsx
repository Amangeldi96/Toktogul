import React, { useState } from "react";

export default function CloudUpload({ onUpload }) {
  const [preview, setPreview] = useState("");

  async function uploadToCloudinary(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "toktogul"); // твой preset
    data.append("cloud_name", "dqzgtlvlu");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqzgtlvlu/image/upload",
      { method: "POST", body: data }
    );

    const json = await res.json();
    return json.secure_url;
  }

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const url = await uploadToCloudinary(file);

    if (onUpload) onUpload(url);
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />

      {preview && (
        <img
          src={preview}
          alt=""
          style={{ width: 150, marginTop: 10, borderRadius: 10 }}
        />
      )}
    </div>
  );
}
