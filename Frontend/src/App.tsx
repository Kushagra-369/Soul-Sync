import Navbar from "./Components/Navbar/Navbar"
import Home from "./Components/Home/Home"
import { BrowserRouter,Route,Routes } from "react-router-dom"

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="pt-20">   {/* 👈 spacing for fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}