import React,{useEffect, useState} from 'react'
import './App.css';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import EmailVerify from './pages/auth/emailVerifcation/EmailVerify'
import Home from './pages/Home'
import ProductList from './pages/productList/ProductList';
import Product from './pages/singleProduct/Product';
import Orders from './pages/orders/Orders'
import Order from './pages/singleOrder/Order'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import { useTypedSelector } from './Redux/Hooks'
import { axiosInstance } from './axiosInstance';
import { useTypedDispatch } from './Redux/Hooks'
import { UserType } from './Redux/userSlice';
import { getUserCart }  from './Redux/cartSlice';
import ForgotPassword from './pages/auth/forgotPassword/ForgotPassword';
import PasswordReset from './pages/auth/passwordReset/PasswordReset';
import AdminHome from './adminPages/adminHome/AdminHome'
import Users from './adminPages/users/Users';
import AllCarts from './adminPages/allCarts/AllCarts';
import AllOrders from './adminPages/allOrders/AllOrders';
import AllProducts from './adminPages/allProducts/AllProducts'
import EditUser from './adminPages/users/EditUser';
import AddUser from './adminPages/users/AddUser';
import EditOrder from './adminPages/allOrders/EditOrder';
import AddProduct from  './adminPages/allProducts/AddProduct';
import EditProduct from './adminPages/allProducts/EditProduct';
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';
import Cart from './components/cart/Cart';
import AddCart from './adminPages/allCarts/AddCart';
import EditCart from './adminPages/allCarts/EditCart';


const App: React.FC = () => {

  const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
  const isLoading = useTypedSelector(state => state.userSlice.isLoading)
  const dispatch = useTypedDispatch()
  const [filterProductsWord, setFilterProductsWord] = useState("")
  const [sort, setSort] = useState<string>("recent")


  const postCart = async () => {
    if (user && user?.verified && !user.isAdmin) {
      try {
        const newCart = {
          userId: user?._id,
          cartProducts: [],
          quantity: 0,
          total: 0
      }
        const res = await axiosInstance.post(`/api/carts`, newCart)
        dispatch(getUserCart(res.data)) 
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getCart = async () => {
    if (user && user?.verified) {
      try {
        const res = await axiosInstance.get(`/api/carts/${user._id}`)
        if(res.data?._id) {
          dispatch(getUserCart(res.data))
        } else {
            postCart()
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    user && user?.verified && getCart()
  }, [user])

  

  if (isLoading) {
    return (
      <div className="spinner-border" role="status" >
          <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
        <Routes>

          <Route path="/" element={(user && user.isAdmin) 
            ? 
            <AdminHome/> 
            : 
            <Home 
            filterProductsWord={filterProductsWord} 
            setFilterProductsWord={setFilterProductsWord} 
            sort={sort}
            />} 
          />

          <Route path="/products/:category" element={
            user 
            ? 
            <ProductList 
            filterProductsWord={filterProductsWord} 
            setFilterProductsWord={setFilterProductsWord} 
            sort={sort}
            setSort={setSort}
            /> 
            : <Navigate to="/"/>
            }
            />

          <Route path="/products" element={
            user 
            ? 
            <ProductList 
            filterProductsWord={filterProductsWord} 
            setFilterProductsWord={setFilterProductsWord} 
            sort={sort}
            setSort={setSort}
            /> 
            : 
            <Navigate to="/"/>
          }
          />

          <Route path='/product/:productId' element={
            user 
            ? 
            <Product/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path='/orders/:userId' element={
            (user && user?.verified) 
            ? 
            <Orders/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path='/order/:orderId' element={
            (user && user?.verified) 
            ? 
            <Order/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path='/login' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <Login/>
          }/>

          <Route path='/register' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <Register/>
          }/>

          <Route path="/verify/:id/:token" element={<EmailVerify />} />

          <Route path='/forgot-password' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <ForgotPassword/>
          }/>

          <Route path='/password-reset/:id/:token' element={
            user 
            ? 
            <Navigate to="/"/> 
            : 
            <PasswordReset/>
          }/>

          <Route path="/users" element={
            (user && user.isAdmin) 
            ? 
            <Users/> 
            : 
            <Navigate to="/"/>
          }/> 

          <Route path="/newUser" element={
            (user && user.isAdmin) 
            ? 
            <AddUser/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/user/:userId" element={
            (user && user.isAdmin) 
            ? 
            <EditUser/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/allCarts" element={
            (user && user.isAdmin) 
            ? 
            <AllCarts/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/cart/:userId" element={
            (user && user.isAdmin) 
            ? 
            <Cart/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/newCart" element={
            (user && user.isAdmin) 
            ? 
            <AddCart/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/edit-cart/:cartId" element={
            (user && user.isAdmin) 
            ? 
            <EditCart/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/allOrders" element={
            (user && user.isAdmin) 
            ? 
            <AllOrders/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/edit-order/:orderId" element={
            (user && user.isAdmin) 
            ? 
            <EditOrder/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/allProducts" element={
            (user && user.isAdmin) 
            ? 
            <AllProducts/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/newProduct" element={
            (user && user.isAdmin) 
            ? 
            <AddProduct/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/edit-product/:productId" element={
            (user && user.isAdmin) 
            ? 
            <EditProduct/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/user-profile/:userId" element={
            user
            ? 
            <Profile/> 
            : 
            <Navigate to="/"/>
          }/>

          <Route path="/edit-profile/:userId" element={
            user && !user?.isAdmin 
            ? 
            <EditProfile/> 
            : 
            <Navigate to="/"/>
          }/>
          
        </Routes>
    </BrowserRouter>
  )
}

export default App;
