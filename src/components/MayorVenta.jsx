import React, { useState, useEffect } from "react";
import appFirebase from "../credenciales";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  orderBy,
  limit,
  doc,
  setDoc,
  where,
} from "firebase/firestore";
import "../estilos/Styles.css";
import { v4 as uuidv4 } from "uuid";
import { isDisabled } from "@testing-library/user-event/dist/utils";

const db = getFirestore(appFirebase);

const MayorVenta = ({ correoUsuario }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const q = query(
          collection(db, `tienda`),
          orderBy("venta", "desc"),
          limit(3)
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

  const handleCompra = async (producto) => {
    try {
      const carritoQuery = query(
        collection(db, `carritos/${correoUsuario}/productos`),
        where("idProducto", "==", producto.id)
      );
      const carritoSnap = await getDocs(carritoQuery);

      if (!carritoSnap.empty) {
        console.log("El producto ya está en el carrito.");
        return;
      }
      const añadirAcarrito = {
        idCarrito: "producto número: " + generarID(),
        idProducto: producto.id,
        foto: producto.foto,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
        precio: producto.precio,
        vendedor: producto.vendedor,
      };

      await setDoc(
        doc(
          db,
          `carritos/${correoUsuario}/productos`,
          añadirAcarrito.idCarrito
        ),
        añadirAcarrito
      );

      console.log("Producto seleccionado:", añadirAcarrito);
    } catch (error) {
      console.error("Error al comprar el producto:", error);
    }
  };

  const generarID = () => {
    const idCompleto = uuidv4();
    const idCorto = idCompleto.substring(0, 4);
    return idCorto;
  };

  return (
    <div className="container">
      <div>
        <h1>Chart Example</h1>
      </div>
      <div className="row">
        <h2 className="titulo">Articulos más vendidos</h2>

        {productos.map((producto) => (
          <div className="col-md-4 mb-2" key={producto.id}>
            <div className="card">
              <h2 className="text-center">{producto.nombre}</h2>

              <img
                src={producto.foto}
                className="fichaGeneral"
                alt={producto.nombre}
              />

              <div className="card-body">
                {producto.cantidad ? (
                  <p className="card-text">
                    <strong>Cantidad:</strong> {producto.cantidad} Unidades
                  </p>
                ) : (
                  <p className="card-text">Producto no disponible</p>
                )}
                <p className="card-text">
                  <strong>Precio:</strong> ${producto.precio}
                </p>
                <p className="card-text">
                  <strong>Descripción:</strong> {producto.descripcion}
                </p>
                <p className="card-text">
                  <strong>Vendedor:</strong> {producto.vendedor}
                </p>

                <div className="botones">
                  {producto.cantidad ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleCompra(producto)}
                    >
                      Agregar a carrito
                    </button>
                  ) : (
                    isDisabled
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MayorVenta;
