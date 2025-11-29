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
import "firebase/compat/firestore";

// ===== Firestore =====
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

// ===== React App =====
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

  const toggleLike = async (adId) => {
    setAllAds(prev => prev.map(ad => {
      if (ad.id === adId) {
        const liked = !ad.isFavorite;
        if (liked) setFavorites([...favorites, { ...ad, isFavorite: true }]);
        else setFavorites(favorites.filter(f => f.id !== adId));

        // Обновляем Firestore
        db.collection("ads").doc(adId).update({
          likes: liked ? ad.likes + 1 : Math.max(0, ad.likes - 1)
        });

        return { ...ad, isFavorite: liked, likes: liked ? ad.likes + 1 : Math.max(0, ad.likes - 1) };
      }
      return ad;
    }));
  };

  const openGallery = (images, adId, index = 0) => {
    setGallery({ open: true, images, index });

    // Увеличиваем просмотры локально и в Firebase
    setAllAds(prev => prev.map(ad => {
      if (ad.id === adId) {
        const newViews = ad.views + 1;
        db.collection("ads").doc(adId).update({ views: newViews });
        return { ...ad, views: newViews };
      }
      return ad;
    }));
  };

  const closeGallery = () => setGallery({ open: false, images: [], index: 0 });

  const renderColumns = (ads, columnsCount = 2) => {
    const cols = Array.from({ length: columnsCount }, () => []);
    ads.forEach((ad, i) => cols[i % columnsCount].push(ad));
    return cols;
  };

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

  return (
    <div className="wrap">
      <div className="top-row">
        <div className="search">
          <input type="text" placeholder="Я ищу..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="btn-filter" onClick={() => setFilterModalOpen(true)}>Фильтр</div>
      </div>

      <div className="categories-scroll">
        {[{ img: sedanImg, label: "Транспорт" },
          { img: paintBucketImg, label: "Услуги" },
          { img: repairToolsImg, label: "Ремонт" },
          { img: buildingImg, label: "Недвижимость" },
          { img: flowersImg, label: "Дом и сад" },
          { img: phoneImg, label: "Телефоны" }].map((cat,i) => (
          <div className={`cat-card bg`} key={i}>
            <div className="icon"><img src={cat.img} alt={cat.label} /></div>
            <div className="label">{cat.label}</div>
          </div>
        ))}
      </div>

      <main className="content">
        <div className="cards" id="cards">
          {renderColumns(filteredAds, 2).map((col, i) => (
            <div className="column" key={i} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {col.map(ad => (
                <div key={ad.id} className="card">
                  <div className="img">
                    <img 
                      src={ad.firstImg} 
                      className="card-img" 
                      alt={ad.descText || "Фото объявления"} 
                      onClick={() => openGallery(ad.images, ad.id)} 
                    />
                  </div>

                  <div className="body">
                    <div className="price">{ad.price || "Договорная"} сом</div>
                    <div className="sub">{ad.categoryName}</div>
                    <div className="title">{ad.descText}</div>
                    <div className="phone"><a href={`tel:${ad.phone}`}>{ad.phone}</a></div>

                    <div className="actions">
                      <div className="left-actions">
                        <svg className="view" viewBox="0 0 24 24">
                          <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                          <circle cx="12" cy="12" r="2"/>
                        </svg>
                        <span className="view-count">{ad.views}</span>
                      </div>

                      <div className="right-actions">
                        <button className={`icon-btn heart ${ad.isFavorite ? 'active' : ''}`} onClick={() => toggleLike(ad.id)}>
                          <svg className="like" viewBox="0 0 24 24" fill="none">
                            <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path>
                          </svg>
                        </button>
                        <span className="like-count">{ad.likes}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* ===== Галерея ===== */}
      {gallery.open && (
        <div className="modal open gallery-modal">
          <button className="close-btn" onClick={closeGallery}>✕</button>
          <div className="gallery-content">
            <button 
              className="prev-btn" 
              onClick={(e) => { 
                e.stopPropagation();
                setGallery(g => ({ ...g, index: (g.index - 1 + g.images.length) % g.images.length }));
              }}
            >‹</button>

            <img 
              src={gallery.images[gallery.index]} 
              alt={`Фото ${gallery.index + 1}`} 
              className="gallery-image" 
            />

            <button 
              className="next-btn" 
              onClick={(e) => { 
                e.stopPropagation();
                setGallery(g => ({ ...g, index: (g.index + 1) % g.images.length }));
              }}
            >›</button>
          </div>

          <div className="gallery-counter">
            {gallery.index + 1} / {gallery.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
