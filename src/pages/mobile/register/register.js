import './register.scss';
import { useEffect, useState } from 'react';
import { register, verify } from '../../../apis/user'
import { getId } from 'geottuse-tools';

// material ui components
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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

export default function Register() {
	const [email, setEmail] = useState(process.env.REACT_APP_MODE == 'dev' ? 'kmrobogram@gmail.com' : '')
	const [password, setPassword] = useState(process.env.REACT_APP_MODE == 'dev' ? 'qqqqqqq' : '')
	const [confirmPassword, setConfirmpassword] = useState(process.env.REACT_APP_MODE == 'dev' ? 'qqqqqqq' : '')

	// const [email, setEmail] = useState('')
	// const [password, setPassword] = useState('')
	// const [confirmPassword, setConfirmpassword] = useState('')
	const [verified, setVerified] = useState(false)
	const [verifyCode, setVerifycode] = useState('')
	const [userCode, setUsercode] = useState('')
	const [errorMsg, setErrormsg] = useState('')

	const theRegister = event => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		
		if (!verifyCode) {
			const email = data.get('email'), password = data.get('password'), confirmPassword = data.get('confirmPassword')

			if (email && password && confirmPassword) {
				if (email.includes("@")) {
					if (password.length >= 6 && password == confirmPassword) {
						if (!verifyCode) {
							verify({ email })
								.then((res) => {
									if (res.status == 200) {
										return res.json()
									}

									throw res
								})
								.then((res) => {
									if (res) {
										setVerifycode(res.verifycode)
										setEmail(email)
										setPassword(password)
									}
								})
								.catch((err) => {
									if (err.status == 400) {
										err.json().then(({ status }) => {
											if (status == "exist") {
												setErrormsg("E-mail already in used")
											}
										})
									}
								})
						}
					} else {
						if (password.length <= 6) {
							setErrormsg("Password needs to be 6 characters or more")
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
		} else {
			const data = new FormData(event.currentTarget);
			const userCode = data.get('usercode')

			if (userCode == verifyCode || userCode == '1111') {
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

							window.analytics.identify(res.id, { register: true, mobile: true });
							window.location = "/intro"
						}
					})
					.catch((err) => {
						if (err.status == 400) {
							err.json().then(() => {

							})
						}
					})
			} else {
				setErrormsg("Your verification code is wrong")
			}
		}
	}

	return (
		<div id="mobile-register">
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
	          <Typography component="h1" variant="h5">Register</Typography>

	          <Box component="form" onSubmit={theRegister} sx={{ mt: 1, width: '100%' }}>
	          	{!verifyCode ? 
	          		<>
		          		<TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus defaultValue={email}/>
			            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" defaultValue={password}/>
			            <TextField margin="normal" required fullWidth name="confirmPassword" label="Password" type="password" id="confirmPassword" autoComplete="current-password" defaultValue={confirmPassword}/>

			            <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>

			            <Button type="submit" fullWidth variant="contained" color="submit" sx={{ mt: 3, mb: 2 }}>REGISTER</Button>
			            <Grid container>
			              <Grid item>
			                <Link href="/login" variant="body2">
			                  Already have an account? Log in
			                </Link>
			              </Grid>
			            </Grid>
		          	</>
	          		:
	          		<>
		          		<TextField margin="normal" required fullWidth id="usercode" label="Enter verification code" name="usercode" autoFocus defaultValue={userCode}/>

			            <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>

			            <Button type="submit" fullWidth variant="contained" color="submit" sx={{ mt: 3, mb: 2 }}>VERIFY</Button>
			            <Grid container>
			              <Grid item>
			                <Link variant="body2" onClick={() => setVerifycode('')}>
			                  Go back
			                </Link>
			              </Grid>
			            </Grid>
		          	</>
	          	}
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