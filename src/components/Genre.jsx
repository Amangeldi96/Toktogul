import React from "react";
import { NavLink} from "react-router-dom";
import './css/genre.css'

export default function Genre({genreName}){
	return(
	<div className="genre">
		<h1 className='name'>Жанр</h1>
		<table className="table">
		<tr className="tr">
				<td className="td"><NavLink to="">Шансон</NavLink></td>
				<td className="td"><NavLink to="">Зарубежный рэп</NavLink></td>
				<td className="td"><NavLink to="">Dubstep</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Русский рэп</NavLink></td>
				<td className="td"><NavLink to="">Dance & House</NavLink></td>
				<td className="td"><NavLink to="">Drum & BassTrap</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Deep House</NavLink></td>
				<td className="td"><NavLink to="">Русский Deep House</NavLink></td>
				<td className="td"><NavLink to="">Hip-hop</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Electro-house</NavLink></td>
				<td className="td"><NavLink to="">Hard Electro</NavLink></td>
				<td className="td"><NavLink to="">Minimal Techno</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Dream house</NavLink></td>
				<td className="td"><NavLink to="">Eurodance</NavLink></td>
				<td className="td"><NavLink to="">Techno</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Инструментальная музыка</NavLink></td>
				<td className="td"><NavLink to="">Классическая музыка</NavLink></td>
				<td className="td"><NavLink to="">Соул</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">R'n'b</NavLink></td>
				<td className="td"><NavLink to="">Metal</NavLink></td>
				<td className="td"><NavLink to="">Industrial Metal</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Русский поп</NavLink></td>
				<td className="td"><NavLink to="">Зарубежный поп</NavLink></td>
				<td className="td"><NavLink to="">Indie Pop</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Electropop & Disco</NavLink></td>
				<td className="td"><NavLink to="">Nu-disco</NavLink></td>
				<td className="td"><NavLink to="">K-pop</NavLink> </td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Русский рок</NavLink></td>
				<td className="td"><NavLink to="">Зарубежный рок</NavLink></td>
				<td className="td"><NavLink to="">Indie Rock</NavLink> className="td"</td>
			</tr>


			<tr className="tr">
				<td className="td"><NavLink to="">Punk Rock</NavLink></td>
				<td className="td"><NavLink to="">Hardcore</NavLink></td>
				<td className="td"><NavLink to="">Rock'n'roll</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Trance</NavLink></td>
				<td className="td"><NavLink to="">Vocal Trance</NavLink></td>
				<td className="td"><NavLink to="">Блюз</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Джаз</NavLink></td>
				<td className="td"><NavLink to="">Reggae</NavLink></td>
				<td className="td"><NavLink to="">Alternative</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Музыка в машину</NavLink></td>
				<td className="td"><NavLink to="">Клубная Музыка</NavLink></td>
				<td className="td"><NavLink to="">Танцевальная музыка</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Electro Dance</NavLink></td>
				<td className="td"><NavLink to="">Французские новинки</NavLink></td>
				<td className="td"><NavLink to="">Аниме</NavLink></td>
			</tr>
			<tr className="tr">
				<td className="td"><NavLink to="">Песни для детей</NavLink></td>
				<td className="td"><NavLink to="">Новинки рингтонов</NavLink></td>
				<td className="td"><NavLink to="">Советские песни</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Chillout</NavLink></td>
				<td className="td"><NavLink to="">Dj remix</NavLink></td>
				<td className="td"><NavLink to="">Итало-диско</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Авторские песни</NavLink></td>
				<td className="td"><NavLink to="">Acoustic & Vocal</NavLink></td>
				<td className="td"><NavLink to="">Кантри</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Классика в современной обработке</NavLink></td>
				<td className="td"><NavLink to="">Музыка без слов</NavLink></td>
				<td className="td"><NavLink to="">Диско</NavLink></td>
			</tr>

			<tr className="tr">
				<td className="td"><NavLink to="">Lounge</NavLink></td>
				<td className="td"><NavLink to="">Arabic Trap</NavLink></td>
				<td className="td"><NavLink to="">Ambient</NavLink></td>
			</tr>
			
		</table>
	</div>
	)
}