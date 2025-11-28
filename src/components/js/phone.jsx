import { useEffect, useRef } from "react";

export default function PhoneInput() {
  const phoneRef = useRef(null);

  useEffect(() => {
    const phoneInput = phoneRef.current;
    if (!phoneInput) return;

    const handleFocus = () => {
      if (!phoneInput.value.startsWith("+996")) {
        phoneInput.value = "+996";
      }
      phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    };

    const handleKeyDown = (e) => {
      const caretPos = phoneInput.selectionStart;

      // нельзя удалить код страны
      if (caretPos < 4 && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
      }

      // блокируем вставку любых символов кроме цифр в начало
      if (caretPos < 4 && e.key.length === 1 && !/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    };

    const handleInput = () => {
      let value = phoneInput.value;

      if (!value.startsWith("+996")) {
        value = "+996" + value.replace(/\+996/g, '');
      }

      let digits = value.slice(4).replace(/\D/g, '');
      if (digits.startsWith("0")) digits = digits.slice(1);

      phoneInput.value = "+996" + digits;

      // курсор всегда в конце
      phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
    };

    phoneInput.addEventListener("focus", handleFocus);
    phoneInput.addEventListener("keydown", handleKeyDown);
    phoneInput.addEventListener("input", handleInput);

    // Очистка при размонтировании
    return () => {
      phoneInput.removeEventListener("focus", handleFocus);
      phoneInput.removeEventListener("keydown", handleKeyDown);
      phoneInput.removeEventListener("input", handleInput);
    };
  }, []);

  return <input type="tel" id="phone" ref={phoneRef} placeholder="+996 ___ ___ ___" />;
}
