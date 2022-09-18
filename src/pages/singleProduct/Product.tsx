import React,{useState} from 'react'
import Footer from '../../components/footer/Footer'
import Navbar from '../../components/navbar/Navbar'
import './Product.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate, useParams } from 'react-router-dom';
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import { ProductType } from '../../Redux/productSlice';
import { getUserCart, CartType, CartProduct } from '../../Redux/cartSlice';
import { axiosInstance } from '../../axiosInstance';
import { UserType } from '../../Redux/userSlice';
import ActivateAccount from '../../components/activateAccount/ActivateAccount';
import {ProductImageType} from '../../Redux/productImageSlice'


const Product : React.FC = () => {

    const dispatch = useTypedDispatch()
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const products = useTypedSelector<ProductType[]>(state => state.productSlice.products)
    const productImages = useTypedSelector<ProductImageType[] | never[]>(state => state.productImageSlice.productImages)
    const cart = useTypedSelector<CartType | null>(state => state.cartSlice.cart)
    const navigate = useNavigate()
    const productId = useParams().productId
    const product = products.find(p => p._id === productId)
    const productImage = productImages.find((img: ProductImageType) => img.productId === productId)
    const [productNumber, setProductNumber] = useState(1)



    const editCart = async (addedProduct: any) => {
        if(cart?._id) {
            const editedCart = {
                ...cart, 
                cartProducts: 
                cart.cartProducts.some((item: any) => item?.product?._id === addedProduct?.product?._id) 
                ? cart.cartProducts.map(item => 
                    item?.product?._id === addedProduct?.product?._id
                    ? {...item, productQuantity: item?.productQuantity + addedProduct?.productQuantity}
                    : item
                )  
                : [...cart.cartProducts, addedProduct],
                total: cart.cartProducts.length > 0 ? cart.cartProducts.map(item => item?.product?.price*item?.productQuantity).reduce((a,b) => a + b) : 0
            }
            try {
                const res = await axiosInstance.put(`/api/carts/${cart._id}`, editedCart)
                dispatch(getUserCart({
                    ...res.data, 
                    quantity: res.data.cartProducts.map((item: CartProduct) => item?.productQuantity).reduce((a:number,b:number) => a + b),
                    total: res.data.cartProducts.map((item: CartProduct) => item?.product?.price*item?.productQuantity).reduce((a:number,b:number) => a + b) 
                })) 
            } catch (error) {
                console.log(error)
            }
        }
    }

    
return (
<div className='App'>
<div>
    {(!user || !user.isAdmin ) && <Navbar/>}
    {(user && !user.verified) && <ActivateAccount/>}
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className='product-wrapper'>
        <div className='product-info'>
            <h1 className='product-title'>{product?.title} </h1>
            <img src={`/images/${productImage?.path}`} className='product-image'/>
            <span className='product-price'>{product?.price}$</span>
            <p className='product-description'>{product?.description}</p>
        </div>
        {user && user.verified && !user.isAdmin && product?.inStock &&
        <div className='product-amount'>
        <div className='amount'>
            <div className='set-amount' onClick={() => productNumber > 1 && setProductNumber(productNumber - 1)}><RemoveIcon/></div>
                <span className='amount-number'>{productNumber}</span>
                <div className='set-amount' onClick={() => setProductNumber(productNumber + 1)}><AddIcon/></div>
            </div>
            <button 
            className='amount-btn' 
            onClick={() => {
            editCart({product, productQuantity: productNumber }); 
            setProductNumber(1)
            }
            }>Add to cart</button>
        </div>
        }
    </div>
    {(!user || !user.isAdmin ) && <Footer/>}
</div>
</div>
)}

export default Product