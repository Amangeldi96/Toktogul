import React from "react";

export default function AlbumItem({ albumClass, albumName }) {
  return (
    <div className="album">
      <div className={albumClass}></div>
      <h5 className="name-album">{albumName}</h5>
    </div>
  );
}