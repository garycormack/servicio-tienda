import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { v4 } from "uuid";


const firebaseConfig = {
  apiKey: "AIzaSyAUGiIK2_CbiuTveBb5AU8A0WVUeRZncPs",
  authDomain: "servicio-tienda.firebaseapp.com",
  projectId: "servicio-tienda",
  storageBucket: "servicio-tienda.appspot.com",
  messagingSenderId: "182248153015",
  appId: "1:182248153015:web:02968fce6e9aa9082d1232",
  measurementId: "G-95C1WBHJGW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);

export async function subirProducto(file) {
  try {
    const storageRef = ref(storage, 'productos/' + file.name + v4());
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Archivo subido exitosamente:", snapshot);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("URL de descarga:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw error;
  }
}


  

export default app;
