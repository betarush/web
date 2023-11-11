import './payment.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { depositAmount, regainAmount } from "../../info"
import { submitPaymentInfo, getPaymentInfo, createCheckout, createCustomerPayment } from '../../apis/user'
import { listProduct, relistProduct } from '../../apis/product'

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

let stripe = require('stripe')(process.env.REACT_APP_STRIPE_KEY);
let sessionId = ""

if (window.location.search.includes("session_id")) {
	const urlParams = new URLSearchParams(window.location.search)
	
	sessionId = urlParams.get('session_id')
}

export default function Payment() {
	const [userId, setUserid] = useState('')

	// test card
	// const [name, setName] = useState('the account')
	// const [number, setNumber] = useState('4000000000000077')
	// const [cvc, setCvc] = useState('234')
	// const [expdate, setExpdate] = useState('1224')

	const [name, setName] = useState('')
	const [number, setNumber] = useState('')
	const [cvc, setCvc] = useState('')
	const [expdate, setExpdate] = useState('')

	const [cardInfo, setCardinfo] = useState({ last4: '', name: '' })

	const [errorMsg, setErrormsg] = useState('')
	const [loaded, setLoaded] = useState(false)
	const [loading, setLoading] = useState(false)
	const [paymentDone, setPaymentdone] = useState({ brand: "", last4: "" })

	const [regainAccountconfirm, setRegainaccountconfirm] = useState({ show: false, cardInfo: {}, loading: false })
	const [bannedSign, setBannedsign] = useState(false)

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
					if (res.card) {
						setCardinfo(res.card)
					}

					setUserid(id)
					setLoaded(true)

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('payment', { id, web: true });
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

			const json = { userId, token: card.id }

			setLoading(true)

			submitPaymentInfo(json)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('submitpayment', { id: userId, web: true });

						if (localStorage.getItem("productInfo")) { // new product launching
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
										if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('listproduct', { id: userId, web: true });

										localStorage.removeItem("productInfo")

										window.location = "/main"
									}
								})
								.catch((err) => {

								})
						} else if (localStorage.getItem("relaunchProduct")) {
							relistProduct({ productId: localStorage.getItem("relaunchProduct") })
								.then((res) => {
									if (res.status == 200) {
										return res.json()
									}

									throw res
								})
								.then((res) => {
									if (res) {
										if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('relistproduct', { id: userId, web: true });

										localStorage.removeItem("relaunchProduct")

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
							window.location = "/payment"
						}
					})
			} else {
				const data = { userId, redirect: "payment" }

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
						window.location = "/payment"
					}
			})
		} else {
			getThePaymentInfo()
		}
	}, [])

	return (
		<div id="payment">
			<Header
				regainAccount={() => regainTheAccount()}
			/>

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
		      	{cardInfo.last4 && (
		      		<div>
			      		<div id="card-info">
			      			<div id="type">
			      				{cardInfo.name == "Visa" && <img src="/visa.png"/>}
			      				{cardInfo.name == "MasterCard" && <img src="/mastercard.png"/>}
			      				{cardInfo.name == "American Express" && <img src="/amex.jpg"/>}
			      				{cardInfo.name == "Discover" && <img src="/discover.jpg"/>}
			      				{cardInfo.name == "Diners Club" && <img src="/dinersclub.png"/>}
			      				{cardInfo.name == "JCB" && <img src="/jcb.jpg"/>}
			      				{cardInfo.name == "UnionPay" && <img src="/unionpay.png"/>}
			      			</div>
			      			<div className="info">
			      				{cardInfo.name}
			      				<br/>
			      				*********{cardInfo.last4}
			      			</div>
			      		</div>
			      		<div id="card-info-header">Or enter a new card below to update</div>
			      	</div>
		      	)}

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
					          <Input placeholder="Enter cardholder's full name" name="name" disabled={loading} defaultValue={name}/>
					        </FormControl>
					        <FormControl sx={{ gridColumn: '1/-1' }}>
					          <FormLabel>Card number</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="number" disabled={loading} defaultValue={number}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>Expiry date</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="expdate" disabled={loading} defaultValue={expdate}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>CVC/CVV</FormLabel>
					          <Input endDecorator={<InfoOutlined />} name="cvc" disabled={loading} defaultValue={cvc}/>
					        </FormControl>

					        <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>
			      		</div>
			      		:
			      		<>
			      			<FormControl sx={{ gridColumn: '1/-1' }}>
					          <FormLabel>Card holder name</FormLabel>
					          <Input placeholder="Enter cardholder's full name" name="name" disabled={loading} defaultValue={name}/>
					        </FormControl>
					        <FormControl sx={{ gridColumn: '1/-1' }}>
					          <FormLabel>Card number</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="number" disabled={loading} defaultValue={number}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>Expiry date</FormLabel>
					          <Input endDecorator={<CreditCardIcon />} name="expdate" disabled={loading} defaultValue={expdate}/>
					        </FormControl>
					        <FormControl>
					          <FormLabel>CVC/CVV</FormLabel>
					          <Input endDecorator={<InfoOutlined />} name="cvc" disabled={loading} defaultValue={cvc}/>
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
			          <Button type="submit" disabled={loading} variant="solid" color="primary">
			            {localStorage.getItem("productInfo") ? 
			            	"Add payment and launch" 
			            	: 
			            	localStorage.getItem("relaunchProduct") ? 
			            		"Update payment and launch"
			            		:
			            		"Save payment"
			           	}
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

			{(regainAccountconfirm.show || bannedSign) && (
				<div id="hidden-box">
					{regainAccountconfirm && (
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
    </div>
	)
}
