// SkeletonLoader.jsx
import React from "react";
import "./css/skeleton.css"; // стили skeleton

export default function SkeletonLoader({ width = "100%", height = "200px" }) {
  return <div className="skeleton" style={{ width, height }}></div>;
}
