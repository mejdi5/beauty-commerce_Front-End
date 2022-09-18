import React,{useEffect} from 'react'
import './Orders.css'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate, Link} from 'react-router-dom'
import { useTypedSelector, useTypedDispatch } from '../../Redux/Hooks'
import {  OrderType, getOrders } from '../../Redux/orderSlice';
import { UserType } from '../../Redux/userSlice';
import { axiosInstance } from '../../axiosInstance';


const Orders : React.FC = () => {

    const navigate = useNavigate()
    const orders = useTypedSelector<OrderType[] | null>(state => state.orderSlice.orders)
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const dispatch = useTypedDispatch()

    useEffect(() => {
    const fetchOrders = async() => {
    if ((user && user?.verified)) {
        try {
            const res = await axiosInstance.get(`/api/orders/${user?._id}`)
            dispatch(getOrders(res.data))
        } catch (error) {
            console.log(error)
        }
    }}
    (user && user?.verified) && fetchOrders()
    }, [orders])
    

return (
<div className="App">
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="container-fluid">
    <h1 className='order-title'>All Orders</h1>
    {orders && orders.length > 0
    ?
    orders?.map(order => 
        <ul className="list-group" key={order?._id}>
            <Link to={`/order/${order?._id}`}>
            <li className="list-group-item">
                <p>Products: {order.products.length > 0 && order?.products?.map(product => product.productQuantity)?.reduce((a,b) => a + b)}</p>
                <p>{order?.address}</p>
                <p>{order?.amount}$</p>
                <p>{order?.createdAt.substr(0, 10)}</p>
                <p>{order?.status === 'paid' ? 'Paid' : 'Unpaid'}</p>
            </li>
            </Link>
        </ul>
    ):
    <div>You have no orders</div>
    }
</div>
</div>

)
}

export default Orders