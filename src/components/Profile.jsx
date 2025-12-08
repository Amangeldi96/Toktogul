import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { db } from "./Firebase";	
import "./css/profileStyle.css";

import Username from "./Username"; // ✅ МІНДЕТТҮҮ!!!

export default function Profile({ onClose }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [ads, setAds] = useState([]);
  const [showMyAdsModal, setShowMyAdsModal] = useState(false); 
  const [role, setRole] = useState("user"); // ✅ роль коштук

  const auth = firebase.auth();

  // ===== Админ функциялары =====
  const approveAd = async (id) => {
    const adRef = db.collection("pendingAds").doc(id);
    const adDoc = await adRef.get();

    if (adDoc.exists) {
      const adData = adDoc.data();

      // "ads" коллекциясына көчүрүү
      await db.collection("ads").add({
        ...adData,
        status: "approved",
        approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // pendingAds'тен өчүрүү
      await adRef.delete();
    }
  };

const rejectAd = async (id) => {
  await db.collection("pendingAds").doc(id).delete();
};

  // ===== Колдонуучу абалын угуу =====
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        setTab("profile");
        // роль окуу
        db.collection("users").doc(currentUser.uid).get().then(doc => {
          if (doc.exists) {
            setRole(doc.data().role || "user");
          }
        });
      } else {
        setTab("login");
        setRole("user");
      }
    });
    return () => unsub();
  }, []);

  // ===== Success/Error таймер =====
  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(t);
    }
  }, [error]);

  // ===== Админ үчүн pendingAds угуу =====
  useEffect(() => {
    if (role === "admin") {
      const unsub = db.collection("pendingAds").onSnapshot(snapshot => {
        const adsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAds(adsData);
      });
      return () => unsub();
    }
  }, [role]);

  // ===== Колдонуучу үчүн өзүнүн жарнамаларын угуу =====
  useEffect(() => {
    if (user && role === "user") {
      const unsub = db.collection("ads")
        .where("userId", "==", user.uid)
        .onSnapshot(snapshot => {
          const myAds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setAds(myAds);
        });
      return () => unsub();
    }
  }, [user, role]);

  // ===== Signup/Login/Logout =====
  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const signup = async () => {
    clearMessages();
    if (!name || !email || !password) {
      setError("Бардык талааларды толтуруңуз!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Сыр сөздөр дал келбейт");
      return;
    }
    try {
      const u = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(u.user.uid).set({ 
        name, 
        email, 
        role: "user" // демейки user
      });
      await u.user.updateProfile({ displayName: name });

      setSuccessMessage("Сиз ийгиликтүү катталдыңыз!");
      setTab("login");
      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    } catch (e) {
      setError(e.message);
    }
  };

  const login = async () => {
    clearMessages();
    if (!email || !password) {
      setError("Email жана сыр сөздү киргизиңиз");
      return;
    }
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setSuccessMessage("Сиз кирдиңиз!");
      setTab("profile");
    } catch {
      setError("Email же сыр сөз туура эмес");
    }
  };

  const logout = async () => {
    await auth.signOut();
    setSuccessMessage("Сиз чыктыңыз!");
    setTab("login");
  };

  const resetPassword = async () => {
    clearMessages();
    if (!email) {
      setError("Email киргизиңиз");
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      setSuccessMessage("Калыбына келтирүү үчүн email жөнөтүлдү!");
      setTab("login");
    } catch (e) {
      setError(e.message);
    }
  };

  // ======================== UI =========================

  // ✅ Толук экран Username
  if (tab === "user") {
    return (
      <div className="fullpage-username">
        <button
          className="prf-close-btn fullpage-close"
          onClick={() => setTab("profile")}
        >
          ×
        </button>
        <Username user={user} />
      </div>
    );
  }


	 // ✅ Админ панель
  if (user && tab === "admin" && role === "admin") {
    return (
      <div className="admin-panel">
        <button className="prf-close-btn" onClick={() => setTab("profile")}>×</button>
        <h2>Админ</h2>

        {ads.length === 0 ? (
          <p className="no-ads-text">Азырынча жарнама жок</p>
        ) : (
          <div className="admin-ads-list">
            {ads.map(ad => (
              <div key={ad.id} className="admin-ad-card">
                {ad.imageUrl && (
                  <img className="admin-ad-img" src={ad.imageUrl} alt="ad" />
                )}
                <h3 className="admin-ad-title">{ad.title}</h3>
                <p className="admin-ad-desc">{ad.description}</p>
                <p className="admin-ad-user">Автор: {ad.userEmail}</p>

                <div className="admin-ad-btns">
                  <button className="approve" onClick={() => approveAd(ad.id)}>
                    Ырастоо
                  </button>
                  <button className="reject" onClick={() => rejectAd(ad.id)}>
                    Четке кагуу
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }


 

  return (
   <div
    className="prf-modal-overlay"
    onClick={onClose} // сыртты басканда жабылат
  >
    <div
      className="prf-modal-content"
      onClick={(e) => e.stopPropagation()} // ичиндеги басканда жабылбайт
    >
      <button className="prf-close-btn" onClick={onClose}>×</button>

      {successMessage && <p className="prf-success">{successMessage}</p>}
      {error && <p className="prf-error">{error}</p>}

      {/* Профиль */}
      {user && tab === "profile" && (
        <div className="prf-field">
          <p>Салам, {user.displayName || user.email}</p>

          <div className="prf-buttons">
            <button
              className="prf-btn"
              onClick={() => setShowMyAdsModal(true)}
            >
              Менин жарнамам
            </button>

            {role === "admin" && (
              <button
                className="prf-btn admin"
                onClick={() => setTab("admin")}
              >
                Админ
              </button>
            )}

            <button className="prf-btn logout" onClick={logout}>
              Чыгуу
            </button>
          </div>
        </div>
      )}

      {/* Админ панель — ошол эле модалканын ичинде */}
{user && tab === "admin" && (
  <div className="admin-panel">
    <button className="prf-close-btn" onClick={() => setTab("profile")}>×</button>
    <h2>Админ</h2>

    {/* ФИЛЬТР – бош жарнамаларды жашырабыз */}
    {ads.filter(ad => ad.title && ad.description).length === 0 ? (
      <p className="no-ads-text">Азырынча жарнама жок</p>
    ) : (
      <div className="admin-ads-list">
        {ads
          .filter(ad => ad.title && ad.description) // ← бош документтер жок
          .map(ad => (
            <div key={ad.id} className="admin-ad-card">

              {ad.imageUrl && (
                <img className="admin-ad-img" src={ad.imageUrl} alt="ad" />
              )}

              <h3 className="admin-ad-title">{ad.title}</h3>
              <p className="admin-ad-desc">{ad.description}</p>
              <p className="admin-ad-user">Автор: {ad.userEmail}</p>

              <div className="admin-ad-btns">
                <button className="approve" onClick={() => approveAd(ad.id)}>
                  Ырастоо
                </button>
                <button className="reject" onClick={() => rejectAd(ad.id)}>
                  Четке кагуу
                </button>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
)}




  

        {/* Менин жарнамам модалкасы */}
        {showMyAdsModal && (
          <div
            className="prf-modal-overlay myadss"
            onClick={() => setShowMyAdsModal(false)} // сыртты басканда жабылат
          >
            <div
              className="prf-modal-content myads2"
              onClick={(e) => e.stopPropagation()} // ичиндеги басканда жабылбайт
            >
              <button
                className="prf-close-btn"
                onClick={() => setShowMyAdsModal(false)}
              >
                ×
              </button>
              <Username user={user} />
            </div>
          </div>
        )}

        {!user && isAuthReady && (
          <>
            <div className="prf-tabs">
              <label
                className={`prf-tab ${tab === "login" ? "prf-active" : ""}`}
                onClick={() => { clearMessages(); setTab("login"); }}
              >Кирүү</label>

              <label
                className={`prf-tab ${tab === "signup" ? "prf-active" : ""}`}
                onClick={() => { clearMessages(); setTab("signup"); }}
              >Каттоо</label>

              <span className="prf-shape" style={{ left: tab === "login" ? "0%" : "50%" }} />
            </div>

            <div className="prf-form-wrap">
              {tab === "login" && (
                <div className="prf-field">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <div className="prf-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Сыр сөз"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="prf-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  <input
                    type="button"
                    className="prf-btn"
                    value="Кирүү"
                    onClick={login}
                  />

                  <p className="prf-link" onClick={() => setTab("reset")}>
                    Сыр сөздү унуттуңузбу?
                  </p>
                </div>
              )}

              {tab === "signup" && (
                <div className="prf-field">
                  <input
                    type="text"
                    placeholder="Аты-жөнүңүз"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />

                  <div className="prf-password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Сыр сөз"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="prf-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  <div className="prf-password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Сыр сөздү кайталаңыз"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="prf-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>

                  <input
                    type="button"
                    className="prf-btn"
                    value="Катталуу"
                    onClick={signup}
                  />
                </div>
              )}

              {tab === "reset" && (
                <div className="prf-field">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <input
                    type="button"
                    className="prf-btn"
                    value="Сыр сөздү калыбына келтирүү"
                    onClick={resetPassword}
                  />
                </div>
              )}
            </div>
          </>
        )}

        {!isAuthReady && <p className="prf-loading">Жүктөлүүдө...</p>}
      </div>
    </div>
  );
}