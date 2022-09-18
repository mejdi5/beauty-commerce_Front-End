import React,{FormEvent, useState} from 'react'
import "./Users.css"
import Sidebar from '../../adminComponents/sidebar/Sidebar'
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import {getImage, ImageType} from '../../Redux/imageSlice'

const AddUser: React.FC = () => {

    const image = useTypedSelector<ImageType | null>(state => state.imageSlice.image)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [picture, setPicture] = useState<any>(null)
    const [msg, setMsg] = useState<string | null>(null)
    const dispatch = useTypedDispatch()
    const navigate = useNavigate() 

    const uploadImage = async (e: FormEvent, id: string) => {
        e.preventDefault();
        try {
            const formData = new FormData()
            formData.append('picture', picture)
            const res = await axios.post(`/api/images/upload/${id}`, formData)
            dispatch(getImage(res.data.path))
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddUser = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const newUser = {firstName, lastName, email, password, isAdmin}
            const res = await axios.post(`/api/users`, newUser)
            picture && uploadImage(e, res.data.savedUser._id);
            setMsg(res.data.msg)
        } catch (error) {
            const errors = error?.response?.data?.errors;
            const errorMsg = error?.response?.data?.msg;
            if (Array.isArray(errors)) {
                errors.forEach((err) => alert(err.msg));
            }
            if (errorMsg) {
                alert(errorMsg);
            }
        }
        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')
        setIsAdmin(false)
        setTimeout(() => navigate(-1), 2000)
    }
    

return (
<div className="add-edit-user">
    <Sidebar/>
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="add-user-container">
        {msg && <div className='add-user-msg'>{msg}</div>}
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">First Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            placeholder="Enter First Name.." 
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Last Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            placeholder="Enter Last Name.." 
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Email Address</label>
            <input 
            type="email" 
            className="form-control add-edit-user-input" 
            placeholder="Enter Email.." 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Password</label>
            <input 
            type="password" 
            className="form-control add-edit-user-input"
            placeholder="Enter Password.."  
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Image</label>
            <input 
            type="file" 
            className="form-control add-edit-user-input" 
            onChange={e => e.target.files && setPicture(e.target.files[0])}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Admin ?</label>
            <input 
            type="checkbox" 
            checked={isAdmin}
            onChange={() => setIsAdmin(!isAdmin)}
            />
        </div>
        <button 
        type="submit" 
        className="btn btn-success"
        onClick={e => handleAddUser(e)}
        >Submit</button>
    </div>
</div>
)}

export default AddUser