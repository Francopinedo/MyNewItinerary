import { createReducer } from "@reduxjs/toolkit";
import userActions from "../actions/user";

// Estado inicial
const initialState = {
  user: {
    name: "",
    lastname: "",
    email: "",
    password: "",
    country: "",
  },
  token: localStorage.getItem("token") || "" // Inicializa el token desde localStorage si está presente
};

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(userActions.sign_in.fulfilled, (state, action) => {
      // Verifica que el payload esté disponible antes de actualizar el estado
      if (action.payload && action.payload.user) {
        state.user = { ...action.payload.user };  // Copia el objeto 'user'
        state.token = action.payload.token || state.token; // Si el token está presente, actualízalo
        localStorage.setItem("token", action.payload.token); // Guardar el token en localStorage
        

      }
    })
    .addCase(userActions.authenticate.fulfilled, (state, action) => {
      // Verifica la validez de los datos antes de actualizar
      if (action.payload && action.payload.user) {
        state.user = { ...action.payload.user };
        state.token = action.payload.token || state.token; // Actualizar el token si es necesario
        localStorage.setItem("token", action.payload.token);
      }
    })
    .addCase(userActions.sign_out.fulfilled, (state) => {
      // Verificar si existe un token y si el usuario está autenticado antes de realizar el cierre de sesión
      const token = localStorage.getItem("token");

      if (token) {
        // Si el token existe en localStorage, es un cierre de sesión válido
        localStorage.removeItem("token"); // Eliminar el token
        state.user = { 
          name: "", 
          lastname: "", 
          email: "", 
          password: "", 
          country: "" 
        }; // Limpiar la información del usuario
        state.token = ""; // Limpiar el token del estado
      }
    });
});

export default userReducer;
