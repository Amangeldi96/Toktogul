import React from "react";
import './css/album.css';
import AlbumItem from "./AlbumItem"; // Renamed component for clarity

export default function Album() {
  const albums = [
    { albumClass: "album-block1", albumName: "Мирбек Аиабеков" },
    { albumClass: "album-block2", albumName: "Jax 02.14" },
    { albumClass: "album-block3", albumName: "Гулжигит Сатыбеков" },
    { albumClass: "album-block4", albumName: "Нурлан Насип" },
    { albumClass: "album-block5", albumName: "Илъяз Абдыразаков" },
    { albumClass: "album-block6", albumName: "Мирлан Баеков" },
    { albumClass: "album-block7", albumName: "Нурайым Акылбекова" },
    { albumClass: "album-block8", albumName: "Xamdam Sobirov" },
    { albumClass: "album-block9", albumName: "Муниса Ризаева" },
    { albumClass: "album-block10", albumName: "Райм" },
    { albumClass: "album-block11", albumName: "Рахымжан Жакайым" },
    { albumClass: "album-block12", albumName: "Ajiniyaz Xojambergenov" },
    { albumClass: "album-block13", albumName: "Нурила" },
    { albumClass: "album-block14", albumName: "Бек Борбиев" },
    { albumClass: "album-block15", albumName: "Кайрат Нуртас" },
  ];

  return (
    <div className="album-container">
      <h1 className='name'>Альбом</h1>
      <div className="container-al">
        {albums.map((album, index) => (
          <AlbumItem key={index} albumClass={album.albumClass} albumName={album.albumName} />
        ))}
      </div>
    </div>
  );
}