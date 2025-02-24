import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import citiesActions from '../store/actions/cities';
import axios from "axios";
import { useAuth } from '../authContext.jsx';
function CityDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [city, setCity] = useState(null);
  const [itineraries, setItineraries] = useState([]);  // Para almacenar itinerarios
  const [isLoading, setIsLoading] = useState(true);
  const [newItinerary, setNewItinerary] = useState({ name: "", info: "" , duration: "", price: ""});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const {  isLoggedIn } = useAuth();
  useEffect(() => {
    // Obtener la ciudad
    axios.get(`http://localhost:3000/api/city/${id}`)
      .then((response) => {
        setCity(response.data);  // Guardamos la ciudad en el estado
        setIsLoading(false);

        // Buscar itinerarios solo si la ciudad tiene un campo itineraries
        if (response.data.itineraries && response.data.itineraries.length > 0) {
          fetchItineraries(response.data.itineraries);  // Llamamos la función con los IDs de los itinerarios
        }
      })
      .catch((error) => {
        console.error("Error al obtener datos de la ciudad:", error);
        setIsLoading(false);
      });

    // Despachar acción si es necesario (puedes personalizar esto según tu aplicación)
    dispatch(citiesActions.filter_cities_id(id))
      .then((response) => {
        // Aquí puedes manejar cualquier cosa con la respuesta del dispatch
      })
      .catch((error) => {
        console.error("Error al obtener itinerarios:", error);
      });
  }, [dispatch, id]);

  const fetchItineraries = (itineraryIds) => {
    // Llamar a la API para obtener los itinerarios usando los ids
    Promise.all(
      itineraryIds.map((id) =>
        axios.get(`http://localhost:3000/api/itineraries/${id}`) // Usamos `id` en lugar de `itineraryId`
      )
    )
      .then((responses) => {
        // Extraer los itinerarios y guardarlos en el estado
        setItineraries(responses.map((response) => response.data));
      })
      .catch((error) => {
        console.error("Error al obtener itinerarios:", error);
      });
  };
  

  const handleAddItinerary = async () => {
    if (!newItinerary.name.trim() || !newItinerary.info.trim()) {
      setMessage("⚠️ Por favor completa todos los campos.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post(`http://localhost:3000/api/city/${id}/itinerary`, newItinerary);
      setItineraries([...itineraries, response.data]);
      setNewItinerary({ name: "", info: "", duration: "", price: "" });
      setMessage("✅ Itinerario agregado con éxito.");
    } catch (error) {
      console.error("Error al agregar itinerario:", error);
      setMessage("❌ Error al agregar itinerario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!city) {
    return <div>City not found.</div>;
  }

  return (
    <>
      <h1 className="text-5xl font-medium tracking-tight text-neutral-950 m-8">
        {city.name}
      </h1>
      <h2 className="text-3xl text-neutral-950 m-10">{city.info}</h2>
      <div className="flex items-center justify-center">
        {city.img && (
          <img
            className="h-56 rounded-xl shadow-lg"
            src={city.img}
            alt={city.name}
          />
        )}
      </div>

      <h3 className="text-2xl mt-5">Itineraries</h3>
      {itineraries.length === 0 ? (
        <p>-</p>
      ) : (
        itineraries.map((itinerary, index) => (
          <div key={index} className="border p-4 mt-3 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{itinerary.name}</h2>
            <p>Information: {itinerary.info}</p>
            <p>Duration: {itinerary.duration}</p>
            <p>Price: {itinerary.price}</p>
          </div>
        ))
      )}



{isLoggedIn && (
        <>
      <div className="mt-5">
        <h3 className="text-xl font-semibold">Add new Itinerary</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Nombre del itinerario"
            className="border rounded p-2 w-full sm:w-auto"
            value={newItinerary.name}
            onChange={(e) => setNewItinerary({ ...newItinerary, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            className="border rounded p-2 w-full sm:w-auto"
            value={newItinerary.info}
            onChange={(e) => setNewItinerary({ ...newItinerary, info: e.target.value })}
          />
           <input
            type="text"
            placeholder="Duration"
            className="border rounded p-2 w-full sm:w-auto"
            value={newItinerary.duration}
            onChange={(e) => setNewItinerary({ ...newItinerary, duration: e.target.value })}
          />
           <input
            type="text"
            placeholder="Price"
            className="border rounded p-2 w-full sm:w-auto"
            value={newItinerary.price}
            onChange={(e) => setNewItinerary({ ...newItinerary, price: e.target.value })}
          />
          <button
            className={`px-4 py-2 rounded text-white transition ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={handleAddItinerary}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Add"}
          </button>
        </div>

        {message && (
          <p className="mt-2 text-sm font-semibold text-gray-800">{message}</p>
        )}
      </div>
      </>
    )}
      <div className="mt-8">
        <Link to="/cities">
          <button className="text-2xl font-semibold border px-5 py-2 rounded-lg hover:text-purple-600 hover:border-purple-600">
            Volver a Ciudades
          </button>
        </Link>
      </div>
    </>
  );
}

export default CityDetails;
