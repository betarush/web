import './login.scss';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { login } from '../../../apis/user'

// material ui components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		submit: {
			main: 'black',
			contrastText: 'white'
		}
	}
})

if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('login', { mobile: true });

export default function Login() {
	const [email, setEmail] = useState(process.env.REACT_APP_MODE == 'dev' ? 'tester@gmail.com' : '')
	const [password, setPassword] = useState(process.env.REACT_APP_MODE == 'dev' ? 'qqqqqqq' : '')
	const [errorMsg, setErrormsg] = useState('')

	const theLogin = event => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const email = data.get('email'), password = data.get('password')

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
						err.json().then(({ status }) => {
							if (status == "passwordWrong") {
								setErrormsg("Password is wrong")
							} else if (status == "nonExist") {
								setErrormsg("E-mail is not found")
							}
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
		<div id="mobile-login">
			<ThemeProvider theme={theme}>
				<div id="logo" onClick={() => window.location = "/"}>
	    		<img src="/logo.png"/>
	    	</div>
	    	<Container component="main" maxWidth="xs">
	        <CssBaseline />
	        <Box
	          sx={{
	            marginTop: 8,
	            display: 'flex',
	            flexDirection: 'column',
	            alignItems: 'center',
	          }}
	        >
	        	<Avatar sx={{ m: 1, bgcolor: 'black' }}>
	            <LockOutlinedIcon />
	          </Avatar>
	          <Typography component="h1" variant="h5">Log in</Typography>
	          <Box component="form" onSubmit={theLogin} noValidate sx={{ mt: 1 }}>
	          	<TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus defaultValue={email}/>
	            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" defaultValue={password}/>

	            <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>

	            <Button type="submit" fullWidth variant="contained" color="submit" sx={{ mt: 3, mb: 2 }}>LOG IN</Button>
	            <Grid container>
	              <Grid item xs>
	                <Link href="#" variant="body2">
	                	Forgot password?
	                </Link>
	              </Grid>
	              <Grid item>
	                <Link href="/register" variant="body2">
	                  Don't have an account? Sign Up
	                </Link>
	              </Grid>
	            </Grid>
	          </Box>
					</Box>
	        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
			      {'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}
			    </Typography>
	      </Container>
	    </ThemeProvider>
		</div>
	)
}
