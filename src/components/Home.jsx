import React, { useState } from "react";
import appFirebase from "../credenciales";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { subirProducto } from "../credenciales";
import TusProductos from "./TusProductos";
import Navbar from "../Navbar";
import { v4 as uuidv4 } from "uuid";
import "../estilos/Styles.css";
import MostrarVentas from "./MostrarVentas";

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Home = ({ correoUsuario }) => {
  const [nombreProducto, setNombreProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [mostrarVentas, setMostrarVentas] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagenURL = "";
      if (imagen) {
        const downloadURL = await subirProducto(imagen);
        imagenURL = downloadURL;
      }
      const producto = {
        id: generarID(),
        nombre: nombreProducto,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
        descripcion: descripcion,
        foto: imagenURL,
        vendedor: correoUsuario,
        venta: 0,
      };
      await setDoc(doc(db, `tienda`, producto.id), producto);
      console.log("Producto agregado correctamente", producto);
      setNombreProducto("");
      setCantidad("");
      setPrecio("");
      setImagen(null);
      setDescripcion("");
      window.location.reload();
    } catch (error) {
      console.error("Error al insertar datos:", error);
    }
  };

  const toggleVentas = () => {
    setMostrarVentas(!mostrarVentas);
  };

  const generarID = () => {
    const idCompleto = uuidv4();
    const idCorto = idCompleto.substring(0, 4);
    return idCorto;
  };

  return (
    <div className="container">
      <Navbar />
      <br />
      <h1 style={{ textAlign: "center" }}>I N V E N T A R I O</h1>
      <br />

      <div className="row">
        <div className="col-md-4">
          <div className="padre">
            <div className="card card-body shadow-lg">
              <h2 className="text-center">Bienvenido</h2>

              <p style={{ textAlign: "center" }}>
                <strong>correo: </strong>
                {correoUsuario}
              </p>

              <br />

              <div>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={nombreProducto}
                    onChange={(e) => setNombreProducto(e.target.value)}
                    required
                    className="cajatexto"
                  />
                  <input
                    type="number"
                    placeholder="Cantidad"
                    value={cantidad}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setCantidad(value >= 0 ? value : 0);
                    }}
                    required
                    className="cajatexto"
                  />
                  <input
                    type="number"
                    placeholder="Precio por unidad"
                    value={precio}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setPrecio(value >= 0 ? value : 0);
                    }}
                    required
                    className="cajatexto"
                  />

                  <input
                    type="text"
                    placeholder="Descripción"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    required
                    className="cajatexto"
                  />

                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="cajatexto"
                  />
                  <br />
                  <button type="submit" className="btnSubir">
                    Subir producto a tienda
                  </button>
                </form>
              </div>

              <br />

              <div className="botones">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    signOut(auth);
                  }}
                >
                  Cerrar Sesión
                </button>
                <button className="btn btn-primary" onClick={toggleVentas}>
                  {mostrarVentas ? "Cerrar Ventas" : "Mostrar ventas"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {mostrarVentas ? (
            <MostrarVentas correoUsuario={correoUsuario} />
          ) : (
            <TusProductos correoUsuario={correoUsuario} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
