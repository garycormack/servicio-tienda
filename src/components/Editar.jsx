import React, { useState } from "react";

const Editar = ({ producto, guardarCambios }) => {
  const [nombreProductoEditado, setNombreProductoEditado] = useState(
    producto.nombre
  );
  const [cantidadProductoEditado, setCantidadProductoEditado] = useState(
    producto.cantidad
  );
  const [precioProductoEditado, setPrecioProductoEditado] = useState(
    producto.precio
  );
  const [descripcionProductoEditado, setDescripcionProductoEditado] = useState(
    producto.descripcion
  );
  const [imagen, setImagen] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    guardarCambios({
      nombre: nombreProductoEditado,
      cantidad: parseInt(cantidadProductoEditado),
      precio: parseFloat(precioProductoEditado),
      descripcion: descripcionProductoEditado,
      foto: imagen ? URL.createObjectURL(imagen) : producto.foto,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={nombreProductoEditado}
        onChange={(e) => setNombreProductoEditado(e.target.value)}
      />
      <input
        type="number"
        value={cantidadProductoEditado}
        onChange={(e) => setCantidadProductoEditado(e.target.value)}
      />
      <input
        type="number"
        value={precioProductoEditado}
        onChange={(e) => setPrecioProductoEditado(e.target.value)}
      />
      <input
        type="text"
        value={descripcionProductoEditado}
        onChange={(e) => setDescripcionProductoEditado(e.target.value)}
      />
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Guardar</button>
    </form>
  );
};

export default Editar;
