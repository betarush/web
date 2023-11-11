import './header.scss'
import { useEffect, useState } from 'react';
import { AiOutlineCodeSandbox, AiFillDollarCircle } from "react-icons/ai";
import { FaRegFaceFrownOpen } from "react-icons/fa6";
import { VscFeedback } from "react-icons/vsc";
import { HiRocketLaunch } from "react-icons/hi2";
import { BsDoorOpen } from "react-icons/bs";
import { FcRating } from "react-icons/fc";
import { MdPending } from "react-icons/md";
import { getUserInfo } from '../../../apis/user'

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

export default function Header(props) {
	const [username, setUsername] = useState('')
	const [earnings, setEarnings] = useState(0.0)
	const [amountPending, setAmountpending] = useState(0.0)
	const [numAdvices, setNumadvices] = useState(0)
	const [firstTime, setFirsttime] = useState(false)
	const [isCreator, setIscreator] = useState(false)
	const [banned, setBanned] = useState(false)

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
					setAmountpending(res.amountPending)
					setNumadvices(res.numAdvices)
					setFirsttime(res.firstTime)
					setIscreator(res.isCreator)
					setBanned(res.banned)
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
		<div id="mobile-header">        
      <div id="user">You are {username}</div>
      <div id="logo" onClick={() => window.location = "/"}>
    		<img src="/logo.png"/>
    	</div>
      <div id="navs">
    		{firstTime == false && (
        	<>
	        	<div className="row">
	        		<div className="row">
		            <div className="nav" onClick={() => window.location = "/main"} sx={{ color: 'black' }}>
		            	<div className="column"><AiOutlineCodeSandbox style={{ fontSize: 20 }}/></div>
		            	<div className="column" style={{ marginLeft: 10 }}>Products</div>
		            </div>
		            <div className="nav" onClick={() => window.location = "/ratings"} sx={{ color: 'black' }}>
		            	<div className="column"><FcRating style={{ fontSize: 20 }}/></div>
		            	<div className="column" style={{ marginLeft: 10 }}>Ratings</div>
		            </div>
		            {isCreator == true && (
		            	<div className="nav" onClick={() => window.location = "/seefeedbacks"} sx={{ my: 2, color: 'white' }}>
		            		<div className="column"><VscFeedback style={{ fontSize: 20 }}/></div>
		            		<div className="column" style={{ marginLeft: 10 }}>See Feedbacks{numAdvices > 0 && " (" + numAdvices + ")"}</div>
		            	</div>
		            )}
		          </div>
	        	</div>
		        <div className="row">
		        	<div className="row">
		            <div className="nav" onClick={() => window.location = "/earnings"} sx={{ color: 'black' }}>
		            	<div className="column"><AiFillDollarCircle style={{ fontSize: 20 }}/></div>
		            	<div className="column" style={{ marginLeft: 10 }}>Withdraw reward: ${earnings.toFixed(2)}</div>
		            </div>
		          	<div className="nav" onClick={() => window.location = "/listproduct"} sx={{ color: 'black' }}>
		          		<div className="column"><HiRocketLaunch style={{ fontSize: 20 }}/></div>
		          		<div className="column" style={{ marginLeft: 10 }}>Submit your product</div>
		          	</div>
		          </div>
		        </div>
          </>
      	)}
    	</div>
      <div className="row">
				<div>
					<div className="row">
						<div className="column"><MdPending style={{ fontSize: 20 }}/></div>
						<div id="user">Pending ${amountPending.toFixed(2)}</div>
					</div>
					{banned && <div id="user">You are banned<strong onClick={() => props.regainAccount()}>FIX</strong></div>}
				</div>
				<div className="column">
					<div id="logout" onClick={() => logout()} sx={{ my: 2, color: 'black', display: 'block' }}>Log-Out</div>
				</div>
			</div>
		</div>
	)
}
