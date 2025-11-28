import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const searchInput = document.getElementById("search");

    if (searchInput) {
      function runSearch(q) {
        q = q.toLowerCase();

        document.querySelectorAll(".card").forEach((card) => {
          const titleEl = card.querySelector(".title");
          const descEl = card.querySelector(".title"); // Если нужно, можно исправить на ".desc"
          const categoryEl = card.querySelector(".sub");

          const title = titleEl ? titleEl.textContent.toLowerCase() : "";
          const desc = descEl ? descEl.textContent.toLowerCase() : "";
          const category = categoryEl ? categoryEl.textContent.toLowerCase() : "";

          const match =
            title.includes(q) ||
            desc.includes(q) ||
            category.includes(q);

          card.style.display = match ? "" : "none";
        });
      }

      searchInput.addEventListener("input", () => runSearch(searchInput.value));

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          runSearch(searchInput.value);
          searchInput.blur();
        }
      });

      searchInput.addEventListener("search", () => runSearch(searchInput.value));

      // Очистка обработчиков при размонтировании
      return () => {
        searchInput.removeEventListener("input", () => runSearch(searchInput.value));
        searchInput.removeEventListener("keydown", () => runSearch(searchInput.value));
        searchInput.removeEventListener("search", () => runSearch(searchInput.value));
      };
    }
  }, []);

  return null; // В этом файле только логика поиска
}
