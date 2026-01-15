
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myads" element={<div>Менин жарнамам</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;