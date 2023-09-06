import './listproduct.scss';
import { useEffect, useState } from 'react';
import { getId, resizePhoto } from 'geottuse-tools';
import { getUserInfo } from '../../apis/user';
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
import Header from '../components/header'

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

export default function Listproduct() {
	const [userId, setUserid] = useState('')

	const [name, setName] = useState('chatee')
	const [desc, setDesc] = useState('match with friends, explore their posts and like their posts to talk with them')
	const [link, setLink] = useState('https://www.chatee.app')
	const [image, setImage] = useState({ uri: '', width: 0, height: 0 })
	const [file, setFile] = useState(null)
	const [errorMsg, setErrormsg] = useState('')

	const [paymentDone, setPaymentdone] = useState(false)

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
		event.preventDefault();

		if (name && desc && link) {
			if (paymentDone) {
				const id = localStorage.getItem("id")
				const data = new FormData(event.currentTarget);
				const name = data.get('name'), desc = data.get('desc'), link = data.get('link')
				const json = { userId: id, name, desc, link, image: JSON.stringify(image) }

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
				localStorage.setItem("productInfo", JSON.stringify({ name, desc, link, image }))

				window.location = "/payment"
			}
		} else {
			if (!name) {
				setErrormsg("Please enter your product name")
			} else if (!desc) {
				setErrormsg("Please enter your product information")
			} else {
				setErrormsg("Please enter your product website")
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
		getTheUserInfo()
	}, [])

	return (
		<ThemeProvider theme={theme}>
			<Header/>

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
          	<TextField margin="normal" required fullWidth id="standard-size-small" label="Enter product name:" name="name" variant="standard" defaultValue={name}/>
          	<TextField margin="normal" required fullWidth id="standard-size-small" label="Enter product information:" name="desc" variant="standard" defaultValue={desc}/>
          	<TextField margin="normal" required fullWidth id="standard-size-small" label="Enter product link to lead customers:" name="link" variant="standard" defaultValue={link}/>

          	<Button
						  component="label"
						  variant="contained"
						  startIcon={<CloudUploadIcon />}
						  href="#file-upload"
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

            <Button type="submit" fullWidth variant="contained" color="submit" sx={{ mt: 3, mb: 2 }}>{paymentDone ? "PAY & LAUNCH" : "ENTER PAYMENT"}</Button>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
		      {'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}
		    </Typography>
      </Container>
    </ThemeProvider>
	)

	// return (
	// 	<div id="listproduct">
	// 		<Header/>

	// 		<div id="form">
	// 			<div id="header">What is your product</div>

	// 			<div className="form-input">
	// 				<div className="input-header">Enter product name:</div>
	// 				<input class="input" placeholder="What is your product name" type="text" onChange={e => setName(e.target.value)} value={name}/>
	// 			</div>
	// 			<div className="form-input">
	// 				<div className="input-header">Enter product information:</div>
	// 				<textarea 
	// 					class="input" 
	// 					placeholder="etc: what is the product about, what problem does it solve and how does it solve it" 
	// 					type="text" onChange={e => setDesc(e.target.value)} value={desc}
	// 					style={{ height: 300 }}
	// 				/>
	// 			</div>
	// 			<div className="form-input">
	// 				<div className="input-header">Enter product link to lead customers:</div>
	// 				<input class="input" placeholder="What is your product website" type="text" onChange={e => setLink(e.target.value)} value={link}/>
	// 			</div>
	// 			<div className="form-input">
	// 				<div className="input-header">Provide product logo: (Optional)</div>

	// 				<div id="browse-image" onClick={() => file.click()}>Browse Logo</div>

	// 				{image.uri && (
	// 					<div style={{ margin: '0 auto', ...resizePhoto(image, 300, 300) }}>
	// 						<img src={image.uri} style={{ height: '100%', width: '100%' }}/>
	// 					</div>
	// 				)}

	// 				<input 
	// 					type="file" ref={r => setFile(r)} 
	// 					onChange={chooseImage} style={{ display: 'none' }}
	// 					stye={{ display: 'none' }}
	// 				/>
	// 			</div>

	// 			<div id="errormsg">{errorMsg}</div>

	// 			<div id="submit" onClick={() => listTheProduct()}>{paymentDone ? "Pay and launch" : "Enter payment"}</div>
	// 		</div>
	// 	</div>
	// )
}