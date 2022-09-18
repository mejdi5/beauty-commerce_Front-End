import { FormEvent, useState } from "react";
import { axiosInstance } from "../../../axiosInstance";
import "./ForgotPassword.css";
import { useNavigate } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';


const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate()

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const res  = await axiosInstance.post(`/api/forgot-password/password-reset`, { email });
			setMessage(res.data.message);
			console.log('url',res.data.url)
		} catch (error) {
			const errors = error?.response?.data?.errors;
            const msg = error?.response?.data?.msg;
            if (Array.isArray(errors)) {
                errors.forEach((err) => alert(err.msg));
            }
            if (msg) {
                alert(msg);
            }
		}
	};

return (
<div>
	<div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
		<div className="forgotPassword-container">
			<form className="forgotPassword-form_container" onSubmit={handleSubmit}>
				<h1>Your Email</h1>
				<input
					type="email"
					placeholder="Type Email.."
					name="email"
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					required
					className="forgotPassword-input"
				/>
				{message && <div className="forgotPassword-success_msg">{message}</div>}
				<button type="submit" className="forgotPassword-btn">
					Submit
				</button>
			</form>
		</div>
</div>
)};

export default ForgotPassword;