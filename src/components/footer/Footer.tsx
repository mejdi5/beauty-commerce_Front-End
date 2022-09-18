import React from 'react'
import './Footer.css'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useTypedSelector } from '../../Redux/Hooks'
import { UserType } from '../../Redux/userSlice';
import { Link } from 'react-router-dom';


const Footer : React.FC = () => {

    const user = useTypedSelector<UserType|null>(state => state.userSlice.user)

return (
<div className='footer-container'>
    <div className='footer-wrapper'>
        <div className='footer-left'>
            <h2>Beauty Commerce</h2>
            <div className='footer-social'>
                <div className='footer-icon facebook'><FacebookIcon /></div>
                <div className='footer-icon instagram'><InstagramIcon /></div>
                <div className='footer-icon twitter'><TwitterIcon /></div>
            </div>
        </div>
        <div className='footer-center'>
            <h3 className='footer-title'>ITEMS</h3>
            <ul className='footer-list-items'>
                <Link to="/" className="footer-link">
                    <li className='footer-item' onClick={() => window.scrollTo(0, 0)}>Home</li>
                </Link>
                {user && 
                <Link to={`/orders/${user?._id}`} className="footer-link">
                    <li className='footer-item' onClick={() => window.scrollTo(0, 0)}>Orders</li>
                </Link>
                }
                <Link to="/products" className="footer-link">
                    <li className='footer-item' onClick={() => window.scrollTo(0, 1050)}>Products</li>
                </Link>
                <Link to={user ? `/user-profile/${user?._id}`: `/login`} className="footer-link">
                    <li className='footer-item'>Account</li>
                </Link>
            </ul>
        </div>
        <div className='footer-right'>
            <h3 className='footer-title'>CONTACT</h3>
            <ul className='footer-list-contact'>
                <li className='footer-contact'>
                    <div className='phone'>
                        <PhoneIcon color='info'/>
                    </div>
                    <span id="phone">+216 95 614 525</span>
                </li>
                <li className='footer-contact'>
                    <div className='email'>
                        <EmailIcon color='info'/>
                    </div>
                    <span id="email">mejdi.ben.ammou@gmail.com</span>
                </li>
            </ul>
        </div>
    </div>
    <p className='copyright'>Copyright © 2022 All Rights Reserved</p>
</div>
)}

export default Footer