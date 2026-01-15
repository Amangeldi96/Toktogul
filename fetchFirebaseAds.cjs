const fs = require('fs');
const admin = require('firebase-admin');

// Подключаем ключ Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fetchAds() {
  try {
    // Берём коллекцию "ads", сортируем по timestamp
    const snapshot = await db.collection('ads').orderBy('timestamp', 'desc').get();

    // Преобразуем документы в массив объектов
    const ads = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Сохраняем в JSON
    fs.writeFileSync('ads.json', JSON.stringify(ads, null, 2));
    console.log('✅ ads.json обновлён!');
  } catch (error) {
    console.error('❌ Ошибка при получении объявлений:', error);
  }
}

// Запускаем функцию
fetchAds().catch(console.error);