import { useEffect, useState, Fragment, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../axiosInstance";
import "./PasswordReset.css";
import { useNavigate } from 'react-router-dom';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const PasswordReset = () => {

	const [validUrl, setValidUrl] = useState(false);
	const [password, setPassword] = useState("");
	const [msg, setMsg] = useState("");
	const [error, setError] = useState("");
	const {id, token} = useParams();
	const navigate = useNavigate()

	useEffect(() => {
		const verifyUrl = async () => {
			try {
				const res = await axiosInstance.get(`/api/forgot-password/password-reset/${id}/${token}`);
				console.log('msg', res.data.msg)
				setValidUrl(true)
			} catch (error) {
				console.log(error.message)
				setValidUrl(false)
			}
		};
		verifyUrl();
	}, [id, token]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			const res = await axiosInstance.post(`/api/forgot-password/password-reset/${id}/${token}`, { password });
			setMsg(res.data.message);
			setError("");
			navigate("/login");
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
				setMsg("");
			}
		}
	};

return (
	<Fragment>
		<div className='back' onClick={() => navigate(-1)}><ArrowCircleLeftIcon/></div>
		{validUrl ? (
				<div className="passord-reset-container">
					<form className="passord-reset-form_container" onSubmit={handleSubmit}>
						<h1>New Password</h1>
						<input
							type="password"
							placeholder="Type Password.."
							name="password"
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
							className="passord-reset-input"
						/>
						{error && <div className="passord-reset-error_msg">{error}</div>}
						{msg && <div className="passord-reset-success_msg">{msg}</div>}
						<button type="submit" className="passord-reset-btn">
							Submit
						</button>
					</form>
				</div>
        ) : (
			<h1 className="not-found">404 Not Found</h1>
		)}
	</Fragment>
)};

export default PasswordReset;