import React,{useState, useEffect} from 'react'
import './Cart.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { axiosInstance } from '../../axiosInstance';
import { CartProduct, getUserCart } from '../../Redux/cartSlice';
import { UserType } from '../../Redux/userSlice';
import { getOrder } from '../../Redux/orderSlice';
import {ProductImageType} from '../../Redux/productImageSlice'
import Sidebar from '../../adminComponents/sidebar/Sidebar';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate } from 'react-router-dom'


const Cart : React.FC = () => {

    const cart = useTypedSelector(state => state.cartSlice.cart)
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
    const dispatch = useTypedDispatch()
    const [address, setAddress] = useState('')
    const navigate = useNavigate() 

const decreaseProductQuantity = async (productId: string) => {
    if(cart?._id) {
        const editedCart = {
            cartProducts: cart.cartProducts.map((item: CartProduct) => 
                item?.product?._id === productId 
                ? {...item, productQuantity: item?.productQuantity - 1}
                : item),
            quantity: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.productQuantity).reduce((a,b) => a + b) : 0,
            total: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.product.price*item.productQuantity).reduce((a,b) => a + b) : 0
        }
        try {
            const res = await axiosInstance.put(`/api/carts/${cart._id}`, editedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}

const increaseProductQuantity = async (productId: string) => {
    if(cart?._id) {
        const editedCart = {
            cartProducts: cart.cartProducts.map((item: CartProduct) => 
                item?.product?._id === productId 
                ? {...item, productQuantity: item?.productQuantity + 1}
                : item),
            quantity: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.productQuantity).reduce((a,b) => a + b) : 0,
            total: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.product.price*item.productQuantity).reduce((a,b) => a + b) : 0
        }
        try {
            const res = await axiosInstance.put(`/api/carts/${cart._id}`, editedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}

const removeProductFromCart = async (productId: string) => {
    if(cart?._id) {
        const editedCart = {
            cartProducts: cart.cartProducts.filter((item: CartProduct) => item?.product?._id !== productId),
            quantity: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.productQuantity).reduce((a,b) => a + b) : 0,
            total: cart.cartProducts.length > 0 ? cart.cartProducts.map((item: CartProduct) => item?.product.price*item.productQuantity).reduce((a,b) => a + b) : 0
        }
        try {
            const res = await axiosInstance.put(`/api/carts/${cart._id}`, editedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}

const resetCart = async () => {
    if(cart?._id) {
        const resettedCart = {
            cartProducts: [],
            quantity: 0,
            total: 0
        }
        try {
            const res = await axiosInstance.put(`/api/carts/${cart._id}`, resettedCart)
            dispatch(getUserCart(res.data)) 
        } catch (error) {
            console.log(error)
        }
    }
}


const postOrder = async () => {
    if ((user && user?.verified) && cart) {
        try {
            const newOrder = {
                userId: user?._id,
                products: cart?.cartProducts,
                amount: cart?.total,
                address
            }
            const res = await axiosInstance.post('/api/orders', newOrder)
            dispatch(getOrder(res.data))
            alert('Order posted with success')
            resetCart()
        } catch (error) {
            console.log(error)
        }
    }
}

return (
<div className='cart-container' style={user?.isAdmin ? {display:'flex', width: '100vw'} : undefined}>
{user?.isAdmin && <Sidebar/>}
<div className='cart-wrapper'>
    {user?.isAdmin && <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>}
    {cart?.cartProducts?.length > 0 && cart?.cartProducts.map((item: CartProduct) => {
    const productImage = productImages.find((img: ProductImageType) => img.productId === item.product._id)
    return (
    <div className='cart-item-wrapper' key={item?.product?._id} style={user?.isAdmin ? {marginTop: '5vh'} : undefined}>
        <div className='cart-header'>
            <h3 className='cart-item-title' style={user?.isAdmin ? {marginLeft: '40%'} : undefined}>{item?.product?.title}</h3>
            {!user?.isAdmin &&
            <button 
            className="btn-close" 
            onClick={() => item?.product?._id && removeProductFromCart(item?.product?._id)}
            ></button>
            }
        </div>
        <div className='cart-item'>
            <div className='cart-item-info'>
                <p>{item?.product?.price}$</p>
                <p>{item?.product?.price*item?.productQuantity}$</p>
            </div>
            <div className='cart-item-icons'>
                {!user?.isAdmin &&
                <div className='cart-remove-icon' onClick={() => (item?.product?._id && item?.productQuantity > 1) && decreaseProductQuantity(item?.product?._id)}>
                    <RemoveIcon/>
                </div>
                }
                <div className={user?.isAdmin ? "prod-quantity" : undefined}>
                    {item?.productQuantity}
                </div>
                {!user?.isAdmin &&
                <div className='cart-add-icon' onClick={() => item?.product?._id && increaseProductQuantity(item?.product?._id)}>
                    <AddIcon/>
                </div>
                }
            </div>
            <img src={`/images/${productImage?.path}`} className='cart-item-image'/>
        </div>
    </div>
    )})}
    {cart?.cartProducts?.length > 0 && !user?.isAdmin &&
    <div className='cart-footer'>
        <h2>Total: {cart?.total}$</h2>
        <div className='reset-cart' onClick={() => resetCart()}><DeleteIcon/></div>
    </div>
    }
    {cart?.cartProducts?.length > 0 && !user?.isAdmin &&
        <div className="mb-4">
            <label className="form-label address-label">Delivery Address <span className='required'>*</span></label>
            <input 
            type="text" 
            className="form-control" 
            placeholder="Type Your Address.."
            required
            value={address}
            onChange={e => setAddress(e.target.value)}
            />
        </div>
    }
    {cart?.cartProducts?.length > 0 && !user?.isAdmin &&
        <button 
        className='submit-cart-btn' 
        onClick={() => {address !== '' ? postOrder() : alert('Delivery Address is required')}}
        >Confirm</button>
    }
</div>
    {cart?.cartProducts.length === 0 && <div className='cart-wrapper empty'>Cart is empty</div>}
</div>
)}

export default Cart