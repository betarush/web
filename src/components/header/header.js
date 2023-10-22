import './header.scss';
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserInfo } from '../../apis/user'

// material ui components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Products', 'Rejections', 'Withdraw'];
const fullWidth = window.innerWidth * 0.8

export default function Header() {
	const [username, setUsername] = useState('')
	const [earnings, setEarnings] = useState(0.0)
	const [numRejected, setNumrejected] = useState(0)
	const [firstTime, setFirsttime] = useState(false)
	const [isCreator, setIscreator] = useState(false)

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
					setFirsttime(res.firstTime)
					setIscreator(res.isCreator)
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
			<div id="header-row">
				<div id="logo" onClick={() => window.location = "/"}>
	    		<img src="/logo.png"/>
	    	</div>

	    	<div className="column">
		      <div id="navs">
		      	{firstTime == false && (
		      		<>
		            <div className="nav" onClick={() => window.location = "/main"} sx={{ my: 2, color: 'black' }}>Products</div>
		            <div className="nav" onClick={() => window.location = "/rejections"} sx={{ my: 2, color: 'black' }}>Rejections</div>
		            <div className="nav" onClick={() => window.location = "/earnings"} sx={{ my: 2, color: 'black' }}>Withdraw reward<br/>${earnings.toFixed(2)}</div>
		            <div className="nav" onClick={() => window.location = "/listproduct"} sx={{ my: 2, color: 'black' }}>Submit your product</div>
		            {isCreator == true && <div className="nav" onClick={() => window.location = "/seefeedbacks"} sx={{ my: 2, color: 'black' }}>See Feedbacks</div>}
		          </>
		      	)}
		        	
		        <div className="nav" onClick={() => logout()} sx={{ my: 2, color: 'black', display: 'block' }}>Log-Out</div>
		      </div>
		    </div>

	      <div className="column"><div id="user">You are {username}</div></div>
	    </div>
	  </div>
	)
}