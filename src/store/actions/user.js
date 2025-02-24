import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Acción para iniciar sesión
const sign_in = createAsyncThunk("sign_in", async (payload, { rejectWithValue }) => {
  try {
    const { email, password } = payload;
    const response = await axios.post("http://localhost:3000/api/user/login", {
      email: email,
      password: password,
    });

    // Guardar el token en localStorage
    localStorage.setItem("token", response.data.token);

    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error) {
    console.error("Error in sign_in:", error);
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Acción para autenticar al usuario (verificar token)
const authenticate = createAsyncThunk("authenticate", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found");
    }

    const response = await axios.post(
      "http://localhost:5173/api/user/authenticated",
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Actualizar el token si es necesario
    localStorage.setItem("token", response.data.token);

    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error) {
    console.error("Error in authenticate:", error);
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

// Acción para cerrar sesión
const sign_out = createAsyncThunk("sign_out", async (_, { rejectWithValue }) => {
  try {
    // Llamada al API para cerrar sesión
    await axios.post("http://localhost:3000/api/user/sign_out");

    // Eliminar el token del localStorage
    localStorage.removeItem("token");

    return {}; // Retornamos un objeto vacío, ya que no es necesario pasar datos
  } catch (error) {
    console.error("Error in sign_out:", error);
    return rejectWithValue(error.response ? error.response.data : error.message);
  }
});

const userActions = { sign_in, authenticate, sign_out };
export default userActions;
