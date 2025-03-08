import { Route, Routes } from 'react-router-dom'
import Indexpage from './pages/indexpage'
import Loginpage from './pages/Loginpage'
import Layout from './Layout.jsx'
import Registerpage from './pages/Registerpage.jsx';
import axios from 'axios';
import { UserContextProvider } from './usercontext.jsx';
import Accountpage from './pages/Accountpage.jsx';
import Placespage from './pages/Placespage.jsx';
import PlacesForm from './pages/PlacesForm.jsx';
import PlacePage from './pages/PlacePage.jsx';


// Set axios base URL to the backend server
axios.defaults.baseURL = 'http://localhost:1000';
axios.defaults.withCredentials = true;
function App() {

  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Indexpage />}></Route>
        <Route path="/login" element={<Loginpage />} ></Route>
        <Route path="/register" element={<Registerpage />} ></Route>
        <Route path="/account/" element={<Accountpage />} ></Route>
        <Route path="/account/places" element={<Placespage />} ></Route>
        <Route path="/account/places/new" element={<PlacesForm />} ></Route>
        <Route path="/account/places/:id" element={<PlacesForm />} ></Route>
        <Route path="places/:id" element={<PlacePage />} ></Route>

      </Route>
      </Routes>
      </UserContextProvider>
  )
}

export default App
