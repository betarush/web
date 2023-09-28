import './listproduct.scss';
import { useEffect, useState } from 'react';
import { getId, resizePhoto } from 'geottuse-tools';
import ClipLoader from "react-spinners/ClipLoader";
import { getUserInfo, createCheckout, createCustomerPayment } from '../../../apis/user';
import { listProduct } from '../../../apis/product'

// material ui components
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// components
import Header from '../../../components/mobile/header'

const theme = createTheme({
	palette: {
		submit: {
			main: 'black',
			contrastText: 'white'
		}
	}
})

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
let sessionId = ""

if (window.location.search.includes("session_id")) {
	const urlParams = new URLSearchParams(window.location.search)
	
	sessionId = urlParams.get('session_id')
}

export default function Listproduct() {
	const [userId, setUserid] = useState('')

	const [name, setName] = useState(process.env.REACT_APP_MODE == 'dev' ? 'chatee' : '')
	const [desc, setDesc] = useState(process.env.REACT_APP_MODE == 'dev' ? 'match with friends, explore their posts and like their posts to talk with them' : '')
	const [link, setLink] = useState(process.env.REACT_APP_MODE == 'dev' ? 'https://www.chatee.app' : '')
	const [image, setImage] = useState({ uri: '', width: 0, height: 0 })

	const [file, setFile] = useState(null)
	const [errorMsg, setErrormsg] = useState('')

	const [paymentDone, setPaymentdone] = useState(false)
	const [loading, setLoading] = useState(false)

	const getTheUserInfo = () => {
		const id = localStorage.getItem("id")
		const data = { userId: id }

		getUserInfo(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setPaymentdone(res.paymentDone)
					setUserid(id)
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const listTheProduct = event => {
		setLoading(true)

		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const name = data.get('name'), desc = data.get('desc'), link = data.get('link')

		if (name && desc && link && image.uri) {
			if (paymentDone) {
				const id = localStorage.getItem("id")
				const json = { userId: id, name, desc, link, image: JSON.stringify(image) }

				localStorage.setItem("viewMyProducts", "true")

				listProduct(json)
					.then((res) => {
						if (res.status == 200) {
							return res.json()
						}

						throw res
					})
					.then((res) => {
						if (res) {
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
				localStorage.setItem("productInfo", JSON.stringify({ userId, name, desc, link, image }))

				const data = { userId, redirect: "listproduct" }

				createCheckout(data)
					.then((res) => {
						if (res.status == 200) {
							return res.json()
						}

						throw res
					})
					.then((res) => {
						if (res) {
							window.location = res.url
						}
					})
					.catch((err) => {
						if (err.status == 400) {
							err.json().then(() => {

							})
						}
					})
			}
		} else {
			setLoading(false)
			
			if (!name) {
				setErrormsg("Please enter your product name")
			} else if (!desc) {
				setErrormsg("Please enter your product information")
			} else if (!link) {
				setErrormsg("Please enter your product website")
			} else {
				setErrormsg("Please upload a logo for your product")
			}
		}
	}
	const chooseImage = e => {
		if (e.target.files && e.target.files[0]) {
			let reader = new FileReader()

			reader.onload = e => {
				let imageReader = new Image()

				imageReader.onload = () => {
					setImage({
						uri: e.target.result,
						width: imageReader.width,
						height: imageReader.height
					})
				}

				imageReader.src = e.target.result
			}

			reader.readAsDataURL(e.target.files[0])
		}
	}

	useEffect(() => {
		if (sessionId) {
			setLoading(true)

			const id = localStorage.getItem("id")

			const data = { userId: id, sessionId }

			sessionId = ""

			createCustomerPayment(data)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						const { userId, name, desc, link, image } = JSON.parse(localStorage.getItem("productInfo"))
						const json = { userId, name, desc, link, image: JSON.stringify(image) }

						localStorage.setItem("viewMyProducts", "true")

						listProduct(json)
							.then((res) => {
								if (res.status == 200) {
									return res.json()
								}

								throw res
							})
							.then((res) => {
								if (res) {
									localStorage.removeItem("productInfo")

									window.location = "/main"
								}
							})
							.catch((err) => {
								if (err.status == 400) {
									err.json().then(() => {
										
									})
								}
							})
					}
			})
		} else {
			getTheUserInfo()
		}
	}, [])

	return (
		<div id="listproduct">
			<ThemeProvider theme={theme}>
				<Header/>

				<Typography component="h1" variant="h6" style={{ margin: '50px 5% 5% 5%', textAlign: 'center' }}>
      		We have a big user base of people who are looking to tryout products
      		and give feedback. 
      		<br/><br/><br/>
      		Introduce your product and get awesome feedbacks from actual users
      	</Typography>

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
	          <Typography component="h1" variant="h5">What is your product</Typography>
	          <Box component="form" onSubmit={listTheProduct} noValidate sx={{ mt: 1 }}>
	          	<TextField margin="normal" required fullWidth id="standard-size-small" label="Enter product name:" name="name" variant="standard" disabled={loading} defaultValue={name} inputProps={{ maxLength: 50 }}/>
	          	<TextField margin="normal" required fullWidth multiline id="standard-size-small" label="Enter product information:" name="desc" variant="standard" disabled={loading} defaultValue={desc} inputProps={{ maxLength: 100 }}/>
	          	<TextField margin="normal" required fullWidth id="standard-size-small" label="Enter product link to lead customers:" name="link" variant="standard" disabled={loading} defaultValue={link} inputProps={{ maxLength: 50 }}/>

	          	<Button
							  component="label"
							  variant="contained"
							  startIcon={<CloudUploadIcon />}
							  href="#file-upload"
							  disabled={loading}
							>
							  Upload a logo
							  <VisuallyHiddenInput 
							  	type="file"
							  	ref={r => setFile(r)}
							  	onChange={chooseImage} 
							  />
							</Button>

							{image.uri && (
								<div style={{ margin: '0 auto', ...resizePhoto(image, 300, 300) }}>
									<img src={image.uri} style={{ height: '100%', width: '100%' }}/>
								</div>
							)}

							<Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>

							<div id="payment-infos">
								<div className="payment-info"><strong>Subtotal:</strong> $20.00</div>
								<div className="payment-info"><strong>Service fee:</strong> $5.00</div>
								<div className="payment-info"><strong>Total:</strong> $25.00</div>
							</div>

	            <Button type="submit" fullWidth variant="contained" color="submit" disabled={loading} sx={{ mt: 3, mb: 2 }}>LAUNCH</Button>

	            {loading && (
	            	<div style={{ height: 20, margin: '20px auto', width: 20 }}>
									<ClipLoader color="black" size={20}/>
								</div>
	            )}
	          </Box>
	        </Box>
	        <div className="row">
		      	<div style={{ display: 'flex', flexDirection: 'row' }}>
		        	<div className="column">Powered by </div>
		        	<img src="/stripe.png" style={{ height: 50, marginLeft: 10, width: 50 }}/>
		        </div>
		      </div>
	        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
			      {'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}
			    </Typography>
	      </Container>
	    </ThemeProvider>
	  </div>
	)
}