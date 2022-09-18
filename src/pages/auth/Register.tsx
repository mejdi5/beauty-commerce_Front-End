import React, {FormEvent, useState, useEffect} from 'react'
import './Auth.css'
import { useTypedDispatch, useTypedSelector } from '../../Redux/Hooks'
import { authStart, registerSuccess, authFailure, UserType } from '../../Redux/userSlice'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axiosInstance';


const Register : React.FC = () => {

    const [isChecked, setIsChecked] = useState(false)
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const dispatch = useTypedDispatch()
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmedPassword, setConfirmedPassword] = useState<string>("");
    const [isMatch, setIsMatch] = useState<Boolean>(false);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
            dispatch(authStart())
            try {
                const newUser = { firstName, lastName, email, password };
                const res = await axiosInstance.post(`/api/auth/register`, newUser)
                console.log('activation url',res.data.url)
                dispatch(registerSuccess(res.data))
                navigate(`/`);
            } catch (error: any) {
                const errors = error?.response?.data?.errors;
                const msg = error?.response?.data?.msg;
                if (Array.isArray(errors)) {
                    errors.forEach((err) => alert(err.msg));
                }
                if (msg) {
                    alert(msg);
                }
                dispatch(authFailure())
            }
            setEmail('')
            setFirstName('')
            setLastName('')
            setPassword('')
            setConfirmedPassword('')
    }

    useEffect(() => {
        password === confirmedPassword 
        ? setIsMatch(true)
        : setIsMatch(false)
    }, [password, confirmedPassword])
    

return (
<div>
<div className='back' style={{position: 'absolute'}} onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
<div className='register-container'>
    <h1>Sign Up</h1>
    <div className='register-wrapper'>
        <div className="mb-3">
            <label className="form-label">First Name <span className='required'>*</span></label>
            <input 
            type="text" 
            className="form-control"
            placeholder="First Name.."
            required
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input 
            type="text" 
            className="form-control" 
            placeholder="Last Name.."
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Email address <span className='required'>*</span></label>
            <input 
            type="email" 
            className="form-control" 
            placeholder="name@example.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Password <span className='required'>*</span></label>
            <input 
            type="password" 
            className="form-control" 
            placeholder="Password.."
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            />
        </div>
        <div className="mb-3">
            <label className="form-label">Confirm Password <span className='required'>*</span></label>
            <input 
            type="password" 
            className="form-control" 
            placeholder="Retype Password.."
            required
            value={confirmedPassword}
            onChange={e => setConfirmedPassword(e.target.value)}
            />
            <p className={isMatch ? "match" : "notMatch"}>{isMatch ? "Password matched" : "Password does not match"}</p>
        </div>
        <div className='register-agreement'>
            <input 
            className="form-check-input register-agreement-checkbox" 
            type="checkbox" 
            onChange={() => setIsChecked(!isChecked)}
            />
            <span className='register-agreement-text'>I accept the processing of my personal data and privacy policy</span>
        </div>
        <button 
        className='register-btn'
        disabled={!isChecked || !isMatch || firstName === "" || email === "" || password === ""}
        onClick={e => handleRegister(e)}
        >Submit</button>
    </div>
</div>
</div>
)}

export default Register