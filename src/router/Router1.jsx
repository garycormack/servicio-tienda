import { Routes, Route } from "react-router-dom";
import Tienda from "../components/Tienda";
import Home from "../components/Home";
import Login from "../components/Login";
import Carrito from "../components/Carrito";

function Router1({ correoUsuario }) {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home correoUsuario={correoUsuario} />} />
      <Route path="/tienda" element={<Tienda correoUsuario={correoUsuario} />} />
      <Route path="/carrito" element={<Carrito correoUsuario={correoUsuario} />} />
    </Routes>
  );
}

export default Router1;
