import './listproduct.scss';
import { useEffect, useState } from 'react';
import { getId, resizePhoto } from 'geottuse-tools';
import ClipLoader from "react-spinners/ClipLoader";
import { depositAmount, regainAmount } from "../../info"
import { getUserInfo, createCheckout, createCustomerPayment } from '../../apis/user';
import { listProduct } from '../../apis/product'

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
import Header from '../../components/header'

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
	const [paymentDone, setPaymentdone] = useState({ brand: "", last4: "" })
	const [regainAccountconfirm, setRegainaccountconfirm] = useState({ show: false, cardInfo: {}, loading: false })
	const [bannedSign, setBannedsign] = useState(false)

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
					setUserid(id)

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('listproduct', { id, web: true });
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
			const data = { userId, name, desc, link, image: JSON.stringify(image) }

			localStorage.setItem("viewMyProducts", "true")

			listProduct(data)
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
	const regainTheAccount = () => {
		if (!regainAccountconfirm.show) {
			setRegainaccountconfirm({ ...regainAccountconfirm, show: true })
		} else {
			if (paymentDone.brand != "") {
				const data = { userId }

				createCustomerPayment(data)
					.then((res) => {
						if (res.status == 200) {
							return res.json()
						}

						throw res
					})
					.then((res) => {
						if (res) {
							window.location = "/listproduct"
						}
					})
			} else {
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

					})
			}
		}
	}

	useEffect(() => {
		if (sessionId) {
			const data = { 
				userId: localStorage.getItem("id"), 
				sessionId 
			}
			
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
						window.location = "/listproduct"
					}
			})
		} else {
			getTheUserInfo()
		}
	}, [])

	return (
		<ThemeProvider theme={theme}>
			<Header
				regainAccount={() => regainTheAccount()}
			/>

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

            <Button type="submit" fullWidth variant="contained" color="submit" disabled={loading} sx={{ mt: 3, mb: 2 }}>LAUNCH</Button>

            {loading && (
            	<div style={{ height: 25, margin: '20px auto', width: 25 }}>
								<ClipLoader color="black" size={20}/>
							</div>
            )}
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
		      {'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}
		    </Typography>
      </Container>

			{(regainAccountconfirm.show || bannedSign) && (
				<div id="hidden-box">
					{regainAccountconfirm.show && (
						<div id="regain-account-box">
							<div id="regain-account-header">Regain account payment summary</div>

							<div className="regain-account-div"/>

							<div id="regain-account-infos">
								<div className="regain-account-info-header"><strong>Subtotal:</strong> ${regainAmount.toFixed(2)}</div>

								<div className="regain-account-div"/>

								<div className="regain-account-info-header"><strong>Total:</strong> ${regainAmount.toFixed(2)}</div>
							</div>

							{regainAccountconfirm.cardInfo.last4 && (
								<div id="card-info">
									<div id="type">
										{regainAccountconfirm.cardInfo.name == "Visa" && <img src="/visa.png"/>}
										{regainAccountconfirm.cardInfo.name == "MasterCard" && <img src="/mastercard.png"/>}
										{regainAccountconfirm.cardInfo.name == "American Express" && <img src="/amex.jpg"/>}
										{regainAccountconfirm.cardInfo.name == "Discover" && <img src="/discover.jpg"/>}
										{regainAccountconfirm.cardInfo.name == "Diners Club" && <img src="/dinersclub.png"/>}
										{regainAccountconfirm.cardInfo.name == "JCB" && <img src="/jcb.jpg"/>}
										{regainAccountconfirm.cardInfo.name == "UnionPay" && <img src="/unionpay.png"/>}
									</div>
									<div id="header">
										{regainAccountconfirm.cardInfo.name}
										<br/>
										*********{regainAccountconfirm.cardInfo.last4}
									</div>
								</div>
							)}
							
							<div id="actions">
								<div className="action" style={{ opacity: regainAccountconfirm.loading ? 0.5 : 1 }} onClick={() => !regainAccountconfirm.loading && setRegainaccountconfirm({ show: false, cardInfo: {} })}>Cancel</div>
								<div className="action" style={{ opacity: regainAccountconfirm.loading ? 0.5 : 1 }} onClick={() => !regainAccountconfirm.loading && regainTheAccount()}>Regain now</div>
							</div>

							{regainAccountconfirm.loading && (
								<div style={{ height: 20, margin: '5px auto', width: 20 }}>
									<ClipLoader color="black" size={20}/>
								</div>
							)}
						</div>
					)}
					{bannedSign && (
						<div id="banned-sign-box">
							<div id="banned-sign-header">You have been banned because of an advice you gave</div>

							<div id="actions">
								<div className="action" onClick={() => setBannedsign(false)}>Cancel</div>
								<div className="action" onClick={() => {
									setBannedsign(false)
									regainTheAccount()
								}}>Unban now</div>
							</div>
						</div>
					)}
				</div>
			)}
    </ThemeProvider>
	)
}