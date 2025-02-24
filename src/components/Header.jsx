import React from "react";
import { Link as Anchor, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import userActions from "../store/actions/user";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
 
  const token = useSelector((state) => state.user?.token || localStorage.getItem("token") || "");
  
  const isLoggedIn = !!token; 

  const handleLogout = async () => {
    try {
      await dispatch(userActions.sign_out()); // Desloguea al usuario desde Redux
      localStorage.removeItem("token"); // Elimina el token del almacenamiento local
      // Recarga la página para que el estado de la autenticación se actualice
      window.location.reload(); // Recarga la página     
       navigate("/");  
    } catch (error) {
      console.error("Error during logout", error);
    }
  };
  

  return (
    <div className="shadow">
      <div className="container mx-auto px-1">
        <div className="flex items-center justify-between py-1">
          <div>
            <img
              src="../public/logo.jpg"
              alt="Logo"
              className="object-cover h-10 w-15"
            />
          </div>
          <h2 className="ml-4 text-gray-800 text-2xl font-semibold border px-5 py-2 rounded-lg">
            My Itinerary
          </h2>
          <div className="hidden sm:flex sm:items-center nav">
            <Anchor to="/" className="ml-4 text-gray-800 text-2xl font-semibold border px-5 py-2 rounded-lg">
              Home
            </Anchor>
            <Anchor to="/cities" className="ml-4 text-gray-800 text-2xl font-semibold border px-5 py-2 rounded-lg">
              Cities
            </Anchor>

            {!isLoggedIn ? (
              <>
                <Anchor to="/sign-in" className="ml-4 text-gray-800 text-2xl font-semibold border px-5 py-2 rounded-lg">
                  Sign In
                </Anchor>
                <Anchor to="/sign-up" className="ml-4 text-gray-800 text-2xl font-semibold border px-5 py-2 rounded-lg">
                  Sign Up
                </Anchor>
              </>
            ) : (
              <Anchor onClick={handleLogout} className="ml-4 text-gray-800 text-2xl font-semibold border px-5 py-2 rounded-lg">
                Log Out
              </Anchor>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
