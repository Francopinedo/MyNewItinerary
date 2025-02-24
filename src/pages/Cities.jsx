import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import citiesActions from '../store/actions/cities';
import Header from '../components/Header';


import { useAuth } from '../authContext.jsx';

function Cities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [newCity, setNewCity] = useState({
    
    name: '',
    info: '',
    img: '',
    currency: '',
    country: '',
    language: '',
  });
  const [cityToDelete, setCityToDelete] = useState('');
 // Verifica si hay un token en localStorage cuando el componente se monta
 
  const citiesInStore = useSelector(state => state.citiesReducer.cities);
  const dispatch = useDispatch();

  const {  isLoggedIn } = useAuth();
  
  // Obtener información del usuario autenticado
  const user = useSelector(state => state.user);  // Asumiendo que 'user' está en el estado global de Redux

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/cities')
      .then((response) => {
        const citiesData = response.data;
        dispatch(citiesActions.get_cities(citiesData));
        setFilteredCities(citiesData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener datos:', error);
      });
  }, [dispatch]);

  // Función para filtrar ciudades en tiempo real
  useEffect(() => {
    const filtered = citiesInStore.filter((city) =>
      city.name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
    setNoResults(filtered.length === 0);
  }, [searchTerm, citiesInStore]);

  const handleInputChange = (e) => {
    setNewCity({ ...newCity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3000/api/cities', newCity);
  
      if (response.status === 201) {
        alert("City Added Successfully");
        console.log(response.data); 
        dispatch(citiesActions.add_city(response.data.city)); // Agregar a Redux
        setFilteredCities([...filteredCities, response.data.city]); // Actualizar lista
        window.location.reload(); // Recarga la página
        // Limpiar formulario
        setNewCity({
          name: '',
          info: '',
          img: '',
          currency: '',
          country: '',
          language: '',
        });
  
        setShowAddForm(false); // Ocultar formulario
       
      }
    } catch (error) {
      // console.error('Error al agregar ciudad:', error);
      // alert("Error al agregar la ciudad. Verifica los datos e inténtalo nuevamente.");
    }
  };

  // Función para eliminar una ciudad

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      // Hacer la solicitud DELETE a la API
      const response = await axios.delete(`http://localhost:3000/api/cities/${cityToDelete}`);
      
      if (response.status === 204) {
        // Si la ciudad fue eliminada correctamente, eliminamos la ciudad del estado
        setFilteredCities(filteredCities.filter(city => city.name !== cityToDelete));
        window.location.reload(); // Recarga la página
        alert("City deleted successfully!");
        setCityToDelete(''); // Limpiar el input
      }
    } catch (error) {
      alert('Error: ' + error.response.data.message);
    }
  };
  

  return (
    <>
       {/* Mostrar los botones solo si el usuario está autenticado */}
       {isLoggedIn && (
        <>
        <div className='flex justify-center'> 

       
        <div className="flex space-x-4 my-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "Add City"}
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            onClick={() => setShowDeleteForm(!showDeleteForm)}
          >
            {showDeleteForm ? "Cancel" : "Delete City"}
          </button>
        </div>
        </div>
        </>
      )}


      {/* Formulario para agregar una ciudad */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-md shadow-md">
          <input type="text" name="name" placeholder="Nombre" onChange={handleInputChange} required />
          <input type="text" name="info" placeholder="Información" onChange={handleInputChange} required />
          <input type="text" name="img" placeholder="URL de Imagen" onChange={handleInputChange} required />
          <input type="text" name="currency" placeholder="Moneda" onChange={handleInputChange} required />
          <input type="text" name="country" placeholder="País" onChange={handleInputChange} required />
          <input type="text" name="language" placeholder="Idioma" onChange={handleInputChange} required />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md mt-2">Save</button>
        </form>
      )}

      {/* Formulario para eliminar una ciudad */}
      {showDeleteForm && (
       <form onSubmit={handleDelete} className="bg-gray-100 p-4 rounded-md shadow-md">
       <select
         onChange={(e) => setCityToDelete(e.target.value)}
         value={cityToDelete}
         required
       >
         <option value="">Select a city to delete</option>
         {filteredCities.map(city => (
           <option key={city._id} value={city._id}>
             {city.name}
           </option>
         ))}
       </select>
       <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-md mt-2">Delete</button>
     </form>
      )}

      {/* SearchBar */}
      <input
        type="text"
        placeholder="Search Cities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded-md"
      />

      {/* Resultado de la búsqueda */}
      {noResults ? (
        <h1>No Results</h1>
      ) : (
        <div className="flex flex-wrap justify-center items-center">
          {filteredCities.map((city) => (
            <a key={city._id} href={`/city/${city._id}`} className="w-full sm:w-96  m-4 sm:m-12 p-4 rounded-lg transition duration-300 hover:shadow-lg">
              <img src={city.img} alt={city.name} className="w-full h-56 object-cover rounded-lg" />
              <h5 className="text-xl sm:text-2xl font-semibold mt-4">{city.name}</h5>
              <p className=" mt-2">Information: {city.info}</p>
              <p className=" mt-2">Currency: {city.currency}</p>
              <p className=" mt-2">Country: {city.country}</p>
              <p className=" mt-2">Language: {city.language}</p>
              <div className="mt-4">
                <a
                  href={`/city/${city._id}`}
                  className="bg-indigo-500 text-white py-2 px-4 rounded-full inline-block hover:bg-indigo-600 transition duration-300"
                >
                  Enter
                </a>
              </div>
            </a>
          ))}
        </div>
      )}

     

      

    </>
  );
}

export default Cities;
