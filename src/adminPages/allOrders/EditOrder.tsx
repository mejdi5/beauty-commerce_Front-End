import React,{FormEvent, useState, useEffect} from 'react'
import "./AllOrders"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { useTypedSelector } from '../../Redux/Hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { OrderType } from '../../Redux/orderSlice';
import { axiosInstance } from '../../axiosInstance'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import OrderModal from './OrderModal'

const EditOrder: React.FC = () => {

    const orders = useTypedSelector<OrderType[] | never[]>(state => state.orderSlice.orders)
    const orderId = useParams().orderId
    const orderToEdit = orders && orders.find((order: OrderType) => order?._id === orderId)

    const [orderProducts, setOrderProducts] = useState(orderToEdit?.products || [])
    const [address, setAddress] = useState(orderToEdit?.address || '')
    const [amount, setAmount] = useState(orderToEdit?.amount || 0)
    const [status, setStatus] = useState(orderToEdit?.status || '')
    const navigate = useNavigate() 
    const [msg, setMsg] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false);

    const handleEditOrder = async (e: FormEvent) => {
        e.preventDefault();
        const editedOrder = {
            products: orderProducts,
            amount,
            address,
            status
        }
        try {
            const res = await axiosInstance.put(`/api/orders/${orderId}`, editedOrder)
            setMsg(res.data.msg)
            setTimeout(() => navigate(-1), 1500)
        } catch (error) {
            console.log(error)
        }
    }

    const editOrderProductQuantity = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        setOrderProducts(prev => prev.map((orderProduct: any) => 
            orderProduct.product._id === id 
            ? {...orderProduct, productQuantity: Number(e?.target?.value)}
            : orderProduct
        ))
    }

    const deleteProductFromOrder = (id: string) => {
        setOrderProducts(prev => prev.filter((orderProduct: any) => orderProduct.product._id !== id))
    }

    useEffect(() => {
        setAmount(orderProducts.map(item => item.productQuantity*item.product.price).reduce((a,b) => a + b))
    }, [orderProducts])
    

return (
<div className="edit-order">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="edit-order-container edit">
        {msg && <div className='edit-order-msg'>{msg}</div>}
        <div className="form-group edit-order-form-group">
            <label className="form-group edit-order-label">Address</label>
            <input 
            type="text" 
            className="form-control edit-order-input"  
            value={address}
            onChange={e => setAddress(e.target.value)}
            />
        </div>
        <div className="form-group edit-order-form-group">
            <label className="form-group edit-order-label">Amount</label>
            <input 
            type="text" 
            className="form-control edit-order-input"  
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            />
        </div>
        <div className="form-group edit-order-form-group">
            <label className="form-group edit-order-label">Status</label>
            <input 
            type="text" 
            className="form-control edit-order-input"  
            value={status}
            onChange={e => setStatus(e.target.value)}
            />
        </div>
        <div className="form-group edit-order-form-group">
            <label className="form-group edit-order-products-label">Products</label>
            <div className='edit-order-products-wrapper'>
                {orderProducts.map(item => 
                <div key={item?.product?._id} className="form-control edit-order-products">
                    <input 
                    type="number" 
                    value={item?.productQuantity}
                    min="1"
                    onChange={e => item?.product?._id && editOrderProductQuantity(e, item?.product?._id)}
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
                    onClick={() => item?.product?._id && deleteProductFromOrder(item?.product?._id)}
                    />
                </div>
                )}
            </div>
            <div className='add-product-to-order' onClick={() => setShowModal(true)}>
                <AddIcon/>
                <OrderModal
                showModal={showModal}
                setShowModal={setShowModal}
                orderProducts={orderProducts}
                setOrderProducts={setOrderProducts}
                />
            </div>
        </div>
        
        <button 
        type="submit" 
        className="btn btn-warning"
        onClick={e => handleEditOrder(e)}
        >Save</button>
    </div>
</div>
)}

export default EditOrder