import './payment.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { submitPaymentInfo, getPaymentInfo } from '../../apis/user'
import { listProduct } from '../../apis/product'

// material ui components
import Avatar from '@mui/material/Avatar';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Button from '@mui/joy/Button';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';

// components
import Header from '../../components/header'

let stripe = require('stripe')('sk_test_51NmA1PFqjgkiO0WHxOmFjOzgwHorLyTxjyWJ926HiBK10KHnTnh7q8skEmQ5c0NpHxI3mk2fbejMASjazhPlmGkv00L98uIq8G');

export default function Payment() {
	const [userId, setUserid] = useState('')

	// test card
	const [name, setName] = useState('the account')
	const [number, setNumber] = useState('4000000000000077')
	const [cvc, setCvc] = useState('234')
	const [expdate, setExpdate] = useState('1224')

	// real card
	// const [name, setName] = useState('Kevin Hien Luong Mai')
	// const [number, setNumber] = useState('4512238770577855')
	// const [cvc, setCvc] = useState('086')
	// const [expdate, setExpdate] = useState('1123')

	const [errorMsg, setErrormsg] = useState('')

	const [newProduct, setNewproduct] = useState(false)
	const [loaded, setLoaded] = useState(false)

	const getThePaymentInfo = () => {
		const id = localStorage.getItem("id")
		const data = { userId: id }

		getPaymentInfo(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}
			})
			.then((res) => {
				if (res) {
					if (res.name) {
						setName(res.name)
						setNumber(res.number)
						setCvc(res.cvc)
						setExpdate(res.expdate)
					}

					setUserid(id)
					setLoaded(true)
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const submitThePaymentInfo = async event => {
		event.preventDefault()

		const data = new FormData(event.currentTarget);
		const name = data.get('name'), number = data.get('number'), cvc = data.get('cvc'), expdate = data.get('expdate')

		if (name && number && cvc && expdate) {
			let card = await stripe.tokens.create({
				card: {
					number,
			    exp_month: expdate.substr(0, 2),
			    exp_year: expdate.substr(2),
			    cvc
				}
			})

			const json = { userId, name, number, cvc, expdate, token: card.id }

			submitPaymentInfo(json)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						if (newProduct) { // new product launching
							const data = JSON.parse(localStorage.getItem("productInfo"))

							data["userId"] = userId
							data["image"] = JSON.stringify(data["image"])

							listProduct(data)
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

								})
						} else {
							window.location = "/main"
						}
					}
				})
				.catch((err) => {
					if (err.status == 400) {
						err.json().then(() => {

						})
					}
				})
		}
	}

	useEffect(() => {
		getThePaymentInfo()

		if (localStorage.getItem("productInfo")) {
			setNewproduct(true)
		}
	}, [])

	return (
		<div id="payment">
			<Header/>

			{loaded ? 
				<Card
		      variant="outlined"
		      sx={{
		        maxHeight: 'max-content',
		        maxWidth: 600,
		        marginTop: 10,
		        mx: 'auto',
		        // to make the demo resizable
		        overflow: 'auto'
		      }}
		    >
		      <Typography level="title-lg" startDecorator={<InfoOutlined />}>
		        Your payment info
		      </Typography>
		      <Divider inset="none" />
		      <Box component="form" onSubmit={submitThePaymentInfo} noValidate sx={{ mt: 1 }}>
			      <CardContent
			        sx={{
			          display: 'grid',
			          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
			          gap: 1.5,
			        }}
			      >
			      	{localStorage.getItem("productInfo") ? 
			      		<div>
			      			<FormControl sx={{ gridColumn: '1/-1' }}>
					          <FormLabel>Card holder name</FormLabel>
					          <Input placeholder="Enter cardholder's full name" name="name" defaultValue={name}/>
					        </FormControl>
					        <FormControl sx={{ gridColumn: '1/-1' }}>
					          <FormLabel>Card number</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="number" defaultValue={number}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>Expiry date</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="expdate" defaultValue={expdate}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>CVC/CVV</FormLabel>
					          <Input endDecorator={<InfoOutlined />} name="cvc" defaultValue={cvc}/>
					        </FormControl>

					        <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>
			      		</div>
			      		:
			      		<>
			      			<FormControl sx={{ gridColumn: '1/-1' }}>
					          <FormLabel>Card holder name</FormLabel>
					          <Input placeholder="Enter cardholder's full name" name="name" defaultValue={name}/>
					        </FormControl>
					        <FormControl sx={{ gridColumn: '1/-1' }}>
					          <FormLabel>Card number</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="number" defaultValue={number}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>Expiry date</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="expdate" defaultValue={expdate}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>CVC/CVV</FormLabel>
					          <Input endDecorator={<InfoOutlined />} name="cvc" defaultValue={cvc}/>
					        </FormControl>

					        <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>
			      		</>
			      	}
					      	

				      {localStorage.getItem("productInfo") && (
				      	<div id="payment-infos">
					      	<div className="payment-info"><strong>Subtotal:</strong> $20.00</div>
					      	<div className="payment-info"><strong>Service fee:</strong> $5.00</div>
					      	<div className="payment-info"><strong>Total:</strong> $25.00</div>
					      </div>
				      )}

			        <CardActions sx={{ gridColumn: '1/-1' }}>
			          <Button type="submit" variant="solid" color="primary">
			            {newProduct ? "Add payment and launch" : "Save payment"}
			            <div style={{ marginLeft: 10 }}><LockOutlinedIcon /></div>
			          </Button>
			        </CardActions>
			      </CardContent>
			    </Box>
		    </Card>
				:
				<div style={{ height: 20, margin: '10% auto', width: 20 }}>
					<ClipLoader color="black" size={20}/>
				</div>
			}

	    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
	      {'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}
	    </Typography>
    </div>
	)
}
