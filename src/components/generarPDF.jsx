import jsPDF from "jspdf";
import React from "react";
import appFirebase from "../credenciales";
import { getFirestore, doc, setDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "../estilos/Styles.css";

const db = getFirestore(appFirebase);

export function GenerarPDF({ correoUsuario, productos }) {
  const handleGeneratePDF = () => {
    const fechaHoraActual = new Date();
    const fechaFormateada = fechaHoraActual.toLocaleDateString();
    const horaFormateada = fechaHoraActual.toLocaleTimeString();

    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.text("Gracias por su compra!", 10, 10);
    doc.text(`Fecha: ${fechaFormateada}`, 10, 20);
    doc.text(`Hora: ${horaFormateada}`, 10, 30);

    let startY = 40;

    doc.setFontSize(10);
    doc.text("ID", 10, startY);
    doc.text("Nombre", 40, startY);
    doc.text("Descripción", 80, startY);
    doc.text("Cantidad", 140, startY);
    doc.text("Precio", 160, startY);
    doc.text("total", 180, startY);

    productos.forEach((producto, index) => {
      startY += 10;
      doc.text(producto.idProducto, 10, startY);
      doc.text(producto.nombre, 40, startY);
      doc.text(producto.descripcion, 80, startY);
      doc.text(producto.cantidad.toString(), 140, startY);
      doc.text("$" + producto.precio.toString(), 160, startY);
      const totalProducto = producto.cantidad * producto.precio;
      doc.text("$" + totalProducto.toString(), 180, startY);
    });

    handleSubmit();
    doc.save("Ticket.pdf");
  };

  const handleSubmit = async () => {
    const fechaHoraActual = new Date();
    const fechaFormateada = fechaHoraActual.toLocaleDateString();
    const horaFormateada = fechaHoraActual.toLocaleTimeString();
    try {
      const promises = productos.map(async (producto) => {
        const ventaData = {
          idProducto: producto.id,
          nombreProducto: producto.nombre,
          cantidadVendida: producto.cantidad,
          precioUnitario: producto.precio,
          vendedor: producto.vendedor,
          fechaHoraVenta: fechaFormateada + "   " + horaFormateada,
          comprador: correoUsuario,
        };
  
        await setDoc(
          doc(db, `ventas/${producto.vendedor}/venta`, generarID()),
          ventaData
        );
        console.log("Producto agregado correctamente", producto);
        eliminarCarrito();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
      await Promise.all(promises);
      console.log("Todos los productos se han agregado correctamente");
    } catch (error) {
      console.error("Error al insertar datos:", error);
    }
  };
  
  const generarID = () => {
    const idCompleto = uuidv4();
    const idCorto = idCompleto.substring(0, 4);
    return idCorto;
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
      console.log("Todos los productos han sido eliminados correctamente");
    } catch (error) {
      console.error("Error al eliminar todos los productos:", error);
    }
  };

  return (
    <div className="container">
      <button onClick={handleGeneratePDF} className="btn btn-primary">
        P A G A R
      </button>
    </div>
  );
}

export default GenerarPDF;
