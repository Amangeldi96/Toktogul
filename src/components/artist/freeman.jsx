import React, { useState, useEffect } from "react";
import '../css/freeman.css'

export default function Jax(){

	const [rating, setRating] = useState(() => {
		return localStorage.getItem('rating') || "0";
});


const handleRatingChange = (event) => {
		const newRating = event.target.value;
		setRating(newRating);
		localStorage.setItem('rating', newRating);
};

useEffect(() => {
	const savedRating = localStorage.getItem('rating');
	if (savedRating) {
			setRating(savedRating);
	}
}, []);

	return(
		<div className="h-block">
		<h1 className="f-block">Freeman 996</h1>
		<div className="h-content">
				<div className="img-freeman"></div>
				<table className="tabl">
						<tr>
								<td className="tdr">Карера</td>
								<td>Певец</td>
						</tr>
						<tr>
								<td className="tdr">Дата рождения</td>
								<td>------</td>
						</tr>
						<tr>
								<td className="tdr">Возраст</td>
								<td>-----</td>
						</tr>
						<tr>
								<td className="tdr">Место рождения</td>
								<td>Киргизстан, Балыкчы</td>
						</tr>
						<tr>
								<td className="tdr">
										<div className="full-stars">
												<div className="rating-group">
														<input name="fst" id="fst-0" value="0" type="radio" disabled checked={rating === "0"} onChange={handleRatingChange} />
														<label htmlFor="fst-1">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>
														</label>
														<input name="fst" id="fst-1" value="1" type="radio" checked={rating === "1"} onChange={handleRatingChange} />
														<label htmlFor="fst-2">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>
														</label>
														<input name="fst" id="fst-2" value="2" type="radio" checked={rating === "2"} onChange={handleRatingChange} />
														<label htmlFor="fst-3">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>
														</label>
														<input name="fst" id="fst-3" value="3" type="radio" checked={rating === "3"} onChange={handleRatingChange} />
														<label htmlFor="fst-4">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>
														</label>
														<input name="fst" id="fst-4" value="4" type="radio" checked={rating === "4"} onChange={handleRatingChange} />
														<label htmlFor="fst-5">
																<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"/></svg>
														</label>
														<input name="fst" id="fst-5" value="5" type="radio" checked={rating === "5"} onChange={handleRatingChange} />
												</div>
										</div>
								</td>
								<td className="rei"><p id="rating-value">Рейтинг: {rating}</p></td>
						</tr>
				</table>
		</div>
</div>
	);
}