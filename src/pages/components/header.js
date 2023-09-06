import './header.scss';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../apis/user'

export default function Header() {
	const [username, setUsername] = useState('')
	const [earnings, setEarnings] = useState(0.0)
	const [numRejected, setNumrejected] = useState(0)

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
					setEarnings(res.earnings)
					setNumrejected(res.rejectedReasons)
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
				<div className="column"><div id="username">Your are <strong>{username}</strong></div></div>
				<div className="page-navs">
					<div className="column"><div className="page-nav" onClick={() => window.location = "/main"}>Products</div></div>
					{numRejected > 0 && <div className="column"><div className="page-nav" onClick={() => window.location = "/rejections"}>Rejections</div></div>}
					<div className="column"><div className="page-nav" onClick={() => window.location = "/earnings"}>Withdraw: ${earnings.toFixed(2)}</div></div>
					<div className="column"><div className="page-nav" onClick={() => window.location = "/listproduct"}>Submit your product</div></div>
					<div className="column"><div className="page-nav" onClick={() => window.location = "/payment"}>Payment</div></div>
					<div className="column"><div className="page-nav" onClick={() => logout()}>Log-Out</div></div>
				</div>
			</div>
		</div>
	)
}