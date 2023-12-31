import './intro.scss';
import { useEffect, useState } from 'react';
import { getId, resizePhoto } from 'geottuse-tools';
import ClipLoader from "react-spinners/ClipLoader";
import { createCheckout, createCustomerPayment, updateFirstTime } from '../../apis/user';
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

export default function Intro() {
	const [accountType, setAccounttype] = useState('')

	const [userId, setUserid] = useState('')

	const [name, setName] = useState('')
	const [desc, setDesc] = useState('')
	const [link, setLink] = useState('')
	const [image, setImage] = useState({ uri: '', width: 0, height: 0 })

	const [file, setFile] = useState(null)
	const [errorMsg, setErrormsg] = useState('')

	const [loading, setLoading] = useState(false)

	const listTheProduct = event => {
		setLoading(true)

		event.preventDefault();

		const data = new FormData(event.currentTarget);
		const name = data.get('name'), desc = data.get('desc'), link = data.get('link')

		if (name && desc && link && image.uri) {
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
		} else {
			if (!name) {
				setErrormsg("Please enter your product name")
			} else if (!desc) {
				setErrormsg("Please enter your product information")
			} else if (!link) {
				setErrormsg("Please enter your product website")
			} else {
				setErrormsg("Please provide a logo")
			}

			setLoading(false)
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
	const updateTheFirstTime = () => {
		const data = { userId }

		updateFirstTime(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					localStorage.setItem("testerIntro", "true")

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

	useEffect(() => {
		setAccounttype(localStorage.getItem("accountType") ? localStorage.getItem("accountType") : "")
		setUserid(localStorage.getItem("id"))

		if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('intro', { id: localStorage.getItem("id"), web: true });
	}, [])
	
	return (
		<div id="intro">
			<Header/>

			{accountType ? 
				<div id="listproduct">
					<Typography component="h1" variant="h5" style={{ fontWeight: 'bold', margin: '50px 20% 5% 20%', textAlign: 'center' }}> 
        		Introduce your product
        	</Typography>

					<ThemeProvider theme={theme}>
						<Container component="main" maxWidth="xs">
        			<CssBaseline />

				      <Box
			          sx={{
			            display: 'flex',
			            flexDirection: 'column',
			            height: 500,
			            alignItems: 'center',
			          }}
			        >
			          <Box component="form" onSubmit={listTheProduct} noValidate sx={{ mt: 1 }}>
			          	<TextField margin="normal" required fullWidth id="standard-size-small" label="Enter product name:" name="name" variant="standard" disabled={loading} defaultValue={name} inputProps={{ maxLength: 50 }}/>
			          	<TextField margin="normal" required fullWidth multiline id="standard-size-small" label="Enter product information:" name="desc" variant="standard" disabled={loading} defaultValue={desc} inputProps={{ maxLength: 100 }}/>
			          	<TextField margin="normal" required fullWidth id="standard-size-small" label="www.example.com" name="link" variant="standard" disabled={loading} defaultValue={link} inputProps={{ maxLength: 50 }}/>

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
		        </Container>
			    </ThemeProvider>
				</div>
				:
				<div id="account-type-container">
					<div id="account-type">
						<div id="account-type-header">Are you launching your product</div>

						<div id="account-type-actions">
							<div className="account-type-action" onClick={() => {
								setAccounttype('creator')

								localStorage.setItem("accountType", "creator")
							}}>Yes</div>
							<div className="account-type-action" onClick={() => updateTheFirstTime()}>No</div>
						</div>
					</div>
				</div>
			}
		</div>
	)
}
