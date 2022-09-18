import React, { useState, useEffect } from 'react'
import './Navbar.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import Cart from '../cart/Cart';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { Link } from 'react-router-dom'
import { logoutUser, UserType } from '../../Redux/userSlice';
import { ImageType } from '../../Redux/imageSlice';


const Navbar : React.FC = () => {

    const [cartOpen, setCartOpen] = useState(false);
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const image = useTypedSelector<ImageType | null>(state => state.imageSlice.image)
    const cart = useTypedSelector(state => state.cartSlice.cart)
    const dispatch = useTypedDispatch()


return (
<div className='navbar-container'>
    <div className='navbar-wrapper'>

        <div className='navbar-left'>
        <Link to="/" style={{ textDecoration: "none" }}>
            <span className="navbar-logo">Beauty Commerce</span>
        </Link>
        </div>

        <div className='navbar-center'>
            <Link to={`/user-profile/${user?._id}`} style={{ textDecoration: "none" }}>
                {user && 
                <div className='navbar-center-item'>
                    <img 
                    src={image ? `/images/${image?.path}` : "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"} 
                    className="sidebar-user-image"
                    />
                    <div>{user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}</div>
                </div>
                }
            </Link>
        </div>

        <div className='navbar-right-item'>
            {!user 
                ?
                <div  className='navbar-right'>
                    <Link to="/register" style={{ textDecoration: "none" }}>
                        <div className='navbar-right-item signup'>Sign Up</div>
                    </Link>
                    <Link to="login" style={{ textDecoration: "none" }}>
                        <div className='navbar-right-item signin'>Sign In</div>
                    </Link>
                </div>
                : 
                <div  className='navbar-right'>
                    {(user && user.verified) &&
                    <Link to={`/orders/${user?._id}`} style={{ textDecoration: "none" }}>
                        <div 
                        className='navbar-right-item' 
                        >ORDERS</div>
                    </Link>
                    }
                    <div className='navbar-right-item signout' onClick={() => dispatch(logoutUser())}>DISCONNECT</div>
                    {user.verified && 
                    <div className='navbar-right-item'>
                    <Drawer open={cartOpen} onClose={() => setCartOpen(false)}>
                        <Cart/>
                    </Drawer>
                    <Badge badgeContent={cart?.quantity} color="error" onClick={() => setCartOpen(true)}>
                        <ShoppingCartIcon className='shoppingCartIcon'/>
                    </Badge>
                    </div>
                    }
                </div>
            }
        </div>
        
    </div>
</div>
)
}

export default Navbar