import { useState, useEffect, useRef } from "react";

export default function Filter({ allAds, renderAds }) {
  const filterModalRef = useRef(null);
  const categoryListRef = useRef(null);
  const openCategoryBtnRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);

  const categoryMap = {
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        categoryListRef.current &&
        !categoryListRef.current.contains(e.target) &&
        openCategoryBtnRef.current &&
        !openCategoryBtnRef.current.contains(e.target)
      ) {
        setShowCategoryList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const resetFilter = () => {
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
  };

  const applyFilter = () => {
    const min = minPrice === "" ? 0 : Number(minPrice);
    const max = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);

    const filteredAds = (allAds || []).filter((ad) => {
      const adKey = ad.categoryKey ?? null;
      const adName = ad.categoryName ?? null;

      const byCategory = selectedCategory
        ? adKey === selectedCategory || adName === categoryMap[selectedCategory]
        : true;

      const price = Number(ad.price) || 0;
      const byPrice = price >= min && price <= max;

      return byCategory && byPrice;
    });

    console.log("Выбранная категория:", selectedCategory);
    console.log("Диапазон цен:", min, "-", max);
    console.log("Найдено объявлений:", filteredAds.length);

    if (renderAds) {
      if (filteredAds.length) {
        renderAds(filteredAds);
      } else {
        const cards = document.getElementById("cards");
        if (cards) cards.innerHTML = `<div class="no-ads">Такое объявление пока нет</div>`;
      }
    }

    setShowModal(false);
  };

  return (
    <>
      <button className="btn-filter" onClick={() => setShowModal(true)}>
        Фильтр
      </button>

      {showModal && (
        <div
          id="filterModalNew"
          ref={filterModalRef}
          className="filter-modal"
          style={{ display: "flex" }}
          onClick={(e) => {
            if (e.target === filterModalRef.current) setShowModal(false);
          }}
        >
          <div className="filter-box">
            <div className="filter-header">
              <span>Фильтр</span>
              <button
                id="closeFilterModalNew"
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="filter-section">
              <button
                id="openCategoryBtn"
                className="filter-option"
                ref={openCategoryBtnRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCategoryList(!showCategoryList);
                }}
              >
                {selectedCategory ? categoryMap[selectedCategory] : "Категория"}
              </button>

              {showCategoryList && (
                <div id="catList" ref={categoryListRef} className="cat-list show">
                  {Object.entries(categoryMap).map(([key, name]) => (
                    <label key={key}>
                      <input
                        type="radio"
                        name="filterCategoryNew"
                        value={key}
                        checked={selectedCategory === key}
                        onChange={() => {
                          setSelectedCategory(key);
                          setShowCategoryList(false);
                        }}
                      />
                      {name}
                    </label>
                  ))}
                </div>
              )}

              <div className="price-block">
                <input
                  type="number"
                  id="filterMinPrice"
                  placeholder="Цена от"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  id="filterMaxPrice"
                  placeholder="Цена до"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button id="filterResetBtn" className="reset-btn" onClick={resetFilter}>
                Сбросить
              </button>
              <button id="filterApplyBtn" className="apply-btn" onClick={applyFilter}>
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
