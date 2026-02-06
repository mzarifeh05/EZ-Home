import './index.css'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Register />} />
          <Route path='/Login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
