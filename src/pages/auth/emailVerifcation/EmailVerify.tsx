import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../../../axiosInstance";
import "./EmailVerify.css";
import { getVerifiedUser } from "../../../Redux/userSlice";
import { useTypedDispatch, useTypedSelector } from '../../../Redux/Hooks'
import { UserType } from "../../../Redux/userSlice";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { useNavigate } from 'react-router-dom';


const EmailVerify = () => {

	const param = useParams();
    const dispatch = useTypedDispatch()
    const user = useTypedSelector<UserType | null>(state => state.userSlice.user)
    const navigate = useNavigate()

	useEffect(() => {
		const verifyEmailUrl = async () => {
			try {
				const res = await axiosInstance.get(`/api/auth/verify/${param.id}/${param.token}`);
				console.log(param)
                dispatch(getVerifiedUser(res.data.user))
			} catch (error) {
				console.log(error, "Account not verified");
			}
		};
		!user?.verified && verifyEmailUrl();
	}, [param]);


	return (
		<div className="App">
            <div className='back' onClick={() => navigate('/')}><ArrowCircleLeftIcon/></div>
			<div className="container">
				<img src="/activationSuccess.png" alt="success_img" className="success_img" />
				<h1>Email verified successfully</h1>
			</div>
		</div>
	);
};

export default EmailVerify;