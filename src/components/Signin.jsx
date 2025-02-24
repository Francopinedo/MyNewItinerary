import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "react-toastify/dist/ReactToastify.css";

export default function SignIn({ toggleHeader }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate(); // Crea la función navigate

  // Verifica si hay un token en localStorage cuando el componente se monta
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      console.log("Sesión iniciada");
    } else {
      setIsLoggedIn(false);
      console.log("Sesión no iniciada");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      email: email,
      password: password,
    };
    loginWithEmail(body);
  };

  const loginWithEmail = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        data
      );
      if (response && response.data) {
        setIsLoggedIn(true);
        localStorage.setItem("token", response.data.token);
        
        // toggleHeader(true); // Asegúrate de que toggleHeader esté pasando correctamente
        // Redirige a la página de inicio después del inicio de sesión exitoso
        navigate("/");  // Redirige al usuario a /home
        window.location.reload(); // Recarga la página
        toast.success(`Welcome, ${response.data.user.email}!`);
      } else {
        // toast.error("Login failed: Response data is missing");
      }
    } catch (error) {
      console.error("Login failed", error.response ? error.response.data : error.message);
      toast.error("Login failed: Please verify your credentials.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token"); // Elimina el token de localStorage
    toast.success(`Session Closed!`);
    toggleHeader(false); // Asegúrate de que toggleHeader también cambie el estado correctamente
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <ToastContainer />
        <div className="text-gray-900 flex justify-center">
          <div className="max-w-screen-xl m-0 sm:m-10 flex justify-center flex-1">
            <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
              <div className="mt-8 flex flex-col items-center mt-40">
                <h1 className="text-2xl xl:text-3xl font-extrabold">Sign in</h1>
                <div className="w-full flex-1 mt-8">
                  <div className="flex flex-col items-center">
                    <div>
                      {/* Aquí puedes agregar un botón de Google si lo necesitas */}
                    </div>
                  </div>
                  <div className="my-12 border-b text-center">
                    <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium transform translate-y-1/2">
                      Sign in with e-mail
                    </div>
                  </div>
                  <div className="mx-auto max-w-xs">
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-black text-white w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      Sign-In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center hidden lg:flex">
            <div className="m-12 xl:m-16 w-full h-full flex items-center justify-center bg-contain bg-center bg-repeat">
              <img className="img-form" src="../public/cityX.png" alt="" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
