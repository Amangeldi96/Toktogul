import React, { useEffect } from 'react';
import './css/home.css';
import './css/main.css'; 
import './css/mai.css'; 
import { NavLink } from "react-router-dom";
import songs from './songs';


export default function Home() {
  useEffect(() => {
    const playlist = document.getElementById('playlist');
    let audioPlayer = null;
    let currentButton = null;

    const buttons = playlist.querySelectorAll('.play-button, .p-btn, .play-btn');

    const handleButtonClick = (e) => {
      const songSrc = e.target.closest('li').getAttribute('data-src');
      const button = e.target.closest('button');

      if (audioPlayer && audioPlayer.src.includes(songSrc)) {
        if (audioPlayer.paused) {
          audioPlayer.play();
          button.classList.remove('paused');
          button.classList.add('playing');
        } else {
          audioPlayer.pause();
          button.classList.remove('playing');
          button.classList.add('paused');
        }
      } else {
        if (audioPlayer) {
          audioPlayer.pause();
          if (currentButton) {
            currentButton.classList.remove('playing');
            currentButton.classList.add('paused');
          }
        }
        audioPlayer = new Audio(songSrc);
        audioPlayer.play();
        button.classList.remove('paused');
        button.classList.add('playing');
        currentButton = button;
      }
    };

    buttons.forEach(button => button.addEventListener('click', handleButtonClick));

    return () => {
      buttons.forEach(button => button.removeEventListener('click', handleButtonClick));
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, []);

  return (
    <div id="playlist" className="con">
      <h1 className='name'>Топ 5 новые песни</h1>
      <div className="block-con">
        <div className="content">
          {songs.slice(0, 5).map((song, index) => (
            <div key={index} className="block">
              <div className={`song-image im${index + 1}`}></div>
              <h3 className='artist'>{song.artist}</h3>
              <p className="title">{song.title}</p>
              <li data-src={song.src}>
                <button className="play-button pauser"></button>
              </li>
            </div>
          ))}
        </div>
      </div>

      <h1 className='name'>Хиты 2024</h1>
      <div className="xit-music">
        <div className="xit">
          {songs.slice(5).map((song, index) => (
            <div key={index} className="music-xit">
              <li data-src={song.src}>
                <button className="play-btn pauser"></button>
              </li>
              <h3 className="artist-name">{song.artist} - {song.title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="artist-im">
        <h1 className='name2'>7 лучших певцов</h1>
        <div className="artist-block">
          <NavLink to="Mirbek" className="ar">
            <div className="block-ar1 ar"></div>
            <h5 className="name-ar1">Мирбек Атабеков</h5>
          </NavLink>
          <NavLink to="Freeman" className="ar">
            <div className="block-ar2 ar"></div>
            <h5 className="name-ar2">Freeman 996</h5>
          </NavLink>
          <NavLink to="Jax" className="ar">
            <div className="block-ar3 ar"></div>
            <h5 className="name-ar3">Jax 02.14</h5>
          </NavLink>
          <NavLink to="Aftok" className="ar">
            <div className="block-ar4 ar"></div>
            <h5 className="name-ar4">Aftok</h5>
          </NavLink>
          <NavLink to="Ulukmanapo" className="ar">
            <div className="block-ar5 ar"></div>
            <h5 className="name-ar5">Ulukmanapo</h5>
          </NavLink>
          <NavLink to="Nurlan" className="ar">
            <div className="block-ar6 ar"></div>
            <h5 className="name-ar6">Нурлан Насип</h5>
          </NavLink>
          <NavLink to="Nurila" className="ar">
            <div className="block-ar7 ar"></div>
            <h5 className="name-ar7">Нурила</h5>
          </NavLink>
        </div>
      </div>
    </div>
  );
}