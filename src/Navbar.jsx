import React from "react";
import "./estilos/Style-Navbar.css";

function Navbar() {
  return (
    <nav>
      <div className="container-fluid">
        <a href="/tienda" className={`navbar-brand`}>
          T I E N D A
        </a>
        <a href="/home" className={`navbar-brand`}>
          I N V E N T A R I O
        </a>
        <a href="/carrito" className={`navbar-brand`}>
          C A R R I T O
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
