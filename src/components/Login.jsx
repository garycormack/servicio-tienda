import React, { useState } from "react";
import imagen from "../imagenes/imagen-uno.png";
import imagen2 from "../imagenes/usuario-sin-foto.png";
import appFirebase from "../credenciales";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth(appFirebase);

function Login() {
  const [registrando, setRegistrando] = useState(false);
  const functionAutenticacion = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contrasenia = e.target.password.value;
    if (registrando) {
      try {
        await createUserWithEmailAndPassword(auth, correo, contrasenia);
      } catch (error) {
        alert("Asegúrese que la contraseña tenga más de 8 caracteres.");
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contrasenia);
      } catch (error) {
        alert(
          "Los datos ingresados son incorrectos. Por favor, verifica y vuelve a intentarlo."
        );
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <div className="padre">
            <div className="card card-body shadow-lg">
              <img src={imagen2} alt="" className="estilo-profile" />
              <form onSubmit={functionAutenticacion}>
                <input
                  type="text"
                  placeholder="Ingresar Email"
                  className="cajatexto"
                  id="email"
                ></input>
                <input
                  type="password"
                  placeholder="Ingresar contrseña"
                  className="cajatexto"
                  id="password"
                ></input>
                <button className="btn-form">
                  {registrando ? "Registrate" : "Iniciar Sesión"}
                </button>
              </form>
              <h4 className="texto">
                {registrando ? "Si ya tienes cuenta" : "Si no tienes cuenta"}{" "}
                <button
                  onClick={() => setRegistrando(!registrando)}
                  className="btnSwicht"
                >
                  {registrando ? "Iniciar Sesión" : "Regístrate"}
                </button>
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <img src={imagen} alt="" className="tamaño-imagen" />
        </div>
      </div>
    </div>
  );
}

export default Login;
