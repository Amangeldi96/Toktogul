import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const body = document.body;
    const modal = document.getElementById("modal");
    const categoryModal = document.getElementById("categoryModal");
    const categorySelect = document.getElementById("category");

    const openModalBtn = document.getElementById("openModal"); // КНОПКА «+»
    const closeModalBtn = document.getElementById("closeModal");
    const closeCategoryModalBtn = document.getElementById("closeCategoryModal");
    const confirmCategoryBtn = document.getElementById("confirmCategory");

    function openModal() {
      modal?.classList.add("open");
      body.style.overflow = "hidden";
    }
    function closeModal() {
      modal?.classList.remove("open");
      body.style.overflow = "";
    }
    function openCategoryModal() {
      categoryModal?.classList.add("open");
      body.style.overflow = "hidden";
    }
    function closeCategoryModal() {
      categoryModal?.classList.remove("open");
      body.style.overflow = "";
    }

    if (openModalBtn) {
      openModalBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    }

    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (closeCategoryModalBtn)
      closeCategoryModalBtn.addEventListener("click", closeCategoryModal);
    if (categoryModal) {
      categoryModal.addEventListener("click", (e) => {
        if (e.target === categoryModal) closeCategoryModal();
      });
    }

    if (categorySelect) {
      categorySelect.addEventListener("mousedown", (e) => {
        e.preventDefault();
        openCategoryModal();
      });
      categorySelect.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCategoryModal();
        }
      });
    }

    if (confirmCategoryBtn) {
      confirmCategoryBtn.addEventListener("click", () => {
        const selected = document.querySelector('input[name="cat"]:checked');
        if (selected && categorySelect) {
          categorySelect.value = selected.value;
          closeCategoryModal();
        }
      });
    }

    const realGalleryInput = document.getElementById("realGalleryInput");
    const galleryButton = document.querySelector('.item.big[data-type="gallery"]');
    const selectedGrid = document.getElementById("selectedGrid");

    if (galleryButton && realGalleryInput) {
      galleryButton.addEventListener("click", () => {
        realGalleryInput.click();
      });
    }

    if (realGalleryInput) {
      realGalleryInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        const existingImgs = selectedGrid?.querySelectorAll(".slot img.gal") || [];

        files.forEach((file, index) => {
          if (index >= existingImgs.length) return;

          const reader = new FileReader();
          reader.onload = (event) => {
            const imgSrc = event.target.result;
            existingImgs[index].src = imgSrc;
            existingImgs[index].style.width = "100%";
            existingImgs[index].style.height = "auto";
          };
          reader.readAsDataURL(file);
        });

        realGalleryInput.value = "";
      });
    }

    const desc = document.getElementById("desc");
    const counter = document.getElementById("counter");
    if (desc && counter) {
      desc.addEventListener("input", () => {
        counter.textContent = desc.value.length + "/6000";
      });
    }

    // Очистка обработчиков при размонтировании компонента
    return () => {
      if (openModalBtn) openModalBtn.removeEventListener("click", openModal);
      if (closeModalBtn) closeModalBtn.removeEventListener("click", closeModal);
      if (modal) modal.removeEventListener("click", closeModal);
      if (closeCategoryModalBtn) closeCategoryModalBtn.removeEventListener("click", closeCategoryModal);
      if (categoryModal) categoryModal.removeEventListener("click", closeCategoryModal);
      if (categorySelect) {
        categorySelect.removeEventListener("mousedown", openCategoryModal);
        categorySelect.removeEventListener("keydown", openCategoryModal);
      }
      if (confirmCategoryBtn) confirmCategoryBtn.removeEventListener("click", handleConfirmCategory);
      if (realGalleryInput) realGalleryInput.removeEventListener("change", handleGalleryChange);
      if (galleryButton) galleryButton.removeEventListener("click", () => realGalleryInput.click());
      if (desc) desc.removeEventListener("input", () => counter.textContent = desc.value.length + "/6000");
    };
  }, []);

  return null; // В этом файле просто подключаем JS, разметку рендеришь отдельно
}
