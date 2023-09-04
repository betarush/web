import './register.scss';
import { useEffect, useState } from 'react';
import { register } from '../../apis/user'

export default function Register() {
	const [email, setEmail] = useState('djdksf@gmail.com')
	const [password, setPassword] = useState('asdfghj')
	const [confirmPassword, setConfirmpassword] = useState('asdfghj')
	const [errorMsg, setErrormsg] = useState('')

	const theRegister = () => {
		if (email && password && confirmPassword) {
			if (email.includes("@")) {
				if (password.length > 6 && password == confirmPassword) {
					const data = { email, password }

					register(data)
						.then((res) => {
							if (res.status == 200) {
								return res.json()
							}

							throw res
						})
						.then((res) => {
							if (res) {
								localStorage.setItem("id", res.id)

								window.location = "/main"
							}
						})
						.catch((err) => {
							if (err.status == 400) {
								err.json().then(() => {
									
								})
							}
						})
				} else {
					if (password.length <= 6) {
						setErrormsg("Password needs to be more than 6 characters")
					} else {
						setErrormsg("Confirm password doesn't match")
					}
				}
			} else {
				setErrormsg("You entered an invalid e-mail")
			}
		} else {
			if (!email) {
				setErrormsg("Please enter an e-mail")
			} else if (!password) {
				setErrormsg("Please enter a password")
			} else {
				setErrormsg("Please confirm your password")
			}
		}
	}

	return (
		<div id="register">
			<div id="form">
				<div id="header">Register</div>

				<div className="form-input">
					<div className="input-header">Enter an e-mail:</div>
					<input class="input" placeholder="Your e-mail" type="email" onChange={e => setEmail(e.target.value)} value={email}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter a password:</div>
					<input class="input" placeholder="Enter a password" type="password" onChange={e => setPassword(e.target.value)} value={password}/>
				</div>
				<div className="form-input">
					<div className="input-header">Confirm your password:</div>
					<input class="input" placeholder="Confirm password" type="password" onChange={e => setConfirmpassword(e.target.value)} value={confirmPassword}/>
				</div>

				<div id="errormsg">{errorMsg}</div>

				<div id="submit" onClick={() => theRegister()}>Register</div>
			</div>
		</div>
	)
}