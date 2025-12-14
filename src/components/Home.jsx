// === React ===
import React, { useState, useEffect, useRef, useMemo } from "react";
// === Стили ===
import "./css/styles.css";
import "./css/style.css";
import "./css/card.css";
import "./css/filter.css";
import "./css/cotegory.css";
import { galleryModal,
  galleryClose,
  galleryCounter,
  galleryTrack,
  gallerySlide,
  galleryImg,
  galleryVideo,
  galleryBtn,
  galleryBtnLeft,
  galleryBtnRight,
} from "./galleryModal";
// === Компоненты ===
import SevenDaysAds from "./SevenDaysAds.jsx";
import Profile from "./Profile.jsx";
import SkeletonLoader from "./Skeleton.jsx";
import SkeletonCard from "./SkeletCard.jsx";
// === Картинки ===
import sedanImg from "./img/sedan.png";
import paintBucketImg from "./img/paint-bucket.png";
import repairToolsImg from "./img/repair-tools.png";
import buildingImg from "./img/building.png";
import flowersImg from "./img/flowers.png";
import phoneImg from "./img/phone.png";
import CanvasImg from "./img/Canvas.svg";
// === Firebase ===
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "./Firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

// ===== Вспомогательные функции =====
const formatPrice = (value) =>
  value ? `${value.toLocaleString("ru-RU")} сом` : "Келишим түрүндө";

// ===== Кыргыз номерин текшерүү функциясы =====
const isValidKyrgyzPhone = (phone) => {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 && digits.startsWith("0");
};


const formatPhoneDisplay = (phone) => {
  if (!phone) return "";

  let digits = phone.replace(/\D/g, ""); // Сан гана

  // Эгер +996700604604 форматы менен кирсе → 0700604604 кылып чыгарабыз
  if (digits.length === 12 && digits.startsWith("996")) {
    return "0" + digits.slice(3); // 996700604604 → 0700604604
  }

  // Эгер 700604604 (9 сан) болсо → 0700604604
  if (digits.length === 9) {
    return "0" + digits;
  }

  // Эгер 0700604604 (10 сан) болсо → ошол боюнча кайтара берет
  return digits;
};


const createWhatsAppLink = (phone) => {
  if (!phone) return "#";

  let digits = phone.replace(/\D/g, "");

  // Эгер 0700604604 форматы болсо
  if (digits.length === 10 && digits.startsWith("0")) {
    digits = "996" + digits.slice(1);  // 0'ды алып, +996 кошобуз
  }

  // Эгер 700604604 (9 сан) болсо
  if (digits.length === 9) {
    digits = "996" + digits; // Башына 996 кошобуз
  }

  // Эгер +996700604604 болсо — ошол боюнча кете берет
  if (digits.length === 12 && digits.startsWith("996")) {
    // өзгөртпөйбүз
  }

  return `https://wa.me/${digits}`;
};


const renderColumns = (ads, numColumns) => {
  const columns = Array.from({ length: numColumns }, () => []);
  ads.forEach((ad, index) => columns[index % numColumns].push(ad));
  return columns;
};

// ===== Компонент башталат ушул жерден =====
export default function Home() {
  // ===== Refs =====
  const realGalleryInputRef = useRef(null);
  const plusCategoryRef = useRef(null);
  const plusAddressRef = useRef(null);
  const filterCategoryRef = useRef(null);

	const resetFilter = () => {
  setFilterSelectedCategory(null);
  setFilterSelectedAddress(null);

  setSelectedCategory(null);
  setSelectedAddress(null);
};


  const filterAddressRef = useRef(null);
  const touchStartRef = useRef(0);
  const dropdownRef = useRef(null);

  // ===== Общие state =====
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });
  const [formData, setFormData] = useState({
    phone: "",
    category: "",
    address: "",
    price: "",
    desc: "",
    images: [null, null, null, null, null],
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterPrice, setFilterPrice] = useState({ min: "", max: "" });

  // ===== Плюс модал dropdown =====
  const [plusCategoryOpen, setPlusCategoryOpen] = useState(false);
  const [plusSelectedCategory, setPlusSelectedCategory] = useState("");
  const [plusAddressOpen, setPlusAddressOpen] = useState(false);
  const [plusSelectedAddress, setPlusSelectedAddress] = useState("");

  // ===== Фильтр модал dropdown =====
  const [filterCategoryOpen, setFilterCategoryOpen] = useState(false);
  const [filterSelectedCategory, setFilterSelectedCategory] = useState("");
  const [filterAddressOpen, setFilterAddressOpen] = useState(false);
  const [filterSelectedAddress, setFilterSelectedAddress] = useState("");

  // ===== Notifications =====
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessages, setSuccessMessages] = useState([]);

  // ===== User/Auth =====
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);

  // ===== Ads =====
  const [allAds, setAllAds] = useState([]);
  const [allAdsOriginal, setAllAdsOriginal] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [viewedAds, setViewedAds] = useState([]);
	

  // ===== Filters =====
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddresses, setShowAddresses] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState("");

  // ===== Функция закрытия профиля =====
  const closeProfile = () => setModalOpen(false);

  // ===== Обработчики =====
  const handlePlusSelectCategory = (category) => {
    setPlusSelectedCategory(category);
    setFormData((prev) => ({ ...prev, category }));
    setPlusCategoryOpen(false);
  };
  const handlePlusSelectAddress = (address) => {
    setPlusSelectedAddress(address);
    setFormData((prev) => ({ ...prev, address }));
    setPlusAddressOpen(false);
  };
const handleFilterSelectCategory = (category) => {
  setFilterSelectedCategory(category); // модалкадагы текст үчүн
  setSelectedCategory(category);       // негизги фильтр иштеши үчүн
  setFilterCategoryOpen(false);
};

const handleFilterSelectAddress = (address) => {
  setFilterSelectedAddress(address); // модалкадагы текст үчүн
  setSelectedAddress(address);       // негизги фильтр иштеши үчүн
  setFilterAddressOpen(false);
};







	



  // ===== useEffect анимациялар =====
  useEffect(() => {
    if (!plusCategoryRef.current) return;
    plusCategoryRef.current.style.maxHeight = plusCategoryOpen
      ? plusCategoryRef.current.scrollHeight + "px"
      : "0px";
  }, [plusCategoryOpen]);

  useEffect(() => {
    if (!plusAddressRef.current) return;
    plusAddressRef.current.style.maxHeight = plusAddressOpen
      ? plusAddressRef.current.scrollHeight + "px"
      : "0px";
  }, [plusAddressOpen]);

  useEffect(() => {
    if (!filterCategoryRef.current) return;
    filterCategoryRef.current.style.maxHeight = filterCategoryOpen
      ? filterCategoryRef.current.scrollHeight + "px"
      : "0px";
  }, [filterCategoryOpen]);

  useEffect(() => {
    if (!filterAddressRef.current) return;
    filterAddressRef.current.style.maxHeight = filterAddressOpen
      ? filterAddressRef.current.scrollHeight + "px"
      : "0px";
  }, [filterAddressOpen]);

  // ===== Labels и категории =====
  const addressLabels = {
    toktogul: "Токтогул",
    janyjol: "Жаңы-Жол",
    uchterek: "Үч-Терек",
    tereksuu: "Терек-Суу",
    ozgorush: "Өзгөрүш",
    torken: "Торкен",
    Toluk: "Толук",
    belaldy: "Бел-Алды",
		Cholponata: "Чолпон-Ата",
		aktektir: "Ак-Тектир",
		Karagungoi: "Кара-Күңгөй",
		jetigen: "Жетиген",
		Kambarata: "Камбар-Ата",
		karakul: "Кара-Көл",
  };

  const categoryLabels = {
    electronics: "Электроника",
    cars: "Транспорт",
    real_estate: "Кыймылсыз мүлк",
    clothes: "Кийим-кече",
    services: "Кызматтар",
    jobs: "Иш",
    personal: "Жеке буюмдар",
    home_garden: "Дыйкан чарба",
    repair: "Курулуш",
    hobby: "Мал жандык",
    tehno: "Үй тричилик",
    other: "Башкалар",
  };

  const categories = [
    { img: sedanImg, label: "Транспорт", key: "cars", bgClass: "bg-blue" },
    { img: paintBucketImg, label: "Кызматтар", key: "services", bgClass: "bg-cream" },
    { img: repairToolsImg, label: "Курулуш", key: "repair", bgClass: "bg-light" },
    { img: buildingImg, label: "Кыймылсыз мүлк", key: "real_estate", bgClass: "bg-purple" },
    { img: flowersImg, label: "Дыйкан чарба", key: "home_garden", bgClass: "bg-green" },
    { img: phoneImg, label: "Электроника", key: "electronics", bgClass: "bg-peach" },
  ];


// Категория анимация (плюс модалка)
useEffect(() => {
  if (!plusCategoryRef.current) return;
  plusCategoryRef.current.style.maxHeight = plusCategoryOpen
    ? plusCategoryRef.current.scrollHeight + "px"
    : "0px";
}, [plusCategoryOpen]);

// Адрес анимация (плюс модалка)
useEffect(() => {
  if (!plusAddressRef.current) return;
  plusAddressRef.current.style.maxHeight = plusAddressOpen
    ? plusAddressRef.current.scrollHeight + "px"
    : "0px";
}, [plusAddressOpen]);



  // ===== Helper функции для уведомлений =====
  const showError = (msg) => {
    const id = Date.now();
    setErrorMessages((prev) => [...prev, { id, msg }]);
    setTimeout(() => setErrorMessages((prev) => prev.filter((m) => m.id !== id)), 4000);
  };

  const showSuccess = (msg) => {
    const id = Date.now();
    setSuccessMessages((prev) => [...prev, { id, msg }]);
    setTimeout(() => setSuccessMessages((prev) => prev.filter((m) => m.id !== id)), 4000);
  };

  // ===== Firebase Auth =====
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null);
      setFavorites([]);
      setSelectedTab(null);
      showSuccess("Вы вышли из системы!");
    } catch (error) {
      console.error("Ошибка выхода:", error.message);
      showError("Не удалось выйти. Попробуйте снова.");
    }
  };


  // ===== Галерея =====


	// Галерея ачууну өзгөрт
useEffect(() => {
  if (gallery.open) {
    // Галерея ачык болсо, арттагы скроллду токтотуу
    document.body.style.overflow = "hidden";
  } else {
    // Галерея жабылганда, арттагы скроллду кайра активдештирүү
    document.body.style.overflow = "";
  }

  return () => {
    // Компонент жок кылынганда overflow калыбына келтирүү
    document.body.style.overflow = "";
  };
}, [gallery.open]);

// Ар дайым бирдиктүү форматка айландыруу
const normalizeImages = (images = []) =>
  images
    .filter(img => img && (typeof img === "string" || img.url)) // ❌ url жокторду алып салабыз
    .map((img) => {
      if (typeof img === "string") {
        return { type: "image", url: img };
      }
      return { type: img.type || "image", url: img.url };
    });


const openGallery = (images, index) =>
  setGallery({
    open: true,
    images: normalizeImages(images), // 👈 пустойлор автоматтык жок болот
    index,
  });

const closeGallery = () =>
  setGallery({ open: false, images: [], index: 0 });

const nextImage = () =>
  setGallery((g) => ({
    ...g,
    index: g.index + 1 < g.images.length ? g.index + 1 : 0,
  }));

const prevImage = () =>
  setGallery((g) => ({
    ...g,
    index: g.index - 1 >= 0 ? g.index - 1 : g.images.length - 1,
  }));

	// === Image loading state (spinner үчүн) ===
const [imageLoading, setImageLoading] = useState(
  new Array(5).fill(false)
);

const galleryTrackRef = useRef(null);
const startX = useRef(0);
const isDragging = useRef(false);
const currentX = useRef(0);
const [index, setIndex] = useState(0);


const handleTouchStart = (e) => {
  startX.current = e.touches[0].clientX;
  isDragging.current = true;
};

const handleTouchMove = (e) => {
  if (!isDragging.current) return;

  currentX.current = e.touches[0].clientX - startX.current;

  // swipe учурундагы real-time кыймыл
  galleryTrackRef.current.style.transition = "none";
  galleryTrackRef.current.style.transform =
    `translateX(calc(-${gallery.index * 100}vw + ${currentX.current}px))`;
};

const handleTouchEnd = () => {
  isDragging.current = false;
  const threshold = 50; 

  galleryTrackRef.current.style.transition = "transform 0.3s ease";

  if (currentX.current > threshold) {
    prevImage();
  } else if (currentX.current < -threshold) {
    nextImage();
  } else {
    // threshold жетпесе ошол эле сүрөттө кал
    galleryTrackRef.current.style.transform = `translateX(-${gallery.index * 100}vw)`;
  }

  currentX.current = 0;
};





/* ===== Галереяга сүрөт жана видео жүктөө үчүн state ===== */
  const [uploadProgress, setUploadProgress] = useState([]); // Ар бир файлдын прогресс %
  const [isAdmin, setIsAdmin] = useState(false); // false = колдонуучу, true = админ

  /* ===== Spinner компонент =====
     Жүктөө учурунда прогрессти көрсөтөт
  */
  function Spinner({ progress }) {
    return (
      <div className="spinner">
        <div
          className="spinner-bar"
          style={{ width: `${progress || 0}%`, background: "#4929b4", height: 6 }}
        ></div>
        <span>{progress || 0}%</span>
      </div>
    );
  }

  /* ===== Cloudinaryге сүрөт жүктөө ===== */
  const uploadToCloudinaryImage = (file, index) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "cmpoo6ij"); // 👈 preset туура

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = percent;
            return newProgress;
          });
        }
      };

      xhr.open("POST", "https://api.cloudinary.com/v1_1/dqzgtlvlu/image/upload");

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          console.log("✅ Сүрөт жүктөлдү:", res);
          resolve({
            url: res.secure_url,
            public_id: res.public_id,
            type: "image",
          });
        } else {
          console.error("❌ Cloudinary сүрөт жүктөө катасы:", xhr.responseText);
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject("Сүрөт жүктөөдө ката");
      xhr.send(fd);
    });
  };

  /* ===== Cloudinaryге видео жүктөө ===== */
  const uploadToCloudinaryVideo = (file, index) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "cmpoo6ij"); // 👈 preset туура

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = percent;
            return newProgress;
          });
        }
      };

      xhr.open("POST", "https://api.cloudinary.com/v1_1/dqzgtlvlu/video/upload");

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          console.log("✅ Видео жүктөлдү:", res);
          resolve({
            url: res.secure_url,
            public_id: res.public_id,
            type: "video",
          });
        } else {
          console.error("❌ Cloudinary видео жүктөө катасы:", xhr.responseText);
          reject(xhr.statusText);
        }
      };

      xhr.onerror = () => reject("Видео жүктөөдө ката");
      xhr.send(fd);
    });
  };

  /* ===== Бириктирилген функция (сүрөт/видео автоматтык аныктайт) ===== */
  const uploadMedia = (file, index) => {
    const isVideo = file.type.startsWith("video/");
    return isVideo
      ? uploadToCloudinaryVideo(file, index)
      : uploadToCloudinaryImage(file, index);
  };

  /* ===== Файл тандоо жана жүктөө ===== */
  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploadProgress(new Array(files.length).fill(0));

    files.forEach((file, index) => {
      uploadMedia(file, index).then((res) => {
        console.log("Жүктөлдү:", res);
      });
    });
  };



// ===== Галерея өзгөртүү (сүрөт/видео тандоо) =====
const handleGalleryChange = async (e) => {
  const files = Array.from(e.target.files).slice(0, 5);
  const uploadedItems = [];

  // Loading жана прогресс баштоо
  setImageLoading(files.map(() => true));
  setUploadProgress(files.map(() => 0));

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      let uploaded;
if (file.type.startsWith("video/")) {
  uploaded = await uploadToCloudinaryVideo(file, index);
} else {
  uploaded = await uploadToCloudinaryImage(file, index);
}

      console.log("✅ Жүктөлдү:", uploaded);
      uploadedItems.push(uploaded);
    } catch (err) {
      console.error("❌ Жүктөө катасы:", err);
    } finally {
      setImageLoading((prev) => {
        const arr = [...prev];
        arr[i] = false;
        return arr;
      });
    }
  }

  setFormData((prev) => {
    const newImages = [...prev.images];
    uploadedItems.forEach((item, i) => {
      newImages[i] = item;
    });
    return { ...prev, images: newImages };
  });

  e.target.value = null;
};

// ===== Жарнама берүү =====
const createAd = async () => {
  if (!formData.phone || !formData.category || !formData.desc)
    return showError("Бардык талааларды толтуруңуз!");
  if (!isValidKyrgyzPhone(formData.phone))
    return showError("Телефон номерди туура толтурунуз(мисалы: 0700604604)");
  if (!user) return showError("Жарнама берүү үчүн аккаунт менен кириңиз!");

  setLoading(true);

  try {
    console.log("👉 createAd башталды");
    console.log("Формадагы маалыматтар:", formData);

    const adminEmails = ["Amangeldi-9696@mail.ru", "smagilov91@gmail.com"];
    const isAdmin =
      user.email && adminEmails.map(e => e.toLowerCase()).includes(user.email.toLowerCase());

    console.log("Колдонуучу:", user.email, "isAdmin:", isAdmin);

    const userRef = db.collection("users").doc(user.uid);
    const userDoc = await userRef.get();
    console.log("User документ:", userDoc.exists ? userDoc.data() : "Документ жок");

    // 👇 Сүрөттөрдү текшерүү
    const images = (formData.images || []).filter(img => img && img.url && img.public_id);
    console.log("📦 Firestore'го сакталчу сүрөттөр:", images);

    const adData = {
      ...formData,
      images, // ар бир элемент { url, public_id, type }
      price: formData.price ? Number(formData.price) : 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      likes: 0,
      likedBy: [],
      views: 0,
      userId: user.uid,
      userEmail: user.email
    };

    console.log("Firestore'го сакталчу adData:", adData);

    // Admin жана pending логикасы
    if (isAdmin) {
      console.log("👉 Admin жарнама кошууда");
      await db.collection("ads").add(adData);
      showSuccess("Жарнамаңыз ийгиликтүү жарыяланды!");
    } else if (!userDoc.exists || !userDoc.data().hasFreeAd) {
      console.log("👉 FreeAd логикасы иштеп жатат");
      await db.collection("ads").add(adData);
      await userRef.set({ hasFreeAd: true }, { merge: true });
      showSuccess("Жарнамаңыз ийгиликтүү жарыяланды!");
    } else {
      console.log("👉 PendingAds логикасы иштеп жатат");
      await db.collection("pendingAds").add({ ...adData, status: "pending" });
      showSuccess("Жарнама админге жөнөтүлдү.");
    }

    console.log("👉 Жарнама ийгиликтүү сакталды");

    setFormData({
      phone: "",
      category: "",
      address: "",
      price: "",
      desc: "",
      images: [null, null, null, null, null],
    });
    setPlusSelectedCategory("");
    setPlusSelectedAddress("");
    localStorage.removeItem("newAdImages");
    setModalOpen(false);

  } catch (err) {
    console.error("❌ Жарнама түзүүдө ката:", err.message, err);
    showError("Жарнама түзүүдө ката кетти!");
  } finally {
    setLoading(false);
    console.log("👉 createAd аяктады");
  }
};






  // ===== Likes и избранное =====
const toggleLike = async (ad) => {
  if (!user) {
    showError("Тандалгандарга салуу үчүн аккаунт менен кириңиз!");
    return;
  }

  const adRef = db.collection("ads").doc(ad.id);
  const likedBy = ad.likedBy || [];
  const alreadyLiked = likedBy.includes(user.uid);

  const newLikedBy = alreadyLiked
    ? likedBy.filter(uid => uid !== user.uid)
    : [...likedBy, user.uid];

  const increment = alreadyLiked ? -1 : 1;

  // UI жаңыртуу: бардык ads жана filteredAds
  setAllAdsOriginal(prev =>
    prev.map(a =>
      a.id === ad.id
        ? { ...a, likedBy: newLikedBy, likes: (a.likes || 0) + increment }
        : a
    )
  );

  // Favorites массивин жаңыртуу
  setFavorites(prev => {
    const newFavs = alreadyLiked
      ? prev.filter(id => id !== ad.id)
      : [...prev, ad.id];
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    return newFavs;
  });

  try {
    await adRef.update({
      likedBy: newLikedBy,
      likes: firebase.firestore.FieldValue.increment(increment),
    });
  } catch (err) {
    console.error("Like жаңылоодо ката:", err);
    showError("Like жаңыланган жок!");
  }
};





  // ===== Просмотры объявлений =====
  const handleView = async (adId) => {
    try {
      let viewed = JSON.parse(localStorage.getItem("viewedAds")) || [];
      if (viewed.includes(adId)) return;

      const adRef = db.collection("ads").doc(adId);
      await adRef.update({ views: firebase.firestore.FieldValue.increment(1) });

      viewed.push(adId);
      localStorage.setItem("viewedAds", JSON.stringify(viewed));
      setViewedAds(viewed);
    } catch (error) {
      console.error("жарнаманы көрүүдө ката чыкты:", error);
    }
  };

  // ===== Загрузка объявлений =====
  useEffect(() => {
    const loadAds = async () => {
      setLoadingAds(true);
      try {
        const snapshot = await db.collection("ads").orderBy("timestamp", "desc").limit(20).get();
        const adsData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const images = Array.isArray(data.images) ? data.images : data.images ? [data.images] : [];
          return {
            id: doc.id,
            ...data,
            firstImg: images[0] || CanvasImg,
            images,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate().getTime() : Date.now(),
            categoryName: categoryLabels[data.category] || data.category,
            descText: data.desc?.length > 100 ? data.desc.substring(0, 100) + "..." : data.desc || "",
          };
        });
        setAllAdsOriginal(adsData);
        setAllAds(adsData);
      } catch (error) {
        console.error("Ошибка загрузки объявлений:", error);
        showError("Не удалось загрузить объявления!");
      } finally {
        setLoadingAds(false);
      }
    };
    loadAds();
  }, []);

	//====филер====

const filteredAds = useMemo(() => {
  let ads = allAdsOriginal;

  if (selectedTab === "favorites") {
    ads = ads.filter(ad => favorites.includes(ad.id));
  }

  // Категория + Адрес фильтр
  if (selectedCategory || selectedAddress) {
    ads = ads.filter(ad => {
      const matchCategory = selectedCategory ? ad.category === selectedCategory : true;
      const matchAddress = selectedAddress ? ad.address === selectedAddress : true;
      return matchCategory && matchAddress;
    });
  }

  // Издөө текст боюнча (категория аты + сүрөттөмө)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    ads = ads.filter(ad => {
      const matchesDesc = ad.desc?.toLowerCase().includes(query);
      const matchesCategory = categoryLabels[ad.category]?.toLowerCase().includes(query);
      return matchesDesc || matchesCategory;
    });
  }

  // Баа боюнча фильтр
  const minPrice = Number(filterPrice.min);
  const maxPrice = Number(filterPrice.max);
  if (!isNaN(minPrice) && minPrice > 0) ads = ads.filter(ad => (ad.price || 0) >= minPrice);
  if (!isNaN(maxPrice) && maxPrice > 0) ads = ads.filter(ad => (ad.price || Infinity) <= maxPrice);

  return ads;
}, [
	allAdsOriginal, 
	selectedTab, 
	favorites, 
	selectedCategory, 
	selectedAddress, 
	searchQuery, 
	filterPrice
]);


  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => (counts[cat.key] = 0));
    allAdsOriginal.forEach((ad) => {
      if (ad.category) counts[ad.category] = (counts[ad.category] || 0) + 1;
    });
    return counts;
  }, [allAdsOriginal, categories]);

  const handleCategoryClick = (categoryKey) => setSelectedCategory(categoryKey);

  // ===== Dropdown addresses animation =====
  useEffect(() => {
    if (!dropdownRef.current) return;
    dropdownRef.current.style.maxHeight = showAddresses ? dropdownRef.current.scrollHeight + "px" : "0px";
    dropdownRef.current.style.opacity = showAddresses ? "1" : "0";
  }, [showAddresses]);

  // ===== Firebase Auth listener =====
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const storedFavorites = localStorage.getItem("favorites");
        setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      } else setFavorites([]);
    });
    return () => unsubscribe();
  }, []);




  return (
<div className="wrap">
  {/* ===== 7 күндүк жарнамалар ===== */}
  <SevenDaysAds onLoad={(ads) => setAllAdsOriginal(ads)} />

  {/* ===== Успех жана каталар ===== */}
  <div className="notifications">
    {successMessages.map(msg => (
      <div key={msg.id} className="hom-success">{msg.msg}</div>
    ))}
    {errorMessages.map(msg => (
      <div key={msg.id} className="hom-error">{msg.msg}</div>
    ))}
  </div>

  {/* ===== Верхний поиск и фильтр ===== */}
  <div className="top-row">
    <div className="search">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6.2" stroke="#9AA3B6" strokeWidth="1.6" />
        <path d="M21 21l-4.35-4.35" stroke="#9AA3B6" strokeWidth="1.6" />
      </svg>
      <input
        type="text"
        placeholder="Жарнама издөө..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
    </div>
    <div className="btn-filter" onClick={() => setFilterModalOpen(true)}>Фильтр</div>
  </div>

  {/* ===== Горизонтальная лента категорий ===== */}
  <div className="categories-scroll">
    {categories.map((cat, i) => (
      <div
        className={`cat-card ${cat.bgClass} ${selectedCategory === cat.key ? "selected" : ""}`}
        key={i}
        onClick={() => handleCategoryClick(cat.key)}
      >
        <div className="icon">
          <img src={cat.img} alt={cat.label} />
        </div>
        <div className="text-block">
          <div className="label">{cat.label}</div>
          <div className="count">{categoryCounts[cat.key] || 0}</div>
        </div>
      </div>
    ))}
  </div>

  {/* ===== Основной контент ===== */}
  <main className="content">
    <div className="cards" id="cards">
      {loadingAds ? (
        Array.from({ length: 2 }).map((_, colIndex) => (
          <div
            className="column"
            key={colIndex}
            style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}
          >
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ))
      ) : filteredAds.length === 0 ? (
        <div className="no-ads-message">
          <p>Жарнама табылган жок.</p>
        </div>
      ) : (
        renderColumns(filteredAds, 2).map((col, i) => (
          <div
            className="column"
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: "3px", flex: 1 }}
          >
            {col.map(ad => (
              <div key={ad.id} className="card">

								
<div className="img">
  {ad.images && ad.images[0] ? (
    ad.images[0].type === "video" ? (
      <div
        className="video-thumbnail"
        onClick={() => {
          handleView(ad.id);       // Views count логика
          openGallery(ad.images, 0); // Галерея ачуу
        }}
      >
        <img
          src={ad.images[0].thumbnail}  // Thumbnail жок болсо placeholder
          className="card-img"
          alt="Видео placeholder"
        />
        <div className="play-overlay">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 12L3 18.9671C3 21.2763 5.53435 22.736 7.59662 21.6145L10.7996 19.8727M3 8L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L14.0026 18.131"
              stroke="#3b2f98"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    ) : (
      <img
        src={ad.images[0]?.url || (typeof ad.images[0] === "string" ? ad.images[0] : CanvasImg)}
        className="card-img"
        alt={ad.descText || "Фото объявления"}
        onClick={() => {
          handleView(ad.id);
          openGallery(ad.images, 0);
        }}
      />
    )
  ) : null}
</div>




                <div className="body">
                  <div className="price">{formatPrice(ad.price)}</div>
                    {/* Категория */}
  <div className="sub">
    {categoryLabels[ad.category] || ad.category}
  </div>

  {/* Адрес */}
  {ad.address && (
<div className="address">
  📍 {addressLabels[ad.address] || ad.address}
</div>
  )}
                  <div className="title">{ad.desc || "Жарнама тууралу маалымат жок"}</div>

                  <div className="phone">
                    <a href={`tel:${ad.phone}`}>{formatPhoneDisplay(ad.phone)}</a>
                    <a
                      href={createWhatsAppLink(ad.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-btn whatsapp"
                      style={{ marginLeft: "10px" }}
                    >
                      <svg className="what" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 58">
                        <g>
                          <path fill="#2cb742" d="m0 58 4.988-14.963A28.35 28.35 0 0 1 1 28.5C1 12.76 13.76 0 29.5 0S58 12.76 58 28.5 45.24 57 29.5 57a28.373 28.373 0 0 1-13.26-3.273L0 58z" />
                          <path fill="#ffffff" d="M47.683 37.985c-1.316-2.487-6.169-5.331-6.169-5.331-1.098-.626-2.423-.696-3.049.42 0 0-1.577 1.891-1.978 2.163-1.832 1.241-3.529 1.193-5.242-.52l-3.981-3.981-3.981-3.981c-1.713-1.713-1.761-3.41-.52-5.242.272-.401 2.163-1.978 2.163-1.978 1.116-.627 1.046-1.951.42-3.049 0 0-2.844-4.853-5.331-6.169a2.726 2.726 0 0 0-3.203.482l-1.758 1.758c-5.577 5.577-2.831 11.873 2.746 17.45l5.097 5.097 5.097 5.097c5.577 5.577 11.873 8.323 17.45 2.746l1.758-1.758a2.728 2.728 0 0 0 .481-3.204z" />
                        </g>
                      </svg>
                    </a>
                  </div>

                  <div className="ad-date" style={{ color: "#888", marginTop: "10px" }}>
                    {ad.timestamp ? new Date(ad.timestamp.seconds ? ad.timestamp.seconds * 1000 : ad.timestamp).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    }) + " " + new Date(ad.timestamp.seconds ? ad.timestamp.seconds * 1000 : ad.timestamp).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit"
                    }) : ""}
                  </div>

                  <div className="actions">
                    <div className="left-actions">
                      <svg className="view" viewBox="0 0 24 24">
                        <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                      </svg>
                      <span className="view-count">{ad.views}</span>
                    </div>
                    <div className="right-actions">
                    <button
  type="button"
  className={`icon-btn heart ${ad.likedBy?.includes(user?.uid) ? "active" : ""}`}
  onClick={() => toggleLike(ad)}
>


                        <svg className="like" viewBox="0 0 24 24" fill="none">
                          <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" />
                        </svg>
                      </button>
                      <span className="like-count">{ad.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  </main>


    {/* ===== Модалка создания объявления (Плюс кнопка) ===== */}
{modalOpen && (
  <div
    className="modal open"
    onClick={() => setModalOpen(false)} // сыртты басканда жабылат
  >
    <div
      className="modal__sheet"
      onClick={(e) => e.stopPropagation()} // ичиндеги басканда жабылбайт
    >
      {/* ===== Заголовок ===== */}
      <div className="modal__header">
        <button
          className="close-btn"
          onClick={() => setModalOpen(false)}>✕</button>

        <div className="modal__title">Жарнама берүү</div>
        <div style={{ width: "36px" }}></div>
      </div>

      {/* ===== Галерея и выбранные фото ===== */}
      <div className="gallery" onClick={() => realGalleryInputRef.current.click()}>
        <div className="item big" data-type="gallery">
          <img className="gall" src={CanvasImg} alt="gallery" />
          <span className="big-text">Сүрөттөр</span>
        </div>
      </div>


{/* Слоты для выбранных файлов (сүрөт же видео) */}
<div className="selected-grid">
  {formData.images.map((item, i) => (
    <div className="slot" key={i}>
     {imageLoading[i] ? (
  <Spinner progress={uploadProgress[i]} />
) : item?.type === "video" ? (
  <video src={item.url} controls className="slot-media" />
) : item?.type === "image" ? (
  <img src={item.url} alt={`selected-${i}`} className="slot-media" />
) : (
  <img src={CanvasImg} alt={`placeholder-${i}`} className="slot-media" />
)}
    </div>
  ))}
</div>








      {/* ===== Информация ===== */}
      <div className="info-block">
        <div className="input-group gr">
          <label htmlFor="phone">Байланыш номер</label>
          <input
            type="tel"
            placeholder="0700123456"
            value={formData.phone}
            onChange={e => {
              const digits = e.target.value.replace(/\D/g, "");
              setFormData({ ...formData, phone: digits });
            }}
          />
        </div>

        {/* ===== Категория (Плюс модал) ===== */}
<div className="select-wrapper">
  <div className="select-display" onClick={() => setPlusCategoryOpen(!plusCategoryOpen)}>
    {plusSelectedCategory ? categoryLabels[plusSelectedCategory] : "Категорияны тандаңыз"}
    <span className="arrow">{plusCategoryOpen ? "▲" : "▼"}</span>
  </div>

  {plusCategoryOpen && (
    <div className="select-dropdown">
      {Object.entries(categoryLabels).map(([key, label]) => (
        <div
          key={key}
          className={plusSelectedCategory === key ? "active select-row" : "select-row"}
          onClick={() => {
            setPlusSelectedCategory(key);
            setFormData(prev => ({ ...prev, category: key }));
            setPlusCategoryOpen(false);
          }}
        >
          {label}
        </div>
      ))}
    </div>
  )}
</div>



        {/* ===== Адрес (Плюс модал) ===== */}
       <div className="select-wrapper">
  <div className="select-display" onClick={() => setPlusAddressOpen(!plusAddressOpen)}>
    {plusSelectedAddress ? addressLabels[plusSelectedAddress] : "Адрес тандаңыз"}
    <span className="arrow">{plusAddressOpen ? "▲" : "▼"}</span>
  </div>

  {plusAddressOpen && (
    <div className="select-dropdown">
      {Object.entries(addressLabels).map(([key, label]) => (
        <div
          key={key}
          className={plusSelectedAddress === key ? "active select-row" : "select-row"}
          onClick={() => {
            setPlusSelectedAddress(key);
            setFormData(prev => ({ ...prev, address: key }));
            setPlusAddressOpen(false);
          }}
        >
          {label}
        </div>
      ))}
    </div>
  )}
</div>

        {/* ===== Цена ===== */}
        <div className="input-group gr">
          <label htmlFor="price">Баасы</label>
          <input
            type="number"
            id="price"
            placeholder="Сумасын жазыңыз"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
          />
        </div>
      </div>

      {/* ===== Описание ===== */}
      <div className="desc-block">
        <h4>Жарнамаңыз тууралу маалымат</h4>
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
        <button 
          className="btn-green" 
          onClick={createAd} 
          disabled={loading}
        >
          {loading ? "Жүктөлүүдө..." : "Жарнама берүү"}
        </button>
      </div>

      {/* Скрытый input для галереи */}
<input
  type="file"
  ref={realGalleryInputRef}
  accept="image/*,video/*"   // видео дагы коштук
  multiple
  style={{ display: "none" }}
  onChange={handleGalleryChange}
/>


    </div>
  </div>
)}



{/* ===== Модалка фильтра ===== */}
{filterModalOpen && (
  <div
    className="modal open"
    onClick={() => setFilterModalOpen(false)} // сыртты басканда жабылат
  >
    <div
      className="small-modal"
      onClick={(e) => e.stopPropagation()} // ичиндеги басканда жабылбайт
    >
      <div className="modal__header">
        <button
          className="close-btn"
          onClick={() => setFilterModalOpen(false)} // ✕ басканда жабылат
        >
          ✕
        </button>
        <div className="modal__title">Фильтр</div>
        <div style={{ width: "36px" }}></div>
      </div>

{/* ===== Категория ===== */}
<div className="select-wrapper">
  <div
    className="select-display"
    onClick={() => setFilterCategoryOpen(!filterCategoryOpen)}
  >
    {filterSelectedCategory
      ? categoryLabels[filterSelectedCategory]
      : "Категорияны танда"}
    <span className="arrow">{filterCategoryOpen ? "▲" : "▼"}</span>
  </div>

  {filterCategoryOpen && (
    <div className="select-dropdown">
      {Object.keys(categoryLabels).map((key) => (
        <div
          key={key}
          className={
            filterSelectedCategory === key ? "active select-row" : "select-row"
          }
          onClick={() => {
            setFilterSelectedCategory(key); // Модалкадагы текст жаңылат
            setSelectedCategory(key);       // Негизги фильтр иштейт
            setFilterCategoryOpen(false);
          }}
        >
          {categoryLabels[key]}
        </div>
      ))}
    </div>
  )}
</div>

{/* ===== Адрес ===== */}
<div className="select-wrapper">
  <div
    className="select-display"
    onClick={() => setFilterAddressOpen(!filterAddressOpen)}
  >
    {filterSelectedAddress
      ? addressLabels[filterSelectedAddress]
      : "Адрес танда"}
    <span className="arrow">{filterAddressOpen ? "▲" : "▼"}</span>
  </div>

  {filterAddressOpen && (
    <div className="select-dropdown">
      {Object.keys(addressLabels).map((key) => (
        <div
          key={key}
          className={
            filterSelectedAddress === key ? "active select-row" : "select-row"
          }
          onClick={() => {
            setFilterSelectedAddress(key); // Модалкадагы текст жаңылат
            setSelectedAddress(key);       // Негизги фильтр иштейт
            setFilterAddressOpen(false);
          }}
        >
          {addressLabels[key]}
        </div>
      ))}
    </div>
  )}
</div>




      {/* ===== Цена ===== */}
      <div className="price-row" style={{ display: "flex", gap: "10px" }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Мин сумма</label>
          <input
            type="number"
            value={filterPrice.min}
            onChange={e => setFilterPrice({ ...filterPrice, min: e.target.value })}
          />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Мах сумма</label>
          <input
            type="number"
            value={filterPrice.max}
            onChange={e => setFilterPrice({ ...filterPrice, max: e.target.value })}
          />
        </div>
      </div>

      {/* ===== Кнопка ===== */}
      <div className="actions">
        <button className="btn-green" onClick={() => setFilterModalOpen(false)}>Көрсөтүү</button>
				 <button className="btn-green" onClick={resetFilter}>Жоюу</button>
      </div>
    </div>
  </div>
)}



 {/* ===== Нижнее меню ===== */}
    <div>
  <div className="bottom-nav">
    {/* Главная */}
    <div
      className={`nav-item ${selectedTab === "home" ? "active" : ""}`}
      onClick={() => {
        setSelectedCategory("");
        setSearchQuery("");
        setFilterPrice({ min: "", max: "" });
        setSelectedTab("home");
      }} >
				
      <svg viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M2.5192 7.82274C2 8.77128 2 9.91549 2 12.2039V13.725C2 17.6258 2 19.5763 3.17157 20.7881C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.7881C22 19.5763 22 17.6258 22 13.725V12.2039C22 9.91549 22 8.77128 21.4808 7.82274C20.9616 6.87421 20.0131 6.28551 18.116 5.10812L16.116 3.86687C14.1106 2.62229 13.1079 2 12 2C10.8921 2 9.88939 2.62229 7.88403 3.86687L5.88403 5.10813C3.98695 6.28551 3.0384 6.87421 2.5192 7.82274ZM11.25 18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V15C12.75 14.5858 12.4142 14.25 12 14.25C11.5858 14.25 11.25 14.5858 11.25 15V18Z"></path>
      </svg>
      <span>Башкы бет</span>
    </div>

    {/* Избранное */}
    <div
      className={`nav-item ${selectedTab === "favorites" ? "active" : ""}`}
      onClick={() => {
        setSelectedCategory("");
        setSearchQuery("");
        setFilterPrice({ min: "", max: "" });
        setSelectedTab("favorites");
      }}
    >
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"></path>
      </svg>
      <span>Тандалгандар</span>
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
      <svg className="ic-wat" viewBox="0 0 20 20" fill="none">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-300, -7599)">
            <g transform="translate(56, 160)">
              <path d="M259.821,7453.12124 C259.58,7453.80344 258.622,7454.36761 257.858,7454.53266 C257.335,7454.64369 256.653,7454.73172 254.355,7453.77943 C251.774,7452.71011 248.19,7448.90097 248.19,7446.36621 C248.19,7445.07582 248.934,7443.57337 250.235,7443.57337 C250.861,7443.57337 250.999,7443.58538 251.205,7444.07952 C251.446,7444.6617 252.034,7446.09613 252.104,7446.24317 C252.393,7446.84635 251.81,7447.19946 251.387,7447.72462 C251.252,7447.88266 251.099,7448.05372 251.27,7448.3478 C251.44,7448.63589 252.028,7449.59418 252.892,7450.36341 C254.008,7451.35771 254.913,7451.6748 255.237,7451.80984 C255.478,7451.90987 255.766,7451.88687 255.942,7451.69881 C256.165,7451.45774 256.442,7451.05762 256.724,7450.6635 C256.923,7450.38141 257.176,7450.3464 257.441,7450.44643 C257.62,7450.50845 259.895,7451.56477 259.991,7451.73382 C260.062,7451.85686 260.062,7452.43903 259.821,7453.12124 M254.002,7439 L253.997,7439 L253.997,7439 C248.484,7439 244,7443.48535 244,7449 C244,7451.18666 244.705,7453.21526 245.904,7454.86076 L244.658,7458.57687 L248.501,7457.3485 C250.082,7458.39482 251.969,7459 254.002,7459 C259.515,7459 264,7454.51465 264,7449 C264,7443.48535 259.515,7439 254.002,7439"></path>
            </g>
          </g>
        </g>
      </svg>
      <span>Байланыш</span>
    </div>
    {/* Профиль*/}

   <div
        className={`nav-item ${selectedTab === "profile" ? "active" : ""}`}
        onClick={() => setSelectedTab("profile")}
      >
					<svg viewBox="0 0 24 24" fill="none"><path d="M19.6515 19.4054C20.2043 19.2902 20.5336 18.7117 20.2589 18.2183C19.6533 17.1307 18.6993 16.1749 17.4788 15.4465C15.907 14.5085 13.9812 14 12 14C10.0188 14 8.09292 14.5085 6.52112 15.4465C5.30069 16.1749 4.34666 17.1307 3.74108 18.2183C3.46638 18.7117 3.79562 19.2902 4.34843 19.4054C9.39524 20.4572 14.6047 20.4572 19.6515 19.4054Z">
		</path><circle cx="12" cy="8" r="5" ></circle></svg>
           <span>{user ? user.displayName || "Профиль" : "Профиль"}</span>
      </div>
      </div>

     {selectedTab === "profile" && (
        <Profile user={user} 
				signOut={signOut} 
				onClose={() => setSelectedTab(null)}  
				/>
      )}
    </div>



{gallery.open && gallery.images.length > 0 && (
  <div style={galleryModal}>
    <button className="gallery-close" onClick={closeGallery}>✕</button>
    <div style={galleryCounter}>
      {gallery.index + 1} / {gallery.images.length}
    </div>

    <div
      ref={galleryTrackRef}
      style={{
        ...galleryTrack,
        transform: `translateX(-${gallery.index * 100}vw)`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {gallery.images.map((item, i) => (
        <div key={i} style={gallerySlide}>
          {item.type === "video" ? (
            <video src={item.url} style={galleryVideo} controls />
          ) : (
            <img src={item.url} alt={`Фото ${i + 1}`} style={galleryImg} />
          )}
        </div>
      ))}
    </div>

    <button
      style={{ ...galleryBtn, ...galleryBtnLeft }}
      onClick={(e) => {
        e.stopPropagation();
        setGallery(g => ({
          ...g,
          index: g.index > 0 ? g.index - 1 : g.images.length - 1
        }));
      }}
    >‹</button>

    <button
      style={{ ...galleryBtn, ...galleryBtnRight }}
      onClick={(e) => {
        e.stopPropagation();
        setGallery(g => ({
          ...g,
          index: g.index < g.images.length - 1 ? g.index + 1 : 0
        }));
      }}
    >›</button>
  </div>
)}



</div>
	);
}