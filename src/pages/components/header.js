import './header.scss';
import { useEffect, useState } from 'react';

export default function Header(props) {
	const { username } = props

	const logout = () => {
		localStorage.clear()

		window.location = "/login"
	}

	return (
		<div id="header">
			<div id="navs">
				<div className="page-navs">
					<div className="column"><div className="page-nav">Privacy</div></div>
					<div className="column"><div className="page-nav">Terms</div></div>
				</div>
				<div className="column"><div id="username">Your are <strong>{username}</strong></div></div>
				<div className="page-navs">
					<div className="column"><div className="page-nav">You earned: $15.90</div></div>
					<div className="column"><div className="page-nav" onClick={() => window.location = "/listproduct"}>List your product</div></div>
					<div className="column"><div className="page-nav" onClick={() => logout()}>Log-Out</div></div>
				</div>
			</div>
		</div>
	)
}