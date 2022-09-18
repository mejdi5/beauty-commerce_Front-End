import React, {useEffect, useState, FormEvent} from 'react'
import "./Profile.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import { logoutUser, UserType } from '../../Redux/userSlice';
import { axiosInstance } from '../../axiosInstance';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Navbar from '../../components/navbar/Navbar'
import {Button} from 'reactstrap'
import { getImage, ImageType } from '../../Redux/imageSlice';
import CloseIcon from '@mui/icons-material/Close';



const Profile: React.FC = () => {

    const currentUser = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const image = useTypedSelector<ImageType | null>(state => state.imageSlice.image)
    const [picture, setPicture] = useState<any>(null)
    const dispatch = useTypedDispatch()
    const [msg, setMsg] = useState<string | null>(null)
    const [deleteImageMsg, setDeleteImageMsg] = useState<string | null>(null)
    const navigate = useNavigate()

    const userId = useParams().userId
    const user = users && users.find((user: UserType) => user?._id === userId)


    const handleDeleteUser = async (id: string) => {
    try {
        const res = await axiosInstance.delete(`/api/users/${id}`)
        setMsg(res.data.msg)
        setTimeout(() =>  dispatch(logoutUser()), 2000)
    } catch (error) {
        console.log(error.message)
    }
};

    //post new image
    const uploadImage = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData()
            formData.append('picture', picture)
            const response = await axiosInstance.post(`/api/images/upload/${userId}`, formData)
            response.data.savedImage && dispatch(getImage(response.data.savedImage))
        } catch (error) {
            console.log(error)
        }
    }

    //delete Image
    const deleteImage = async (id: string) => {
        
        try {
            const res = await axiosInstance.delete(`/api/images/delete/${id}`)
            dispatch(getImage(null))
            setDeleteImageMsg(res.data.msg)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
    const fetchImage = async () => {
        try {
            const res = await axiosInstance.get(`/api/images/${userId}`)
            dispatch(getImage(res.data))
        } catch (error) {
            console.log(error)
        }
    }
    userId === user?._id && fetchImage()
    }, [])
    


    useEffect(() => {
    if (!currentUser?.isAdmin) {
        user?._id !== currentUser?._id && navigate('/')
    }
    }, [user, currentUser])


return (
<div className='App'>
{currentUser && !currentUser?.isAdmin && <Navbar/>}
<div className="profile">
    {currentUser && currentUser?.isAdmin && <Sidebar/>}
    {currentUser && !currentUser?.isAdmin && <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>}
<div className="profile-container">
    {msg && <div className='user-delete-msg'>{msg}</div>}
    <div className="profile-wrapper">
        <div className='profile-image-wrapper'>
            {deleteImageMsg && <div className='deleteImageMsg'>{deleteImageMsg}</div>}
            <img 
            className="profile-image"
            src={ image ? `/images/${image.path}` : "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"} 
            />
            <input 
            type="file"
            className={picture ? 'profile-image-file-input no-display' : 'profile-image-file-input'}   
            onChange={e => e.target.files && setPicture(e.target.files[0])}
            />
            {picture && 
            <Button 
            className='upload-btn'
            onClick={e => uploadImage(e)}
            >Click To Upload</Button>
            }
        </div>
        {image &&
        <CloseIcon 
        className='user-image-delete'
        onClick={() => image?._id && deleteImage(image?._id)}
        />
        }
        <div className='profile-info'>
            <div className='profile-info-item'>
                <span>First Name:</span><h6>{user?.firstName}</h6>
            </div>
            <div className='profile-info-item'>
                <span>Last Name:</span><h6>{user?.lastName}</h6>
            </div>
            <div className='profile-info-item'>
                <span>Email:</span><h6>{user?.email}</h6>
            </div>
            {user && user?.isAdmin && 
            <div className='profile-info-item'>
                <span>Status:</span><h6>{user?.isAdmin && "Admin"}</h6>
            </div>
            }
        </div>
        {currentUser?._id === user?._id &&
        <div className='profile-icons'>
            <Link to={user?.isAdmin ? `/user/${user?._id}` : `/edit-profile/${user?._id}`}><EditIcon color="success" className='profile-icon'/></Link>
            <DeleteIcon color="action" className='profile-icon' onClick={() => user?._id && handleDeleteUser(user?._id)}/>
        </div>
        }
    </div>
</div>
</div>
</div>
)}

export default Profile