import { Routes, Route, Navigate } from "react-router";
import Footer from "./components/footer/footer"
import Header from "./components/header/header"
import Home from "./pages/Home/home";

export default function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to='/' />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}