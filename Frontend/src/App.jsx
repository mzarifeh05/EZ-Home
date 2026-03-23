import './index.css'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import Favorite from './pages/Favorite/Favorite'
import Admin from './pages/Admin/Admin'
import Cart from './pages/Cart/Cart'
import NotFound from './components/NotFound/NotFound'
import DetailsCard from './components/DetailsCard/DetailsCard'
import { HashRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Favorite' element={<Favorite />} />
          <Route path='/Admin' element={<Admin />} />
          <Route path='/Cart' element={<Cart />} />
          <Route path="/details/:id" element={<DetailsCard />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  )
}

export default App