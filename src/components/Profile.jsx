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
	const [activeModal, setActiveModal] = useState("profile");

  const [showMyAdsModal, setShowMyAdsModal] = useState(false); // ✅ Модалка стейти

  const auth = firebase.auth();

useEffect(() => {
  const unsub = auth.onAuthStateChanged((currentUser) => {
    console.log("CurrentUser:", currentUser); // ✅ Бул жерде чыгышы керек
    setUser(currentUser);
    setIsAuthReady(true);
    if (currentUser) setTab("profile");
    else setTab("login");
  });
  return () => unsub();
}, []);


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
      await db.collection("users").doc(u.user.uid).set({ name, email });
      await u.user.updateProfile({ displayName: name });

      setSuccessMessage("Сиз ийгиликтүү катталдыңыз!");
      setTab("login");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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

  // ✅ Менин жарнамам → Толук экран
  if (tab === "user") {
    return (
      <div className="fullpage-username">
        <button
          className="prf-close-btn fullpage-close"
          onClick={() => setTab("profile")}
        >
          ×
        </button>

      <Username user={user} />  // ✅ user пропсу берилүү керек
      </div>
    );
  }

  return (
    <div className="prf-modal-overlay">
      <div className="prf-modal-content">
        <button className="prf-close-btn" onClick={onClose}>×</button>

        {successMessage && <p className="prf-success">{successMessage}</p>}
        {error && <p className="prf-error">{error}</p>}

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


              <button className="prf-btn logout" onClick={logout}>
                Чыгуу
              </button>
            </div>
          </div>
        )}

        {/* Менин жарнамам модалкасы */}
        {showMyAdsModal && (
          <div className="prf-modal-overlay myadss">
            <div className="prf-modal-content myads2">
              <button className="prf-close-btn" onClick={onClose}>×</button>
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