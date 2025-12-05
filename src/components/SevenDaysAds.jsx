import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { db } from "./Firebase";

const SevenDaysAds = ({ onLoad }) => {
  const [allAds, setAllAds] = useState([]);
  const [allAdsOriginal, setAllAdsOriginal] = useState([]);

  useEffect(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    const deleteOldAds = async () => {
      const oldAdsSnapshot = await db
        .collection("ads")
        .where(
          "timestamp",
          "<",
          firebase.firestore.Timestamp.fromMillis(now - sevenDays),
        )
        .get();

      if (!oldAdsSnapshot.empty) {
        const batch = db.batch();
        oldAdsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }
    };

    const unsubscribe = db
      .collection("ads")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const ads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllAds(ads);
        setAllAdsOriginal(ads);

        // Передаём наверх
        if (onLoad) onLoad(ads);
      });

    deleteOldAds();
    return () => unsubscribe();
  }, []);

  return null;
};

export default SevenDaysAds;
