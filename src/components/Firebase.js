// ===== Firebase =====
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

// Конфиг Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4G8qEj4o6ZGGdZMkmqrcFjsKeexAPPlE",
  authDomain: "// ваш email здесь",
  projectId: "toktogul-b4bc8",
  storageBucket: "toktogul-b4bc8.appspot.com",
  messagingSenderId: "// ваш номер здесь",
  appId: "1:994223338100:web:41f38224398bd4d21e5721",
  measurementId: "G-EGSEE12JPM",
};

// Инициализация Firebase (только если еще не инициализирован)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Сервисы
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Экспортируем
export { firebase, auth, db, storage };
