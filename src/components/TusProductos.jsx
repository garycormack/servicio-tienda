import React, { useState, useEffect } from "react";
import appFirebase from "../credenciales";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Editar from "./Editar";
import "../estilos/Styles.css";

const db = getFirestore(appFirebase);

const TusProductos = ({ correoUsuario }) => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const q = query(
          collection(db, "tienda"),
          where("vendedor", "==", correoUsuario)
        );
        const querySnapshot = await getDocs(q);
        const productosData = [];
        querySnapshot.forEach((doc) => {
          productosData.push({ id: doc.id, ...doc.data() });
        });
        setProductos(productosData);
      } catch (error) {
        console.error("Error al obtener tus productos:", error);
      }
    };

    obtenerProductos();
  }, [correoUsuario]);

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
  };

  const handleGuardarCambios = async (productoEditado) => {
    try {
      const productoRef = doc(db, `tienda`, productoSeleccionado.id);
      await updateDoc(productoRef, productoEditado);
      setProductoSeleccionado(null);
      const q = query(
        collection(db, `tienda`),
        where("vendedor", "==", correoUsuario)
      );
      const querySnapshot = await getDocs(q);
      const productosData = [];
      querySnapshot.forEach((doc) => {
        productosData.push({ id: doc.id, ...doc.data() });
      });
      setProductos(productosData);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, `tienda`, id));
      setProductos(productos.filter((producto) => producto.id !== id));
      console.log("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="titulo">Articulos en su álmacen</h2>
      <br />
      <div className="row">
        {productos.map((producto) => (
          <div className="col-md-4 mb-4" key={producto.id}>
            <div className="card">
              <img
                src={producto.foto}
                className="fichaGeneral"
                alt={producto.nombre}
              />
              <div className="card-body">
                <h5 className="card-title">Nombre: {producto.nombre}</h5>
                <p className="card-text">Descripción: {producto.descripcion}</p>
                <p className="card-text">Dispobible: {producto.cantidad}</p>
                <p className="card-text">Precio: ${producto.precio}</p>
                <p className="card-text">Número de ID: {producto.id}</p>
                <div className="botones">
                  <button
                    type="button"
                    class="btn btn-primary"
                    onClick={() => handleEditar(producto)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => eliminarProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
            <div>
              {productoSeleccionado &&
                productoSeleccionado.id === producto.id && (
                  <Editar
                    producto={productoSeleccionado}
                    guardarCambios={handleGuardarCambios}
                  />
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TusProductos;
