import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { db } from "./Firebase";

const SevenDaysAds = ({ onLoad }) => {
  useEffect(() => {
    const deleteOldAds = async () => {
      try {
        const now = Date.now();
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
        // 7 күн мурунку убакытты Firestore Timestamp форматына айландыруу
        const cutoffDate = firebase.firestore.Timestamp.fromMillis(now - sevenDaysInMillis);

        const oldAdsSnapshot = await db
          .collection("ads")
          .where("timestamp", "<", cutoffDate)
          .get();

        if (!oldAdsSnapshot.empty) {
          const batch = db.batch();
          oldAdsSnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          console.log(`${oldAdsSnapshot.size} эски жарнамалар өчүрүлдү.`);
        }
      } catch (error) {
        console.error("Өчүрүүдө ката кетти:", error);
      }
    };

    // Алгач эскилерди тазалайбыз
    deleteOldAds();

    // Жаңы жарнамаларды угуу (Real-time listener)
    const unsubscribe = db
      .collection("ads")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const ads = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (onLoad) onLoad(ads);
      }, (error) => {
        console.error("Сайтты жүктөөдө ката:", error);
      });

    return () => unsubscribe();
  }, [onLoad]); // onLoad өзгөрсө кайра иштетүү

  return null;
};

export default SevenDaysAds;