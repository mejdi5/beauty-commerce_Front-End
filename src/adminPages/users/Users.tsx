import React, {useEffect, useState} from 'react'
import "./Users.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { DataGrid } from '@mui/x-data-grid';
import { getAllUsers, UserType } from '../../Redux/userSlice';
import { getOrders } from '../../Redux/orderSlice'
import { OrderType } from '../../Redux/orderSlice';
import axios from 'axios'
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { ImageType } from '../../Redux/imageSlice';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import AirplanemodeInactiveIcon from '@mui/icons-material/AirplanemodeInactive';

const Users: React.FC = () => {

  const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
  const images = useTypedSelector<ImageType[] | never[]>(state => state.imageSlice.images)
  const orders = useTypedSelector<OrderType[] | never[]>(state => state.orderSlice.orders)
  const dispatch = useTypedDispatch()
  const [msg, setMsg] = useState<string | null>(null)
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));


  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/users/${id}`)
      setMsg(res.data.msg)
    } catch (error) {
      console.log(error.message)
    }
  };

  const columns = [
    { field: "id", 
      headerName: "CUSTOMER ID", 
      width: 250 },
    {
      field: "name",
      headerName: "CUSTOMER NAME",
      width: 280,
      renderCell: (params: any) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.image} alt="" />
            {params.row.name.toUpperCase()}
          </div>
        );
      },
    },
    { field: "email", 
      headerName: "EMAIL",
      width: 270 
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 120,
      renderCell: (params: any) => {
        if(orders.some((order: OrderType) => order.userId === params.row.id && new Date(order.createdAt) > lastMonth)) {
        return (
          <div className='user-activity'>
            <div className='user-activity-icon'><AirplanemodeActiveIcon color="success"/></div>
            <div>Active</div>
          </div>
        )} else {
          return (
            <div className='user-activity'>
              <div className='user-activity-icon'><AirplanemodeInactiveIcon color="warning"/></div>
              <div>Inactive</div>
            </div>
          )
        }
      },
    },
    {
      field: "transaction",
      headerName: "TRANSACTION",
      width: 160,
    },
    {
      field: "action",
      headerName: "ACTION",
      width: 150,
      renderCell: (params: any) => {
        return (
          <div className='user-action'>
            <Link to={`/user/${params.row.id}`}>
              <EditIcon className="user-edit" color="primary"/>
            </Link>
            <DeleteIcon
              className="user-delete"
              color="action"
              onClick={() => handleDelete(params.row.id)}
            />
          </div>
        );
      },
    },
  ];


  useEffect(() => {
    const getUsers = async () => {
        try {
        const res = await axios.get("/api/users"); 
        dispatch(getAllUsers(res.data));
        } catch (error) {
            console.log(error)
        }
    };
    const getUsersOrders = async () => {
      try {
          const res = await axios.get("/api/orders");
          dispatch(getOrders(res.data));
      } catch (error) {
          console.log(error)
      }
      };
    getUsersOrders();
    getUsers();
    }, [users, orders]);

    console.log('users', users)

    const userRows = users.filter((user: any) => !user.isAdmin).map((user: any) => {
      const userImage = images.find((img: ImageType) => img?.userId === user?._id)
      return {
      id: user._id,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      image: userImage ? `/images/${userImage?.path}` : "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif",
      status:  user?.status,
      transaction: orders.some((order: OrderType) => order.userId === user._id)
      ? `${orders.filter((order: OrderType) => order.userId === user._id).map(order => order.amount)?.reduce((a,b) => a + b)}$`
      : ''
}})

return (
<div className="users">
    <Sidebar/>
    <div className="users-container">
      <Link to="/newUser">
        <div>
          <AddIcon className="user-new"/>
        </div>
      </Link>
      {msg && <div className='user-delete-msg'>{msg}</div>}
      {userRows.length > 0
        ?
        <DataGrid
        rows={userRows}
        columns={columns}
        />
        :
        <div className='no-users'>No Users</div>
        }
    </div>
</div>
)}

export default Users