import './App.css';
import Nav from './components/Nav'; 
import SignUp from './components/signUp';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import PrivateComponent from './components/PrivateComponent';
import ProductList from './components/ProductList';
import UpdateProduct from './components/updateProduct';
import Profile from './components/Profile';
import Cart from './components/Cart';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/> 
    <Routes>
      <Route element={<PrivateComponent/>}>
      <Route path="/" element={<ProductList/>}/>
      <Route path="/add" element={<AddProduct/>}/>
      <Route path="/update/:id" element={<UpdateProduct/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/logout" element={<h1>Logout Component</h1>}/>
      <Route path="/profile" element={<Profile/>}/>
      </Route>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
