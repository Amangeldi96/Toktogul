import React, { useState, useEffect } from "react";
import { db } from "./Firebase.js";
import CanvasImg from "./img/Canvas.svg";
import "./css/User.css";

export default function Username({ user }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmAdId, setConfirmAdId] = useState(null); // 🔑 модалка үчүн

  useEffect(() => {
    if (!user) return;

    const unsubscribe = db
      .collection("ads")
      .where("userId", "==", user.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        const adsData = snapshot.docs.map(doc => {
          const data = doc.data();
          const images = Array.isArray(data.images)
            ? data.images
            : data.images
            ? [data.images]
            : [];
          return {
            id: doc.id,
            ...data,
            firstImg: images.length > 0 ? images[0] : CanvasImg,
            images,
          };
        });
        setAds(adsData);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user]);

  const formatPrice = value =>
    value ? `${value.toLocaleString("ru-RU")} сом` : "Келишим түрүндө";

  const handleDelete = async adId => {
    try {
      await db.collection("ads").doc(adId).delete();
      setAds(prev => prev.filter(ad => ad.id !== adId));
      setSuccess("✅ Жарнама ийгиликтүү өчүрүлдү!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("❌ Жарнаманы өчүрүү мүмкүн болгон жок!");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (!user) {
    return <p>Кирүү керек</p>;
  }

  return (
    <div className="my-ads">
      <h2>Менин жарнамаларым</h2>

      {error && <div className="toast error">{error}</div>}
      {success && <div className="toast success">{success}</div>}

      {loading ? (
        <p>Жүктөлүүдө...</p>
      ) : ads.length === 0 ? (
        <p>Жарнама табылган жок.</p>
      ) : (
        <div className="ads-grid">
          {ads.map(ad => (
            <div className="my-card" key={ad.id}>
              <div className="img">
                <img src={ad.firstImg || CanvasImg} alt={ad.desc || "Жарнама"} />
              </div>
              <div className="body">
                <div className="price">{formatPrice(ad.price)}</div>
                <div className="title2">{ad.desc}</div>
                <div className="actions">
                  <button
                    onClick={() => setConfirmAdId(ad.id)} // 🔑 confirm модалка ачылат
                    className="btn-red"
                  >
                    Өчүрүү
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔑 Стилдүү модалка */}
      {confirmAdId && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>Бул жарнаманы чындап өчүрөсүңбү?</p>
            <div className="confirm-actions">
              <button
                className="btn-red"
                onClick={() => {
                  handleDelete(confirmAdId);
                  setConfirmAdId(null);
                }}
              >
                Ооба
              </button>
              <button
                className="btn-gray"
                onClick={() => setConfirmAdId(null)}
              >
                Жок
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}