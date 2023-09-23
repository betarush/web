import './header.scss'
import { useEffect, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

const pages = ['Products', 'Rejections', 'Withdraw'];
const fullWidth = window.innerWidth

const theme = createTheme({
  palette: {
    primary: {
    	main: 'rgba(127, 127, 127, 0.9)',
		  light: '#fff',
		  dark: '#fff',
		  contrastText: '#fff',
    }
  },
});

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
		<ThemeProvider theme={theme}>
			<div id="mobile-header">        
	      <AppBar color="primary" position="static" enableColorOnDark>
	      	<Typography
            variant="h6"
            noWrap
            component="a"
            sx={{ mr: 2, display: { xs: 'flex', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, flexDirection: 'row', color: 'inherit', justifyContent: 'space-around', textDecoration: 'none' }}
          >
            You are {username}
          </Typography>
          <div id="logo" onClick={() => window.location = "/"}>
        		<img src="/logo.png"/>
        	</div>
		      <Container maxHeight={80} maxWidth={fullWidth}>
		        <Toolbar>
		          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }}>
		          	{firstTime == false && (
			          	<div>
				            <Button variant="contained" onClick={() => window.location = "/main"} sx={{ color: 'white' }}>Products</Button>
				            <Button variant="contained" onClick={() => window.location = "/rejections"} sx={{ color: 'white' }}>Rejections</Button>
				            {isCreator == true && <Button variant="contained" onClick={() => window.location = "/seefeedbacks"} sx={{ my: 2, color: 'white' }}>See Feedbacks</Button>}
				            <Button variant="contained" onClick={() => window.location = "/earnings"} sx={{ color: 'white' }}>Withdraw reward: ${earnings.toFixed(2)}</Button>
			            	<Button variant="contained" onClick={() => window.location = "/listproduct"} sx={{ color: 'white' }}>Submit your product</Button>
			            </div>
		          	)}
		          </Box>
		        </Toolbar>
		      </Container>
		      <Button onClick={() => logout()} sx={{ my: 2, color: 'white', display: 'block' }}>Log-Out</Button>
		    </AppBar>
			</div>
		</ThemeProvider>
	)
}
