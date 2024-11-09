// Importa los módulos necesarios desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "naviway-database.firebaseapp.com",
  projectId: "naviway-database",
  storageBucket: "naviway-database.appspot.com",
  messagingSenderId: "35224588554",
  appId: "1:35224588554:web:8a44a81de4c5820a2c2af3",
  measurementId: "G-MTB3GZZZ9N"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Función para almacenar datos de geolocalización en Firebase con timestamp en formato entero
export function saveLocationData(lat, lng) {
  const timestamp = Date.now(); // Obtiene el timestamp en milisegundos como entero
  const locationRef = ref(database, 'bus/location_history'); // Referencia en la base de datos

  // Almacena latitud, longitud y timestamp
  push(locationRef, { latitude: lat, longitude: lng, timestamp })
    .then(() => {
      console.log('Datos de localización guardados en Firebase.');
    })
    .catch((error) => {
      console.error('Error al guardar datos de localización:', error);
    });
}

// Función para escuchar actualizaciones y convertir timestamp en fecha legible
export function listenForLocationUpdates(callback) {
  const locationRef = ref(database, 'bus/location_history');
  onValue(locationRef, (snapshot) => {
    const data = snapshot.val();

    // Convertir cada timestamp a un formato legible
    const locationData = [];
    for (let key in data) {
      const { latitude, longitude, timestamp } = data[key];
      const readableDate = new Date(timestamp).toLocaleString(); // Convierte el timestamp a fecha legible
      locationData.push({ latitude, longitude, date: readableDate });
    }
    callback(locationData);
  });
}

