import './header.scss';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../apis/user'

export default function Header() {
	const [username, setUsername] = useState('')

	const getTheUserInfo = () => {
		const data = { userId: localStorage.getItem("id") }

		getUserInfo(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setUsername(res.username)
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const logout = () => {
		localStorage.clear()

		window.location = "/login"
	}

	useEffect(() => {
		getTheUserInfo()
	}, [])

	return (
		<div id="header">
			<div id="navs">
				<div className="page-navs">
					<div className="column"><div className="page-nav">Privacy</div></div>
					<div className="column"><div className="page-nav">Terms</div></div>
				</div>
				<div className="column"><div id="username">Your are <strong>{username}</strong></div></div>
				<div className="page-navs">
					<div className="column"><div className="page-nav" onClick={() => window.location = "/main"}>Products</div></div>
					<div className="column"><div className="page-nav" onClick={() => window.location = "/earnings"}>You earned: $15.90</div></div>
					<div className="column"><div className="page-nav" onClick={() => window.location = "/listproduct"}>List your product</div></div>
					<div className="column"><div className="page-nav" onClick={() => window.location = "/payment"}>Payment</div></div>
					<div className="column"><div className="page-nav" onClick={() => logout()}>Log-Out</div></div>
				</div>
			</div>
		</div>
	)
}