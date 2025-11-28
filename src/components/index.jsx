import React from "react";
import "./css/styles.css";
import "./css/style.css";
import "./css/card.css";
import "./css/filter.css";

// Импорт фото (только здесь, в начале)
import sedanImg from './img/sedan.png';
import paintBucketImg from './img/paint-bucket.png';
import repairToolsImg from './img/repair-tools.png';
import buildingImg from './img/building.png';
import flowersImg from './img/flowers.png';
import phoneImg from './img/phone.png';



export default function App() {
  return (
    <div className="wrap">

      {/* Верх */}
      <div className="top-row">

        <div className="search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.2" stroke="#9AA3B6" strokeWidth="1.6" />
            <path d="M21 21l-4.35-4.35" stroke="#9AA3B6" strokeWidth="1.6" />
          </svg>
          <input id="searchInput" type="text" placeholder="Я ищу..." />
        </div>

        <div className="btn-filter">Фильтр</div>

        {/* Модалка фильтра */}
        <div id="filterModalNew" className="filter-modal">
          <div className="filter-box">

            <div className="filter-header">
              <span>Фильтр</span>
              <button id="closeFilterModalNew" className="close-btn">✕</button>
            </div>

            <div className="filter-section">

              {/* КАТЕГОРИИ КНОПКА */}
              <button id="openCategoryBtn" className="filter-option">
                Категория
              </button>

              {/* СПИСОК КАТЕГОРИЙ */}
              <div id="catList" className="cat-list">
                <label><input type="radio" name="filterCategoryNew" value="electronics" /> Электроника</label>
                <label><input type="radio" name="filterCategoryNew" value="cars" /> Авто</label>
                <label><input type="radio" name="filterCategoryNew" value="real_estate" /> Недвижимость</label>
                <label><input type="radio" name="filterCategoryNew" value="clothes" /> Одежда</label>
                <label><input type="radio" name="filterCategoryNew" value="services" /> Услуги</label>
                <label><input type="radio" name="filterCategoryNew" value="jobs" /> Работа</label>
                <label><input type="radio" name="filterCategoryNew" value="personal" /> Личные вещи</label>
                <label><input type="radio" name="filterCategoryNew" value="home_garden" /> Дом и сад</label>
                <label><input type="radio" name="filterCategoryNew" value="repair" /> Ремонт и строительство</label>
                <label><input type="radio" name="filterCategoryNew" value="hobby" /> Спорт и хобби</label>
                <label><input type="radio" name="filterCategoryNew" value="other" /> Другое</label>
              </div>

              {/* ЦЕНА */}
              <div className="price-block">
                <input type="number" id="filterMinPrice" placeholder="Цена от" />
                <input type="number" id="filterMaxPrice" placeholder="Цена до" />
              </div>

            </div>

            <div className="filter-actions">
              <button id="filterResetBtn" className="reset-btn">Сбросить</button>
              <button id="filterApplyBtn" className="apply-btn">Применить</button>
            </div>

          </div>
        </div>

      </div>

      {/* Горизонтальная лента категорий */}
      <div className="categories-scroll">

        <div className="cat-card bg-blue">
          <div className="icon"><img src={sedanImg} alt="" /></div>
          <div className="label">Транспорт</div>
          <div className="count">331 960</div>
        </div>

        <div className="cat-card bg-cream">
          <div className="icon"><img src={paintBucketImg} alt="" /></div>
          <div className="label">Услуги</div>
          <div className="count">115 316</div>
        </div>

        <div className="cat-card bg-light">
          <div className="icon"><img src={repairToolsImg} alt="" /></div>
          <div className="label">Ремонт</div>
          <div className="count">136 708</div>
        </div>

        <div className="cat-card bg-purple">
          <div className="icon"><img src={buildingImg} alt="" /></div>
          <div className="label">Недвижимость</div>
          <div className="count">66 750</div>
        </div>

        <div className="cat-card bg-green">
          <div className="icon"><img src={flowersImg} alt="" /></div>
          <div className="label">Дом и сад</div>
          <div className="count">138 056</div>
        </div>

        <div className="cat-card bg-peach">
          <div className="icon"><img src={phoneImg} alt="" /></div>
          <div className="label">Телефоны</div>
          <div className="count">97 420</div>
        </div>

      </div>

      {/* Индикатор загрузки */}
      <div id="loading" style={{ textAlign: "center", padding: "20px" }}>
        Загрузка объявлений...
      </div>
      {/* CARDS */}
      <main className="content">
        <div className="cards" id="cards">{/* сюда рендерятся .card */}</div>
      </main>

      {/* Галерея объявлений */}
      <div className="modal" id="galleryModal">
        <div className="gallery-sheet">
          <div className="gallery-header">
            <button className="order-btn" id="closeGallery">✕</button>
          </div>
          <div className="gallery-view">
            <div className="gallery-track" id="galleryTrack"></div>
          </div>
        </div>
      </div>

      {/* NAV MENU */}
      <div className="bottom-nav">

        {/* HOME */}
        <div className="nav-item active" data-type="home">
          <svg viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM11.25 18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V15C12.75 14.5858 12.4142 14.25 12 14.25C11.5858 14.25 11.25 14.5858 11.25 15V18Z"></path>
          </svg>
          <span>Главная</span>
        </div>

        {/* FAVORITE */}
        <div className="nav-item" data-type="favorite">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"></path>
          </svg>
          <span>Избранное</span>
        </div>

        {/* PLUS BUTTON */}
        <div className="center-plus">
          <div className="plus-btn" id="openModal">
            <svg className="plus" viewBox="0 0 24 24" fill="none">
              <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        </div>

        {/* POPUP: создание объявления */}
        <div className="modal" id="modal">
          <div className="modal__sheet">
            <div className="modal__header">
              <button className="close-btn" id="closeModal">✕</button>
              <div className="modal__title">Объявление</div>
              <div style={{ width: "36px" }}></div>
            </div>

            <div className="gallery" id="gallery">
              <div className="item big" data-type="gallery">
                <img className="gall" src="./img/Canvas.svg" alt="gallery" />
                <span className="big-text">галерея</span>
              </div>
            </div>

            <div className="selected-row">
              <h3>Выбранные фото</h3>
              <div className="selected-grid" id="selectedGrid">
                {[...Array(5)].map((_, i) => (
                  <div className="slot" key={i}>
                    <div className="placeholder">
                      <img className="gal" src="./img/Canvas.svg" alt="gallery" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="info-block">
              <div className="input-group">
                <label htmlFor="phone">Номер телефона</label>
                <input type="tel" id="phone" placeholder="+996 ___ ___ ___" />
              </div>
              <div className="input-group">
                <label htmlFor="category">Категория</label>
                <select id="category">
                  <option value="" disabled selected>Выберите категорию</option>
                  <option value="electronics">Электроника</option>
                  <option value="cars">Авто</option>
                  <option value="real_estate">Недвижимость</option>
                  <option value="clothes">Одежда</option>
                  <option value="services">Услуги</option>
                  <option value="jobs">Работа</option>
                  <option value="personal">Личные вещи</option>
                  <option value="home_garden">Дом и сад</option>
                  <option value="repair">Ремонт и строительство</option>
                  <option value="hobby">Спорт и хобби</option>
                  <option value="other">Другое</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="price">Цена</label>
                <input type="number" id="price" placeholder="Введите цену в KGS" />
              </div>
            </div>

            <div className="desc-block">
              <h4>Описание объявления</h4>
              <textarea id="desc" className="desc" maxLength="6000"></textarea>
              <div className="counter" id="counter">0/6000</div>
            </div>

            <div className="actions">
              <button className="btn-green" id="createAd">Создать объявление</button>
            </div>
          </div>
        </div>

        <input type="file" id="realGalleryInput" accept="image/*" multiple style={{ display: "none" }} />

        {/* Модалка выбора категории */}
        <div className="modal" id="categoryModal">
          <div className="modal__sheet">
            <div className="modal__header">
              <button className="close-btn" id="closeCategoryModal">✕</button>
              <div className="modal__title">Выберите категорию</div>
              <div style={{ width: "36px" }}></div>
            </div>

            <div className="category-list">
              <label><input type="radio" name="cat" value="electronics" /> Электроника</label>
              <label><input type="radio" name="cat" value="cars" /> Авто</label>
              <label><input type="radio" name="cat" value="real_estate" /> Недвижимость</label>
              <label><input type="radio" name="cat" value="clothes" /> Одежда</label>
              <label><input type="radio" name="cat" value="services" /> Услуги</label>
              <label><input type="radio" name="cat" value="jobs" /> Работа</label>
              <label><input type="radio" name="cat" value="personal" /> Личные вещи</label>
              <label><input type="radio" name="cat" value="home_garden" /> Дом и сад</label>
              <label><input type="radio" name="cat" value="repair" /> Ремонт и строительство</label>
              <label><input type="radio" name="cat" value="hobby" /> Спорт и хобби</label>
              <label><input type="radio" name="cat" value="other" /> Другое</label>
            </div>
            <div className="actions">
              <button id="confirmCategory" className="btn-green">Выбрать</button>
            </div>
          </div>
        </div>

{/* CHAT */}
<div className="nav-item" data-type="chat">
  <svg className="ic-wat" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-300, -7599)">
        <g transform="translate(56, 160)">
          <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439"></path>
        </g>
      </g>
    </g>
  </svg>
  <span>Связь</span>
</div>

        {/* PROFILE */}
        <div className="nav-item" data-type="profile">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19.6515 19.4054C20.2043 19.2902 20.5336 18.7117 20.2589 18.2183C19.6533 17.1307 18.6993 16.1749 17.4788 15.4465C15.907 14.5085 13.9812 14 12 14C10.0188 14 8.09292 14.5085 6.52112 15.4465C5.30069 16.1749 4.34666 17.1307 3.74108 18.2183C3.46638 18.7117 3.79562 19.2902 4.34843 19.4054C9.39524 20.4572 14.6047 20.4572 19.6515 19.4054Z"></path>
            <circle cx="12" cy="8" r="5"></circle>
          </svg>
          <span>Профиль</span>
        </div>

      </div>
    </div>
  );
}
