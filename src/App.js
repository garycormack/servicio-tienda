import { useState } from 'react';
import appFirebase from './credenciales';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Router1 from './router/Router1';
import Login from './components/Login';
import './estilos/App.css';

const auth = getAuth(appFirebase);

function App() {
  const [usuario, setUsuario] = useState(null);

  onAuthStateChanged(auth, (usuarioFireBase) => {
    if (usuarioFireBase) {
      setUsuario(usuarioFireBase);
    } else {
      setUsuario(null);
    }
  });

  return (
    <div>
      {usuario ? (
        <Router1 correoUsuario={usuario.email} />
      ) : (
        <Login />
      )}

    </div>
  );
}

export default App;
