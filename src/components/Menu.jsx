import React, { useEffect } from "react";
import './css/menu.css';
import './css/popup.css';
import { NavLink, useLocation } from "react-router-dom";
import login from './img/Frame.svg'; 

export default function Menu() {
  const location = useLocation();

  useEffect(() => {
    const checkbox = document.getElementById("p1");
    if (checkbox) {
      checkbox.checked = false; 
    }
  }, [location]); 

  return (
    <div className="center">
      <div className="container">
        <h2 className="logo">Music</h2>
        <nav>
          <NavLink to="/">Главный</NavLink>
          <NavLink to="Album">Альбом</NavLink>
          <NavLink to="Genre">Жанр</NavLink>
        </nav>
        <input type="checkbox" className="hide" id="p1" />
        <label htmlFor="p1" className="button">
          <img src={login} alt="Вход" />
        </label>
        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>войти</h2>
            <label htmlFor="p1" className="close">&times;</label>
            <div className="content-vxod">
              <input type="text" placeholder="Email или телефон" /> <br />
              <input type="password" placeholder="пароль" /> <br />
              <button className="vxod">войти</button>
          <div className="b-block">
						<div className="g-block">
						<p className="text-b">у меня нет аккаунт</p> <br /> 
						<NavLink className="regs" to="Regstr">Регистрация</NavLink>
						</div>
						<div className="g-block">
						<input type="checkbox" className="hide" id="p1" />
        <label htmlFor="p1" className="button butn3">
           Забыл пароль
        </label>
        <div id="popup1" className="overlay">
          <div className="popup">
            <h2>Забыл пароль</h2>
            <label htmlFor="p1" className="close">&times;</label>
            <div className="content-vxod">
              <input type="text" placeholder="Email или телефон" /> <br />
              <button className="vxod">Отправить</button>
						</div>
					</div>
					</div>
					</div>
					</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}