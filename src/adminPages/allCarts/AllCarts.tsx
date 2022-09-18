import React, {useEffect, useState} from 'react'
import "./AllCarts.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { DataGrid } from '@mui/x-data-grid';
import { UserType } from '../../Redux/userSlice';
import { CartType, getCarts } from '../../Redux/cartSlice';
import { axiosInstance } from '../../axiosInstance';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { ImageType } from '../../Redux/imageSlice';
import AddIcon from '@mui/icons-material/Add';


const AllCarts: React.FC = () => {

    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const images = useTypedSelector<ImageType[] | never[]>(state => state.imageSlice.images)
    const carts = useTypedSelector<CartType[] | never[]>(state => state.cartSlice.carts)
    const dispatch = useTypedDispatch()
    const [msg, setMsg] = useState<string | null>(null)


    const columns = [
        { field: "id", 
            headerName: "CART ID", 
            width: 220 },
        {
            field: "name",
            headerName: "CUSTOMER",
            width: 220,
            renderCell: (params: any) => {
            return (
                <div className="cartUser">
                    <img className="cartUserImg" src={params.row.image} alt="" />
                    {params.row.name}
                </div>
            );
            },
        },
        {
        field: "quantity",
        headerName: "QUANTITY",
        width: 400,
        },
        {
        field: "total",
        headerName: "TOTAL",
        width: 120,
        },
        {
        field: "action",
        headerName: "ACTION",
        width: 150,
        renderCell: (params: any) => {
            return (
                <div className='cart-action'>
                    <Link to={`/edit-cart/${params.row.id}`}>
                        <EditIcon className="cart-icon" color="primary"/>
                    </Link>
                    {params.row.quantity !== 0 &&
                    <Link to={`/cart/${params.row.id}`}>
                        <VisibilityIcon
                        color="secondary"
                        className="cart-icon"
                        />
                    </Link>
                    }
                    <DeleteIcon
                    className="cart-icon"
                    color="action"
                    onClick={() => handleDeleteCart(params.row.id)}
                    />
                </div>
            );
        },
        },
    ];
    
    
    const cartRows = carts && Array.isArray(carts) && carts.length > 0 && carts.map((cart: CartType) => {
        const cartUser = users.find((user: UserType) => user._id === cart.userId)
        const userCartImage = images.find((img: ImageType) => img?.userId === cartUser?._id)
        return {
        id: cart._id,
        name: cartUser &&  cartUser.firstName.toUpperCase() + ' ' + cartUser.lastName?.toUpperCase() || "This user is deleted",
        image: userCartImage ? `/images/${userCartImage?.path}` : "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif",
        total: `${cart?.total}$`,
        quantity: cart?.quantity,
    }})

    const handleDeleteCart = async (id: string) => {
        try {
            const res = await axiosInstance.delete(`/api/carts/${id}`)
            setMsg(res.data.msg)
        } catch (error) {
            console.log(error.message)
        }
    };


    useEffect(() => {
        const getAllCarts = async () => {
            try {
                const res = await axiosInstance.get("/api/carts");
                dispatch(getCarts(res.data));
            } catch (error) {
                console.log(error.message)
            }
        };
        getAllCarts();
    }, [carts]);
    
return (
<div className="allCarts">
    <Sidebar/>
    <div className="allCarts-container"> 
        <Link to="/newCart">
            <div>
                <AddIcon className="cart-new"/>
            </div>
        </Link>  
    {msg && <div className='cart-delete-msg'>{msg}</div>}
    {cartRows && Array.isArray(cartRows) && cartRows?.length > 0
        ?
        <DataGrid
        rows={cartRows}
        columns={columns}
        />
        :
        <div className='no-carts'>No Carts</div>
    }
    </div>
</div>
)}

export default AllCarts 