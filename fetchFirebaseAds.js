const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json'); // ключ Firebase Admin

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function fetchAds() {
  const snapshot = await db.collection('ads').orderBy('timestamp', 'desc').get();
  const ads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  fs.writeFileSync('ads.json', JSON.stringify(ads, null, 2));
  console.log('ads.json обновлён!');
}

<<<<<<< HEAD
fetchAds().catch(console.error);
=======
fetchAds().catch(console.error);
>>>>>>> dd50505 (Обновил файл после редактирования)
