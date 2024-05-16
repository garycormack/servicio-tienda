import React, { useState, useEffect } from "react";
import appFirebase from "../credenciales";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Navbar from "../Navbar";
import GenerarPDF from "./generarPDF";
import "../estilos/Styles.css";

const db = getFirestore(appFirebase);

const Carrito = ({ correoUsuario }) => {
  const [cantidad, setCantidad] = useState(1);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const q = query(collection(db, `carritos/${correoUsuario}/productos`));
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

  const pagar = async (producto, id) => {
    try {
      const q = query(
        collection(db, "tienda"),
        where("id", "==", producto.idProducto)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const productoData = doc.data();

          if (cantidad <= productoData.cantidad) {
            actualizar(productoData.id);
          } else {
            alert("La cantidad a comprar es mayor que la cantidad disponible.");
          }
        });
      } else {
        console.error(
          "No se encontró ningún producto en la tienda con ese ID."
        );
      }
    } catch (error) {
      console.error("Error al buscar el producto en la tienda:", error);
    }
  };

  const actualizar = async (id) => {
    console.log(id);
    try {
      const q = query(
        collection(db, `carritos/${correoUsuario}/productos`),
        where("idProducto", "==", id)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const productoRef = doc.ref;

          await updateDoc(productoRef, {
            cantidad: cantidad,
          });
          console.log(
            "Producto actualizado correctamente con los nuevos valores."
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        });
      } else {
        console.error("No se encontró ningún producto con ese ID de carrito.");
      }
    } catch (error) {
      console.error(
        "Error al buscar o actualizar el producto en el carrito:",
        error
      );
    }
  };

  const eliminar = async (producto) => {
    try {
      await deleteDoc(
        doc(db, `/carritos/${correoUsuario}/productos/${producto.idCarrito}`)
      );
      setProductos(productos.filter((p) => p.id !== producto.id));
      console.log("Producto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const eliminarCarrito = async () => {
    try {
      const productosRef = collection(
        db,
        `carritos/${correoUsuario}/productos`
      );
      const querySnapshot = await getDocs(productosRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      setProductos([]);

      console.log("Todos los productos han sido eliminados correctamente");
    } catch (error) {
      console.error("Error al eliminar todos los productos:", error);
    }
  };

  const handleCantidadChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setCantidad(value);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="row">
        <h1 className="text-center">C A R R I T O</h1>
        <br /> <br />
        {productos.map((producto) => (
          <div className="col-md-5 mb-8" key={producto.id}>
            <div className="card">
              <h2 className="productoCarrito">{producto.nombre}</h2>
              <div className="botones">
                <img
                  src={producto.foto}
                  className="imagenProductoCarrito"
                  alt={producto.nombre}
                />
                <div className="card-body">
                  <p className="card-text">
                    Disponible: {producto.cantidad} Unidades
                  </p>
                  <p className="card-text">Precio: ${producto.precio}</p>
                  <p className="card-text">Vendedor: {producto.vendedor}</p>
                  <p className="card-text">Cantidad a comprar:</p>
                  <input
                    type="number"
                    placeholder="Cantidad a comprar"
                    className="cajatexto"
                    min="1"
                    onChange={handleCantidadChange}
                  />
                  <div className="botones">
                    <button
                      className="btn btn-primary"
                      onClick={() => pagar(producto, producto.idCarrito)}
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => eliminar(producto)}
                    >
                      Sacar del carrito
                    </button>

                    <div className="pagar">
                      <GenerarPDF
                        correoUsuario={correoUsuario}
                        productos={productos}
                      ></GenerarPDF>
                      <br />
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => eliminarCarrito(producto)}
                      >
                        L I M P I A R
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carrito;
