import React,{FormEvent, useState, useEffect} from 'react'
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { axiosInstance } from '../../axiosInstance'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { CartProduct, CartType } from '../../Redux/cartSlice'
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CartProductModal from './CartProductModal'


const EditCart: React.FC = () => {

    const [msg, setMsg] = useState<string | null>(null)
    const dispatch = useTypedDispatch()
    const navigate = useNavigate() 

    const carts = useTypedSelector<CartType[] | never[]>(state => state.cartSlice.carts)
    const cartId = useParams().cartId
    const cartToEdit = carts && carts.find((cart: CartType) => cart?._id === cartId)

    const [cartProducts, setCartProducts] = useState<CartProduct[] | never[]>(cartToEdit?.cartProducts || [])
    const [quantity, setQuantity] = useState<number>(cartToEdit?.quantity || 0)
    const [total, setTotal] = useState<number>(cartToEdit?.total || 0)
    const [showModal, setShowModal] = useState(false);
    

    const handleEditCart = async (e: FormEvent) => {
    e.preventDefault();
    try {
        const editedCart = {
            userId: cartToEdit?.userId, 
            cartProducts, 
            quantity, 
            total
        }
        const res = await axiosInstance.put(`/api/carts/${cartId}`, editedCart)
        setMsg("Cart Edited..")
        setTimeout(() => navigate(-1), 1500)
    } catch (error) {
        console.log(error)
    }
    }

    const editCartProductQuantity = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setCartProducts(prev => prev.map((cartProduct: any) => 
            cartProduct.product._id === id 
            ? {...cartProduct, productQuantity: Number(e?.target?.value)}
            : cartProduct
        ))
    }

    const deleteProductFromCart = (id: string) => {
        setCartProducts(prev => prev.filter((cartProduct: any) => cartProduct.product._id !== id))
    }

    useEffect(() => {
        if(cartProducts.length > 0) {
        setQuantity(cartProducts.map(item => item.productQuantity).reduce((a,b) => a + b));
        setTotal(cartProducts.map(item => item.productQuantity*item.product.price).reduce((a,b) => a + b));
    }}, [cartProducts])


return (
<div className="add-edit-product">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="add-product-container">
        {msg && <div className='add-product-msg'>{msg}</div>}
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">User ID</label>
            <div className='edit-cart-products-wrapper userId' style={{color:'white'}}>{cartToEdit?.userId}</div>
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Quantity</label>
            <div className="form-control add-edit-product-input" >{quantity}</div>
        </div>
        <div className="form-group add-edit-product-form-group">
            <label className="form-group add-edit-product-label">Total</label>
            <div className="form-control add-edit-product-input" >{total}</div>
        </div>
        <div className="form-group edit-cart-form-group">
            <label className="form-group edit-cart-products-label">Products</label>
            <div className='edit-cart-products-wrapper'>
                {cartProducts.map(item => 
                <div key={item?.product?._id} className="form-control edit-order-products">
                    <input 
                    type="number" 
                    value={item?.productQuantity}
                    min="1"
                    onChange={e => item?.product?._id && editCartProductQuantity(e, item?.product?._id)}
                    className="edit-order-productQuantity"
                    />
                    <div className='edit-order-info'>
                        <img 
                        src={item?.product?.image} 
                        className="admin-productImg"
                        />
                        <div>{item?.product?.title}</div>
                    </div>
                    <CloseIcon 
                    className="remove-order-product"
                    onClick={() => item?.product?._id && deleteProductFromCart(item?.product?._id)}
                    />
                </div>
                )}
            </div>
            <div className='add-product-to-order' onClick={() => setShowModal(true)}>
                <AddIcon/>
                <CartProductModal
                showModal={showModal}
                setShowModal={setShowModal}
                cartProducts={cartProducts}
                setCartProducts={setCartProducts}
                />
            </div>
        </div>
        
        <button 
        type="submit" 
        className="btn btn-primary"
        onClick={e => handleEditCart(e)}
        >Submit</button>
    </div>
</div>
)}

export default EditCart