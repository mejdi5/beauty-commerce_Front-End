import React,{FormEvent, useState} from 'react'
import "./Profile.css"
import {  useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { getOneUser, UserType } from '../../Redux/userSlice';
import { axiosInstance } from '../../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';


const EditProfile: React.FC = () => {

    const users = useTypedSelector<UserType[] | never[]>(state => state.userSlice.users)
    const userId = useParams().userId
    const userToEdit = users && users.find((user: UserType) => user?._id === userId)
    const dispatch = useTypedDispatch()

    const [firstName, setFirstName] = useState(userToEdit?.firstName)
    const [lastName, setLastName] = useState(userToEdit?.lastName)
    const [email, setEmail] = useState(userToEdit?.email)
    const navigate = useNavigate()
    const [msg, setMsg] = useState<string | null>(null)

    const handleEditUser = async (e: FormEvent) => {
        e.preventDefault();
        const editedUser = {firstName, lastName, email}
        try {
            const res = await axiosInstance.put(`/api/users/${userId}`, editedUser)
            setMsg("Profile edited..")
            dispatch(getOneUser(res.data.editedUser))
            setTimeout(() => navigate('/'), 1500)
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
    }


return (
<div className="add-edit-user">
    <div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
    <div className="edit-user-container">
        {msg && <div className='edit-user-msg'>{msg}</div>}
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">First Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input"  
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Last Name</label>
            <input 
            type="text" 
            className="form-control add-edit-user-input" 
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            />
        </div>
        <div className="form-group add-edit-user-form-group">
            <label className="form-group add-edit-user-label">Email Address</label>
            <input 
            type="email" 
            className="form-control add-edit-user-input" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
        </div>
        <button 
        type="submit" 
        className="btn btn-primary"
        onClick={e => handleEditUser(e)}
        >Save</button>
    </div>
</div>
)}

export default EditProfile