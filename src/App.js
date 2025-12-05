
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./components/Home";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/myads" element={<div>Менин жарнамам</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;