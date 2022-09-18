import "./Sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { logoutUser, UserType } from '../../Redux/userSlice';
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { ImageType } from '../../Redux/imageSlice';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useLocation } from 'react-router-dom';


const Sidebar = () => {

    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const images = useTypedSelector<ImageType[] | null>(state => state.imageSlice.images)
    const currentUserImage = Array.isArray(images) && images?.find(img => img.userId === user?._id)
    const dispatch = useTypedDispatch()
    const location = useLocation().pathname

    const handleLogout = () => {
        dispatch(logoutUser())
    }


return (
<div className="sidebar">
    <div className="top">
        <Link to="/" className='sidebar-link'>
            <img src={currentUserImage ? `/images/${currentUserImage?.path}` : ""} className="navbar-user-image"/>
            <span className="logo">Beauty Commerce</span>
        </Link>
    </div>
    <hr />
    <div className="center">
    <ul className="sidebar-links">
        <p className="title">MAIN</p>
        <Link to="/" className='sidebar-link'>
        <li>
            <DashboardIcon className="icon" color={location === '/' ? "error" : undefined}/>
            <span style={location === '/' ? {color:'red'} : undefined}>Dashboard</span>
        </li>
        </Link>
        <p className="title">LISTS</p>
        <Link to="/users" className='sidebar-link'>
            <li>
                <PersonOutlineIcon className="icon" color={location === '/users' ? "error" : undefined}/>
                <span style={(location === '/users' || location === '/newUser' || location.startsWith(`/user/`))
                ? {color:'red'} 
                : undefined}
                >Users</span>
            </li>
        </Link>
        <Link to="/allCarts" className='sidebar-link'>
            <li>
                <ShoppingCartIcon className="icon" color={location === '/allCarts' ? "error" : undefined}/>
                <span style={(location === '/allCarts' || location.startsWith('/cart/') || location.startsWith('/edit-cart/')) 
                ? {color:'red'} 
                : undefined}
                >Carts</span>
            </li>
        </Link>
        <Link to="/allProducts" className='sidebar-link'>
            <li>
                <StoreIcon className="icon" color={location === '/allProducts' ? "error" : undefined}/>
                <span style={(location === '/allProducts' || location === '/newProduct' || location.startsWith('/edit-product/'))
                ? {color:'red'} 
                : undefined}
                >Products</span>
            </li>
        </Link>
        <Link to="/allOrders" className='sidebar-link'>
        <li>
            <CreditCardIcon className="icon" color={location === '/allOrders' ? "error" : undefined}/>
            <span style={(location === '/allOrders' || location.startsWith('/edit-order/')) 
            ? {color:'red'} 
            : undefined}
            >Orders</span>
        </li>
        </Link>
        
        <p className="title">USER</p>
        <Link to={`/user-profile/${user?._id}`} className='sidebar-link'>
            <li>
                <AccountCircleOutlinedIcon className="icon" color={location === `/user-profile/${user?._id}` ? "error" : undefined}/>
                <span style={location === `/user-profile/${user?._id}` ? {color:'red'} : undefined}>Profile</span>
            </li>
        </Link>
        <li onClick={handleLogout}>
            <ExitToAppIcon className="icon" />
            <span className="sidebar-logout">Logout</span>
        </li>
    </ul>
    </div>
</div>
)};

export default Sidebar;