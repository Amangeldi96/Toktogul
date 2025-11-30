import React, { useState, useEffect, useRef } from "react";
import "./css/styles.css";
import "./css/style.css";
import "./css/card.css";
import "./css/filter.css";
import SkeletonLoader from "./skeleton";
import SkeletonCard from "./skeletonCard";


import sedanImg from './img/sedan.png';
import paintBucketImg from './img/paint-bucket.png';
import repairToolsImg from './img/repair-tools.png';
import buildingImg from './img/building.png';
import flowersImg from './img/flowers.png';
import phoneImg from './img/phone.png';
import CanvasImg from './img/Canvas.svg';

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4G8qEj4o6ZGGdZMkmqrcFjsKeexAPPlE",
  authDomain: "toktogul-b4bc8.firebaseapp.com",
  projectId: "toktogul-b4bc8",
  storageBucket: "toktogul-b4bc8.appspot.com",
  messagingSenderId: "994223338100",
  appId: "1:994223338100:web:41f38224398bd4d21e5721",
  measurementId: "G-EGSEE12JPM"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ... остальной импорт и Firebase конфиг остаются без изменений

export default function App() {
  const realGalleryInputRef = useRef(null); // корректно используем useRef
  const [formData, setFormData] = useState({
    phone: "",
    category: "",
    price: "",
    desc: "",
    images: [null, null, null, null, null]
  });
  const [loadingAds, setLoadingAds] = useState(true);
	const [loading, setLoading] = useState(false);

	  // ===== Состояния для объявлений =====
  const [allAds, setAllAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterPrice, setFilterPrice] = useState({ min: "", max: "" });
  const [selectedTab, setSelectedTab] = useState("home");



// ===== Отслеживаем просмотренные объявления =====
const [viewedAds, setViewedAds] = useState(() => {
  const stored = localStorage.getItem("viewedAds");
  return stored ? JSON.parse(stored) : [];
});


// ===== Toggle избранного =====
const toggleFavorite = (adId) => {
  setAllAds(prevAds =>
    prevAds.map(ad =>
      ad.id === adId ? { ...ad, isFavorite: !ad.isFavorite } : ad
    )
  );

  // Обновляем список избранных
  setFavorites(prevFavs => {
    const isFav = prevFavs.some(ad => ad.id === adId);

    if (isFav) {
      // Удаляем из избранных
      return prevFavs.filter(ad => ad.id !== adId);
    } else {
      // Добавляем в избранные
      const adToAdd = allAds.find(ad => ad.id === adId);
      return adToAdd ? [...prevFavs, { ...adToAdd, isFavorite: true }] : prevFavs;
    }
  });
};

// ===== Лайк объявления =====
const handleLike = async (adId) => {
  // Локально +1 лайк
  setAllAds(prevAds =>
    prevAds.map(ad =>
      ad.id === adId ? { ...ad, likes: (ad.likes || 0) + 1 } : ad
    )
  );

  // Обновляем в Firestore
  try {
    const adRef = db.collection("ads").doc(adId);
    await adRef.update({
      likes: firebase.firestore.FieldValue.increment(1)
    });
  } catch (e) {
    console.error("Ошибка лайка:", e);
  }
};

// ===== Увеличение просмотров =====


	const handleView = async (adId) => {
  if (viewedAds.includes(adId)) return; // Уже был просмотр, не считаем

  // Обновляем локально
  setAllAds(prevAds =>
    prevAds.map(ad =>
      ad.id === adId ? { ...ad, views: (ad.views || 0) + 1 } : ad
    )
  );

  // Обновляем Firestore
  const adRef = db.collection("ads").doc(adId);
  await adRef.update({
    views: firebase.firestore.FieldValue.increment(1)
  });

  // Сохраняем как просмотренное
  const newViewed = [...viewedAds, adId];
  setViewedAds(newViewed);
  localStorage.setItem("viewedAds", JSON.stringify(newViewed));
};



  const categoryLabels = {
    electronics: "Электроника",
    cars: "Авто",
    real_estate: "Недвижимость",
    clothes: "Одежда",
    services: "Услуги",
    jobs: "Работа",
    personal: "Личные вещи",
    home_garden: "Дом и сад",
    repair: "Ремонт и строительство",
    hobby: "Спорт и хобби",
    other: "Другое"
  };

useEffect(() => {
  setLoadingAds(true); // включаем skeleton
 const unsubscribe = db.collection("ads")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllAds(ads);
      setLoadingAds(false); // данные загрузились, убираем Skeleton
    });
  return () => unsubscribe();
}, []);


  // ===== renderColumns =====
  const renderColumns = (ads, columnsCount = 2) => {
    const cols = Array.from({ length: columnsCount }, () => []);
    ads.forEach((ad, i) => {
      cols[i % columnsCount].push(ad);
    });
    return cols;
  };

  // ===== Отфильтрованные объявления =====
  const filteredAds = allAds.filter(ad => {
    if (selectedCategory && ad.categoryKey !== selectedCategory) return false;
    if (searchQuery && !ad.descText.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // ===== Cloudinary upload =====
async function uploadToCloudinary(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "toktogul");
  data.append("folder", "Toktogul"); // загружать в папку Toktogul

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dqzgtlvlu/image/upload",
      { method: "POST", body: data }
    );
    const json = await res.json();
    
    if (json.error) {
      console.error("Cloudinary ответ:", json);
      throw new Error(json.error.message || "Ошибка загрузки фото");
    }
    
    return json.secure_url;
  } catch (err) {
    console.error("Ошибка при uploadToCloudinary:", err);
    throw err;
  }
}



 const handleGalleryChange = async (e) => {
  // 1️⃣ Сначала посмотрим, что пришло от input
  console.log("Выбранные файлы:", e.target.files);

  const files = Array.from(e.target.files).slice(0, 5);
  setLoading(true);

  try {
    // 2️⃣ Логируем каждый файл перед загрузкой
    files.forEach(file => console.log("Файл для загрузки:", file.name, file.type, file.size));

    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const url = await uploadToCloudinary(file);
        console.log("Загруженный URL:", url); // 3️⃣ Логируем URL после загрузки
        return url;
      })
    );

    setFormData(prev => ({
      ...prev,
      images: uploadedUrls // сохраняем только URL
    }));
  } catch (err) {
    alert("Ошибка при загрузке фото");
    console.error("Ошибка при uploadToCloudinary:", err); // 4️⃣ Логируем полную ошибку
  }

  setLoading(false);
};



  const createAd = async () => {
  const { phone, category, desc, price, images } = formData;

  // Берем только URL (если есть preview — заменяем на URL)
const imageUrls = images
  .map(img => {
    if (!img) return null;               // пропускаем пустые слоты
    if (typeof img === "string") return img;  // если уже строка
    return img.preview || null;           // если объект — берем preview
  })
  .filter(Boolean);                      // убираем null


if (!phone || !category || !desc || !imageUrls[0]) {
  alert("Заполните все поля и добавьте фото");
  return;
}


  const newAd = {
    phone,
    categoryName: categoryLabels[category],
    categoryKey: category,
    descText: desc,
    price,
    images: imageUrls,
    firstImg: imageUrls[0],
    views: 0,
    likes: 0,
    timestamp: Date.now()
  };

  try {
    const docRef = await db.collection("ads").add(newAd);
    setAllAds([{ id: docRef.id, ...newAd }, ...allAds]);
    setModalOpen(false);
    setFormData({ phone: "", category: "", desc: "", price: "", images: [null, null, null, null, null] });
  } catch (e) {
    console.error(e);
    alert("Ошибка при сохранении объявления");
  }
};

  const openGallery = (images, index = 0) => setGallery({ open: true, images, index });
  const closeGallery = () => setGallery({ open: false, images: [], index: 0 });

  return (
    <div className="wrap">

      {/* ===== Верхний поиск и фильтр ===== */}
      <div className="top-row">
        <div className="search">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.2" stroke="#9AA3B6" strokeWidth="1.6" />
            <path d="M21 21l-4.35-4.35" stroke="#9AA3B6" strokeWidth="1.6" />
          </svg>
          <input type="text" placeholder="Я ищу..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="btn-filter" onClick={() => setFilterModalOpen(true)}>Фильтр</div>
      </div>

      {/* ===== Горизонтальная лента категорий ===== */}
      <div className="categories-scroll">
        {[{ img: sedanImg, label: "Транспорт", count: "331 960" },
          { img: paintBucketImg, label: "Услуги", count: "115 316" },
          { img: repairToolsImg, label: "Ремонт", count: "136 708" },
          { img: buildingImg, label: "Недвижимость", count: "66 750" },
          { img: flowersImg, label: "Дом и сад", count: "138 056" },
          { img: phoneImg, label: "Телефоны", count: "97 420" }].map((cat,i) => (
          <div className={`cat-card bg`} key={i}>
           <div className="icon">
  					<img src={cat.img} alt={cat.label} /></div>
            <div className="label">{cat.label}</div>
            <div className="count">{cat.count}</div>
          </div>
        ))}
      </div>

<main className="content">
<div
  className="cards"
  id="cards"
>
  {loadingAds
    ? Array.from({ length: 2 }).map((_, colIndex) => (
        <div
          className="column"
          key={colIndex}
          style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ))
    : renderColumns(filteredAds, 2).map((col, i) => (
        <div
          className="column"
          key={i}
          style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}
        >
          {col.map(ad => (
            <div key={ad.id} className="card">
              <div className="img">
                <img
                        src={ad.firstImg}
                        className="card-img"
                        alt={ad.descText || "Фото объявления"}
                        onClick={() => {
                          handleView(ad.id);
                          openGallery(ad.images, 0);
                        }}
                      />
              </div>

             {!loadingAds && (
              <div className="body">
                <div className="price">{ad.price || "Договорная"} сом</div>
                <div className="sub">{ad.categoryName}</div>
                <div className="title">{ad.descText}</div>

                <div className="phone">
                  <a href={`tel:${ad.phone}`}>{ad.phone}</a>
                  <a
                    href={`https://wa.me/${ad.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn whatsapp"
                    style={{ marginLeft: "10px" }}
                  >
                  <svg
                    className="what"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439"
                      fill="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* ===== Actions (лайки и просмотры) ===== */}
             <div className="actions">
                  <div className="left-actions">
                    <svg className="view" viewBox="0 0 24 24">
                      <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <span className="view-count">{ad.views}</span>
                  </div>
                  <div className="right-actions">
                 <button
  className={`icon-btn heart ${ad.isFavorite ? "active" : ""}`}
  onClick={() => {
    toggleFavorite(ad.id); // обновление локального состояния избранного
    handleLike(ad.id);     // обновление лайков в Firestore
  }}
>
                      <svg className="like" viewBox="0 0 24 24" fill="none">
                        <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" />
                      </svg>
                    </button>
                    <span className="like-count">{ad.likes}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
</main>

    {/* ===== Модалка создания объявления ===== */}
{modalOpen && (
  <div className="modal open">
    <div className="modal__sheet">

      <div className="modal__header">
        <button className="close-btn" onClick={() => setModalOpen(false)}>✕</button>
        <div className="modal__title">Объявление</div>
        <div style={{ width: "36px" }}></div>
      </div>
<div>

 {/* ===== Галерея и выбранные фото ===== */}
  <div className="gallery" onClick={() => realGalleryInputRef.current.click()}>
        <div className="item big" data-type="gallery">
          <img className="gall" src={CanvasImg} alt="gallery" />
          <span className="big-text">галерея</span>
        </div>
      </div>


 {/* Слоты для выбранных фото */}
<div className="selected-grid">
  {formData.images.map((img, i) => (
    <div className="slot" key={i}>
      <div className="placeholder">
        {loading && typeof img !== "string" ? (
          <SkeletonLoader width="100%" height="100%" />
        ) : (
          <img
            className="gal"
            src={img || CanvasImg}
            alt={img ? `selected-${i}` : "placeholder"}
          />
        )}
      </div>
    </div>
  ))}
</div>
</div>

      {/* ===== Информация ===== */}
      <div className="info-block">
        <div className="input-group gr">
          <label htmlFor="phone">Номер телефона</label>
          <input
  type="tel"
  id="phone"
  placeholder="+996 ___ ___ ___"
  value={formData.phone}
  onChange={e => {
    let val = e.target.value;
    if (!val.startsWith("+996")) val = "+996" + val.replace(/^0+/, "");
    setFormData({ ...formData, phone: val });
  }}
/>

        </div>
        <div className="input-group gr">
          <label htmlFor="category">Категория</label>
          <select
            id="category"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="" disabled>Выберите категорию</option>
            {Object.keys(categoryLabels).map(key => (
              <option key={key} value={key}>{categoryLabels[key]}</option>
            ))}
          </select>
        </div>
        <div className="input-group gr">
          <label htmlFor="price">Цена</label>
          <input
            type="number"
            id="price"
            placeholder="Введите цену в KGS"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
      </div>

      {/* ===== Описание ===== */}
      <div className="desc-block">
        <h4>Описание объявления</h4>
        <textarea
          id="desc"
          className="desc"
          maxLength="6000"
          value={formData.desc}
          onChange={e => setFormData({ ...formData, desc: e.target.value })}
        />
        <div className="counter">{formData.desc.length}/6000</div>
      </div>

     {/* ===== Действия ===== */}
<div className="actions">
  <button className="btn-green" onClick={createAd}>Создать объявление</button>
</div>

  {/* Скрытый input */}
      <input
        type="file"
        ref={realGalleryInputRef}
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleGalleryChange}
      />


          </div>
        </div>
      )}

{/* ===== Модалка фильтра ===== */}
{filterModalOpen && (
  <div className="modal open">
    <div className=" small-modal"> {/* small-modal для компактной высоты */}
      <div className="modal__header">
        <button className="close-btn" onClick={() => setFilterModalOpen(false)}>✕</button>
        <div className="modal__title">Фильтр</div>
        <div style={{ width: "36px" }}></div>
      </div>

      <div className="filter-content">
        {/* Категория */}
        <div className="input-group gr">
          <label>Категория</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">Все</option>
            {Object.keys(categoryLabels).map(key => (
              <option key={key} value={key}>{categoryLabels[key]}</option>
            ))}
          </select>
        </div>

        {/* Цена в одну строку */}
        <div className="price-row" style={{ display: "flex", gap: "10px" }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Цена от</label>
            <input
              type="number"
              value={filterPrice.min}
              onChange={e => setFilterPrice({ ...filterPrice, min: e.target.value })}
            />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label>Цена до</label>
            <input
              type="number"
              value={filterPrice.max}
              onChange={e => setFilterPrice({ ...filterPrice, max: e.target.value })}
            />
          </div>
        </div>

        {/* Кнопка применить */}
        <div className="actions">
          <button className="btn-green" onClick={() => setFilterModalOpen(false)}>Применить</button>
        </div>
      </div>
    </div>
  </div>
)}

{/* ===== Нижнее меню ===== */}
<div className="bottom-nav">
  {/* Главная */}
  <div
    className={`nav-item ${selectedTab === "home" ? "active" : ""}`}
    onClick={() => { setAllAds(allAds); setSelectedTab("home"); }}
  >
    <svg viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM11.25 18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V15C12.75 14.5858 12.4142 14.25 12 14.25C11.5858 14.25 11.25 14.5858 11.25 15V18Z"></path>
    </svg>
    <span>Главная</span>
  </div>

  {/* Избранное */}
  <div
    className={`nav-item ${selectedTab === "favorites" ? "active" : ""}`}
    onClick={() => { setAllAds(favorites); setSelectedTab("favorites"); }}
  >
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"></path>
    </svg>
    <span>Избранное</span>
  </div>

  {/* Плюс */}
  <div className="center-plus" onClick={() => setModalOpen(true)}>
    <div className="plus-btn">
      <svg className="plus" viewBox="0 0 24 24" fill="none">
        <path d="M6 12H18M12 6V18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
    </div>
  </div>

  {/* Связь */}
  <div className="nav-item" onClick={() => window.open(`https://wa.me/996220604604`, "_blank")}>
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

  {/* Профиль */}
  <div
    className={`nav-item ${selectedTab === "profile" ? "active" : ""}`}
    onClick={() => setSelectedTab("profile")}
  >
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M19.6515 19.4054C20.2043 19.2902 20.5336 18.7117 20.2589 18.2183C19.6533 17.1307 18.6993 16.1749 17.4788 15.4465C15.907 14.5085 13.9812 14 12 14C10.0188 14 8.09292 14.5085 6.52112 15.4465C5.30069 16.1749 4.34666 17.1307 3.74108 18.2183C3.46638 18.7117 3.79562 19.2902 4.34843 19.4054C9.39524 20.4572 14.6047 20.4572 19.6515 19.4054Z"></path>
      <circle cx="12" cy="8" r="5"></circle>
    </svg>
    <span>Профиль</span>
  </div>
</div>

{/* ===== Галерея (слайдер) ===== */}
      {gallery.open && (
        <div className="gallery-modal" onClick={closeGallery}>
          <div className="gallery-inner" onClick={e => e.stopPropagation()}>
            <button className="gallery-close" onClick={closeGallery}>✕</button>

            <img className="gallery-img" src={gallery.images[gallery.index]} alt={`Фото ${gallery.index + 1}`} />

            <button
              className="gallery-btn left"
              onClick={() => setGallery(g => ({ ...g, index: g.index > 0 ? g.index - 1 : g.images.length - 1 }))}
            >
              ‹
            </button>

            <button
              className="gallery-btn right"
              onClick={() => setGallery(g => ({ ...g, index: g.index < g.images.length - 1 ? g.index + 1 : 0 }))}
            >
              ›
            </button>

            <div className="gallery-counter">{gallery.index + 1} / {gallery.images.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
