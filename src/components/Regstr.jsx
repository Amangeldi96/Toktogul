import React from "react";
import './css/regstr.css'


export default function Regstr() {
	return (
		<div class="block-chek">
		<h1 className="h1">Регистрация</h1>
		<p className="p1">Music.kg</p>
		<input className="input" type="text" placeholder="Email или телефон" /> <br />
              <input className="input" type="password" placeholder="пароль" /> <br />
							<input className="input" type="password" placeholder="повтороит парль" /> <br />
              <button className="vx">Регистрация</button>
	</div>
	)
}