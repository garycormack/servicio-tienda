import React, { useState, useEffect } from "react";
import appFirebase from "../credenciales";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import "../estilos/Styles.css";

const db = getFirestore(appFirebase);

const MostrarVentas = ({ correoUsuario }) => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const q = query(collection(db, `ventas/${correoUsuario}/venta`));
        const querySnapshot = await getDocs(q);
        const ventasData = [];
        querySnapshot.forEach((doc) => {
          ventasData.push({
            idVenta: doc.id,
            idProducto: doc.data().idProducto, 
            nombreProducto: doc.data().nombreProducto,
            fecha: doc.data().fechaHoraVenta, 
            comprador: doc.data().comprador
          });
        });
        setVentas(ventasData);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      }
    };
    obtenerVentas();
  }, [correoUsuario]);
  

  return (
    <div className="container">
      <h2 className="titulo">Ventas realizadas</h2>
      <table className="tablaVentas">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>ID Producto</th>
            <th>Nombre Producto</th>
            <th>Fecha</th>
            <th>Comprador</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>{venta.idVenta}</td>
              <td>{venta.idProducto}</td>
              <td>{venta.nombreProducto}</td>
              <td>{venta.fecha}</td>
              <td>{venta.comprador}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MostrarVentas;
