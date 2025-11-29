import React, { useEffect, useState } from "react";
import "./css/styles.css";
import "./css/style.css";
import "./css/card.css";
import "./css/filter.css";

import sedanImg from './img/sedan.png';
import paintBucketImg from './img/paint-bucket.png';
import repairToolsImg from './img/repair-tools.png';
import buildingImg from './img/building.png';
import flowersImg from './img/flowers.png';
import phoneImg from './img/phone.png';
import CanvasImg from './img/Canvas.svg';

import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";

// ===== Firebase =====
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
const storage = firebase.storage();

export default function App() {
  const [allAds, setAllAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState({ min: "", max: "" });
  const [formData, setFormData] = useState({
    phone: "",
    category: "",
    price: "",
    desc: "",
    images: [null, null, null, null, null]
  });
  const [selectedTab, setSelectedTab] = useState("home");

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

  // ===== Загрузка объявлений =====
  useEffect(() => {
    const unsubscribe = db.collection("ads")
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllAds(ads);
      });
    return () => unsubscribe();
  }, []);

  // ===== Создание объявления =====
  const createAd = async () => {
    const { phone, category, desc, price, images } = formData;
    if (!phone || !category || !desc || !images[0]) {
      alert("Заполните все поля и добавьте фото");
      return;
    }

    try {
      const uploadedUrls = await Promise.all(
        images.filter(img => img).map(async (file, idx) => {
          if (typeof file === "string" && file.startsWith("https://")) return file;
          const fileRef = storage.ref().child(`ads/${Date.now()}_${idx}.jpg`);
          await fileRef.put(file);
          return await fileRef.getDownloadURL();
        })
      );

      const newAd = {
        phone,
        categoryName: categoryLabels[category],
        categoryKey: category,
        descText: desc,
        price,
        images: uploadedUrls,
        firstImg: uploadedUrls[0],
        views: 0,
        likes: 0,
        timestamp: Date.now()
      };

      const docRef = await db.collection("ads").add(newAd);
      setAllAds([{ id: docRef.id, ...newAd }, ...allAds]);
      setModalOpen(false);
      setFormData({ phone: "", category: "", desc: "", price: "", images: [null, null, null, null, null] });

    } catch (e) {
      console.error(e);
      alert("Ошибка при сохранении объявления");
    }
  };

  // ===== Фильтрация и поиск =====
  const filteredAds = allAds.filter(ad => {
    const matchCategory = selectedCategory ? ad.categoryKey === selectedCategory : true;
    const priceNum = Number(ad.price) || 0;
    const min = filterPrice.min ? Number(filterPrice.min) : 0;
    const max = filterPrice.max ? Number(filterPrice.max) : Infinity;
    const matchPrice = priceNum >= min && priceNum <= max;
    const matchSearch = ad.descText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ad.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchPrice && matchSearch;
  });

  const toggleLike = (id) => {
    setAllAds(prev => prev.map(ad => {
      if (ad.id === id) {
        const liked = !ad.isFavorite;
        if (liked) setFavorites([...favorites, { ...ad, isFavorite: true }]);
        else setFavorites(favorites.filter(f => f.id !== id));
        return { ...ad, isFavorite: liked, likes: liked ? ad.likes + 1 : Math.max(0, ad.likes - 1) };
      }
      return ad;
    }));
  };

  const renderColumns = (ads, columnsCount = 2) => {
    const cols = Array.from({ length: columnsCount }, () => []);
    ads.forEach((ad, i) => cols[i % columnsCount].push(ad));
    return cols;
  };

  const openGallery = (images, index = 0) => setGallery({ open: true, images, index });
  const closeGallery = () => setGallery({ open: false, images: [], index: 0 });

  return (
    <div className="wrap">

      {/* ===== Верхний поиск ===== */}
      <div className="top-row">
        <input
          type="text"
          placeholder="Я ищу..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        <button className="btn-filter" onClick={() => setFilterModalOpen(true)}>Фильтр</button>
      </div>

      {/* ===== Горизонтальная лента категорий ===== */}
      <div className="categories-scroll">
        {[{ img: sedanImg, label: "Транспорт" },
          { img: paintBucketImg, label: "Услуги" },
          { img: repairToolsImg, label: "Ремонт" },
          { img: buildingImg, label: "Недвижимость" },
          { img: flowersImg, label: "Дом и сад" },
          { img: phoneImg, label: "Телефоны" }].map((cat, i) => (
          <div className="cat-card" key={i}>
            <img src={cat.img} alt={cat.label} />
            <div>{cat.label}</div>
          </div>
        ))}
      </div>

      {/* ===== Cards Masonry ===== */}
      <main className="content">
        <div className="cards">
          {renderColumns(filteredAds, 2).map((col, i) => (
            <div className="column" key={i}>
              {col.map(ad => (
                <div key={ad.id} className="card">
                  <img src={ad.firstImg} alt={ad.descText} onClick={() => openGallery(ad.images)} />
                  <div>{ad.categoryName}</div>
                  <div>{ad.descText}</div>
                  <div>{ad.price || "Договорная"} сом</div>
                  <button className={`heart ${ad.isFavorite ? 'active' : ''}`} onClick={() => toggleLike(ad.id)}>
                    <svg className="like" viewBox="0 0 24 24" fill="none">
          <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path>
        </svg> {ad.likes}
                  </button>
                  <div>👁 {ad.views}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* ===== Модалки, галерея ===== */}
      {modalOpen && (
        <div className="modal">
          <button onClick={() => setModalOpen(false)}>Закрыть</button>
        </div>
      )}
      {filterModalOpen && (
        <div className="modal">
          <button onClick={() => setFilterModalOpen(false)}>Закрыть</button>
        </div>
      )}
      {gallery.open && (
        <div className="modal" onClick={closeGallery}>
          <img src={gallery.images[gallery.index]} alt="gallery" />
        </div>
      )}

      {/* ===== Нижнее меню ===== */}
      <div className="bottom-nav">
        <div className={`nav-item ${selectedTab === "home" ? "active" : ""}`} onClick={() => setSelectedTab("home")}>Главная</div>
        <div className={`nav-item ${selectedTab === "favorites" ? "active" : ""}`} onClick={() => setSelectedTab("favorites")}>Избранное</div>
        <div className="center-plus" onClick={() => setModalOpen(true)}>➕</div>
        <div className="nav-item" onClick={() => window.open(`https://wa.me/996220604604`, "_blank")}>Связь</div>
        <div className={`nav-item ${selectedTab === "profile" ? "active" : ""}`} onClick={() => setSelectedTab("profile")}>Профиль</div>
      </div>

    </div>
  );
}
