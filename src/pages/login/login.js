import './login.scss';
import { useEffect, useState } from 'react';
import { login } from '../../apis/user'

export default function Login() {
	const [email, setEmail] = useState('kevin@gmail.com')
	const [password, setPassword] = useState('qqqqqqq')
	const [errorMsg, setErrormsg] = useState('')

	const theLogin = () => {
		if (email && password) {
			const data = { email, password }

			login(data)
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
			if (!email) {
				setErrormsg("Enter your e-mail")
			} else if (!password) {
				setErrormsg("Enter your password")
			}
		}
	}

	return (
		<div id="register">
			<div className="row">
				<div id="page-navs">
					<div className="column"><div className="page-nav" onClick={() => window.location = "/register"}>Register</div></div>
					<div className="column"><div className="page-nav">Privacy</div></div>
					<div className="column"><div className="page-nav">Terms</div></div>
				</div>
			</div>

			<div id="form">
				<div id="header">Login</div>

				<div className="form-input">
					<div className="input-header">Enter an e-mail:</div>
					<input class="input" placeholder="Your e-mail" type="email" onChange={e => setEmail(e.target.value)} value={email}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter a password:</div>
					<input class="input" placeholder="Enter a password" type="password" onChange={e => setPassword(e.target.value)} value={password}/>
				</div>

				<div id="errormsg">{errorMsg}</div>

				<div id="submit" onClick={() => theLogin()}>Login</div>
			</div>
		</div>
	)
}