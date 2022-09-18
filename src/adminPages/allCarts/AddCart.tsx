import React,{FormEvent, useState} from 'react'
import { useTypedDispatch } from '../../Redux/Hooks'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { axiosInstance } from '../../axiosInstance'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { getUserCart } from '../../Redux/cartSlice'
import AddIcon from '@mui/icons-material/Add';
import CartUserModal from './CartUserModal'

const AddCart: React.FC = () => {

    const [msg, setMsg] = useState<string | null>(null)
    const dispatch = useTypedDispatch()
    const navigate = useNavigate() 

    const [userId, setUserId] = useState<string | null>(null)
    const [showUserModal, setShowUserModal] = useState(false)

    const handleAddCart = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const newCart = {userId, cartProducts: [], quantity: 0, total: 0}
        const res = await axiosInstance.post(`/api/carts`, newCart)
        getUserCart(res.data)
        setMsg("Cart Added..")
        setTimeout(() => navigate(-1), 1500)
    } catch (error) {
        console.log(error)
    }
    }

return (
<div className="add-edit-product">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="add-product-container">
        {msg && <div className='add-product-msg'>{msg}</div>}
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">User ID</label>
            <div className='edit-cart-products-wrapper userId' style={{color:'white'}}>{userId || "Select User.."}</div>
            <div className='add-product-to-order' onClick={() => setShowUserModal(true)}>
                <AddIcon/>
                <CartUserModal
                showUserModal={showUserModal}
                setShowUserModal={setShowUserModal}
                userId={userId}
                setUserId={setUserId}
                />
            </div>
        </div>        
        <button 
        type="submit" 
        className="btn btn-primary"
        onClick={e => handleAddCart(e)}
        >Submit</button>
    </div>
</div>
)}

export default AddCart