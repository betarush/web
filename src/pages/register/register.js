import './register.scss';
import { useEffect, useState } from 'react';
import { register } from '../../apis/user'

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
	const [email, setEmail] = useState('creator@gmail.com')
	const [password, setPassword] = useState('qqqqqqq')
	const [confirmPassword, setConfirmpassword] = useState('qqqqqqq')
	const [errorMsg, setErrormsg] = useState('')

	const theRegister = event => {
		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const email = data.get('email'), password = data.get('password'), confirmPassword = data.get('confirmPassword')

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
	          <Box component="form" onSubmit={theRegister} noValidate sx={{ mt: 1 }}>
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