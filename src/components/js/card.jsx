import { useState, useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4G8qEj4o6ZGGdZMkmqrcFjsKeexAPPlE",
  authDomain: "toktogul-b4bc8.firebaseapp.com",
  projectId: "toktogul-b4bc8",
  storageBucket: "toktogul-b4bc8.firebasestorage.app",
  messagingSenderId: "994223338100",
  appId: "1:994223338100:web:41f38224398bd4d21e5721",
  measurementId: "G-EGSEE12JPM",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function AdsApp() {
  const [allAds, setAllAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [descText, setDescText] = useState("");
  const [descCounter, setDescCounter] = useState(0);
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [price, setPrice] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchInputRef = useRef(null);

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
    other: "Другое",
  };

  // ===== Загрузка объявлений =====
  useEffect(() => {
    setLoading(true);
    const unsubscribe = db
      .collection("ads")
      .orderBy("timestamp", "desc")
      .onSnapshot(
        (snapshot) => {
          const ads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setAllAds(ads);
          setLoading(false);
        },
        (error) => {
          console.error("Ошибка при загрузке объявлений:", error);
          setLoading(false);
        }
      );
    return () => unsubscribe();
  }, []);

  // ===== Счетчик описания =====
  const handleDescChange = (e) => {
    setDescText(e.target.value);
    setDescCounter(e.target.value.length);
  };

  // ===== Создание объявления =====
  const handleCreateAd = async () => {
    if (!phone || !category || !descText || selectedImages.length === 0) {
      alert("Заполните все поля и добавьте хотя бы одно фото.");
      return;
    }

    const phoneNumber = phone.startsWith("0") ? "996" + phone.slice(1) : phone;
    const newAd = {
      images: selectedImages,
      firstImg: selectedImages[0],
      categoryName: categoryLabels[category] || "Категория",
      descText,
      price,
      phone: phoneNumber,
      views: 0,
      likes: 0,
      timestamp: Date.now(),
    };

    try {
      const docRef = await db.collection("ads").add(newAd);
      setAllAds((prev) => [{ id: docRef.id, ...newAd }, ...prev]);
      setPhone("");
      setCategory("");
      setDescText("");
      setDescCounter(0);
      setPrice("");
      setSelectedImages([]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении объявления. Попробуйте снова.");
    }
  };

  // ===== Поиск =====
  const handleSearch = (q) => {
    const searchLower = q.toLowerCase();
    return allAds.filter((ad) => {
      const title = ad.descText?.toLowerCase() || "";
      const categoryName = ad.categoryName?.toLowerCase() || "";
      return title.includes(searchLower) || categoryName.includes(searchLower);
    });
  };

  // ===== Лайки =====
  const toggleLike = (adId) => {
    setAllAds((prev) =>
      prev.map((ad) => {
        if (ad.id === adId) {
          const isFavorite = favorites.find((f) => f.id === adId);
          const likes = isFavorite ? ad.likes - 1 : ad.likes + 1;
          if (isFavorite) {
            setFavorites((favs) => favs.filter((f) => f.id !== adId));
          } else {
            setFavorites((favs) => [...favs, { ...ad, isFavorite: true }]);
          }
          return { ...ad, likes };
        }
        return ad;
      })
    );
  };

  // ===== Masonry render =====
  const renderAds = (ads) => {
    return (
      <div className="masonry">
        {ads.map((ad) => (
          <div key={ad.id} className="card">
            <img src={ad.firstImg} alt="" className="card-img" />
            <div className="body">
              <div className="price">{ad.price || "Договорная"} сом</div>
              <div className="sub">{ad.categoryName}</div>
              <div className="title">{ad.descText}</div>
              <div className="phone">
                <a href={`tel:${ad.phone}`}>{ad.phone}</a>
              </div>
              <div className="actions">
                <button className={`heart ${favorites.find((f) => f.id === ad.id) ? "active" : ""}`} onClick={() => toggleLike(ad.id)}>
                  ♥
                </button>
                <span>{ad.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Создать объявление</button>

      <input
        type="text"
        placeholder="Поиск"
        ref={searchInputRef}
        onChange={(e) => setAllAds(handleSearch(e.target.value))}
      />

      {showModal && (
        <div className="modal">
          <button onClick={() => setShowModal(false)}>Закрыть</button>
          <input placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Выберите категорию</option>
            {Object.entries(categoryLabels).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
          <input placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} />
          <textarea value={descText} onChange={handleDescChange} />
          <div>{descCounter}/6000</div>
          <button onClick={handleCreateAd}>Создать</button>
        </div>
      )}

      {loading ? <p>Загрузка...</p> : renderAds(allAds)}
    </div>
  );
}
