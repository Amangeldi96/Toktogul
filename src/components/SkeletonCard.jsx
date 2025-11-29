import React from "react";
import "./css/skeletonCard.css";

export default function SkeletonCard() {
  return (
    <div className="card skeleton-card">
      <div className="img skeleton-img" />
      <div className="body">
        <div className="price skeleton-line short" />
        <div className="sub skeleton-line shorter" />
        <div className="title skeleton-line long" />
        <div className="phone skeleton-line shorter" />
      </div>
    </div>
  );
}
