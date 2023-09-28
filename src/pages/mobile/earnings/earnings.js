import './earnings.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { getUserInfo, getBankaccountInfo, submitBankaccountInfo, getEarnings } from '../../../apis/user'

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
import Stack from '@mui/material/Stack';
import StackButton from '@mui/material/Button';

// components
import Header from '../../../components/mobile/header'

let stripe = require('stripe')(process.env.REACT_APP_STRIPE_KEY);

export default function Earnings() {
	const [userId, setUserid] = useState('')

	const [line1, setLine1] = useState(process.env.REACT_APP_MODE == 'dev' ? '1111 Dundas Steet E' : '')
	const [zipcode, setZipcode] = useState(process.env.REACT_APP_MODE == 'dev' ? 'M4M3H5' : '')
	const [dob, setDob] = useState(process.env.REACT_APP_MODE == 'dev' ? '07301996' : '')
	const [firstName, setFirstname] = useState(process.env.REACT_APP_MODE == 'dev' ? 'Kevin' : '')
	const [lastName, setLastname] = useState(process.env.REACT_APP_MODE == 'dev' ? 'Mai' : '')
	const [country, setCountry] = useState(process.env.REACT_APP_MODE == 'dev' ? 'CA' : '')
	const [currency, setCurrency] = useState(process.env.REACT_APP_MODE == 'dev' ? 'cad' : '')
	const [routingNumber, setRoutingnumber] = useState(process.env.REACT_APP_MODE == 'dev' ? '11000000' : '')
	const [accountNumber, setAccountnumber] = useState(process.env.REACT_APP_MODE == 'dev' ? '000123456789' : '')

	const [bankInfo, setBankinfo] = useState('')

	const [bankaccountDone, setBankaccountdone] = useState(false)
	const [earnings, setEarnings] = useState(0.0)
	const [earnedBox, setEarnedbox] = useState({ show: false, earned: 0, pending: 0 })

	const [loaded, setLoaded] = useState(false)
	const [loading, setLoading] = useState(false)
	const [gettingMoney, setGettingmoney] = useState(false)
	const [errorMsg, setErrormsg] = useState('')

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
					setBankaccountdone(res.bankaccountDone)
					setEarnings(res.earnings)
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
	const getTheBankaccountInfo = () => {
		const id = localStorage.getItem("id")
		const data = { userId: id }

		getBankaccountInfo(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					if (res.bank) {
						setBankinfo(res.bank)
					}

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
	const submitTheBankaccountInfo = async event => {
		event.preventDefault()

		const data = new FormData(event.currentTarget);
		const line1 = data.get('line1'), zipcode = data.get('zipcode'), dob = data.get('dob')
		const firstName = data.get('firstName'), lastName = data.get('lastName'), country = data.get('country')
		const currency = data.get('currency'), routingNumber = data.get('routingNumber'), accountNumber = data.get('accountNumber')

		if (line1 && zipcode && dob && firstName && lastName && country) {
			let bankaccount = await stripe.tokens.create({
				bank_account: {
					country,
					currency,
					account_holder_name: firstName + " " + lastName,
					account_holder_type: "individual",
					routing_number: routingNumber,
					account_number: accountNumber
				}
			})

			const json = { userId, line1, zipcode, dob, firstName, lastName, country, token: bankaccount.id }

			setLoading(true)

			submitBankaccountInfo(json)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						if (earnings > 0) {
							getTheEarnings()

							setLoading(false)
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
		} else {
			if (!line1) {
				setErrormsg("Please enter your address line 1")
			}

			if (!zipcode) {
				setErrormsg("Please enter your zipcode")
			}

			if (!dob) {
				setErrormsg("Please enter your date of birth")
			}

			if (!firstName) {
				setErrormsg("Please enter your first name")
			}

			if (!lastName) {
				setErrormsg("Please enter your last name")
			}

			if (!country) {
				setErrormsg("Please enter the country")
			}

			if (!currency) {
				setErrormsg("Please enter the currency")
			}

			if (!routingNumber) {
				setErrormsg("Please enter your routing number")
			}

			if (!accountNumber) {
				setErrormsg("Please enter your account number")
			}
		}
	}
	const getTheEarnings = () => {
		const data = { userId }

		setGettingmoney(true)

		getEarnings(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					if (!res.leftover) setEarnings(0.0)
					setEarnedbox({ show: true, earned: res.earnedAmount, pending: res.pendingEarned, leftover: res.leftover })

					setTimeout(function () {
						setEarnedbox({ show: false, earned: 0.0, pending: false })
						setGettingmoney(false)

						if (!res.leftover) {
							window.location = "/main"
						} else {
							window.location = "/earnings"
						}
					}, (res.leftover ? 5000 : 3000))
				}
			})
	}

	useEffect(() => {
		getTheUserInfo()
	}, [])

	useEffect(() => {
		if (userId) getTheBankaccountInfo()
	}, [userId])

	return (
		<div id="mobile-earnings">
			<Header/>

			{loaded ? 
				<>
					{(bankaccountDone && earnings > 0) && (
						<>
							{gettingMoney && (
								<>
									<div style={{ height: 20, margin: '10px auto', width: 20 }}>
										<ClipLoader color="black" size={20}/>
									</div>
									<div style={{ textAlign: 'center' }}>
										Transferring your money to your bank account
										<br/>
										Please wait a moment...
									</div>
								</>
							)}

							<Stack>
								<StackButton style={{ margin: '50px auto 0 auto', width: 200 }} variant="contained" disabled={gettingMoney} onClick={() => getTheEarnings()}>Get earnings now</StackButton>
							</Stack>

							{bankInfo.last4 && (
			      		<div>
				      		<div id="bank-info">
				      			<div className="info">
				      				{bankInfo.name}
				      				<br/>
				      				*********{bankInfo.last4}
				      			</div>
				      		</div>
				      		<div id="bank-info-header">Or enter a new account below to update</div>
				      	</div>
			      	)}
						</>
					)}

					<Card
			      variant="outlined"
			      sx={{
			        maxHeight: 'max-content',
			        maxWidth: 500,
			        mx: 'auto',
			        // to make the demo resizable
			        overflow: 'auto'
			      }}
			      style={{ marginTop: 10 }}
			    >
			      <Typography level="title-lg" startDecorator={<InfoOutlined />}>
			        Your bank account info
			      </Typography>
			      <Typography>(to get your earnings)</Typography>
			      <Divider inset="none" />
			      <Box component="form" onSubmit={submitTheBankaccountInfo} noValidate sx={{ mt: 1 }}>
			      	<CardContent
				        sx={{
				          display: 'grid',
				          gridTemplateColumns: 'repeat(2, minmax(80px, 1fr))',
				          gap: 1.5,
				        }}
				      >
				      	<FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your address line 1:</FormLabel>
				          <Input placeholder="Address line #1" name="line1" disabled={loading || gettingMoney} defaultValue={line1}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your Zipcode:</FormLabel>
				          <Input placeholder="Zipcode" name="zipcode" disabled={loading || gettingMoney} defaultValue={zipcode}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Ener your Date of Birth:</FormLabel>
				          <Input placeholder="MMDDYY" name="dob" disabled={loading || gettingMoney} defaultValue={dob}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your first name:</FormLabel>
				          <Input placeholder="Enter your first name" name="firstName" disabled={loading || gettingMoney} defaultValue={firstName}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your last name:</FormLabel>
				          <Input placeholder="Enter your last name" name="lastName" disabled={loading || gettingMoney} defaultValue={lastName}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter country:</FormLabel>
				          <Input placeholder="Enter country, etc: CA" name="country" disabled={loading || gettingMoney} defaultValue={country}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter currency</FormLabel>
				          <Input placeholder="Enter currency, etc: cad" name="currency" disabled={loading || gettingMoney} defaultValue={currency}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your routing number:</FormLabel>
				          <Input placeholder="Routing number" name="routingNumber" disabled={loading || gettingMoney} defaultValue={routingNumber}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your account number:</FormLabel>
				          <Input placeholder="Account number" name="accountNumber" disabled={loading || gettingMoney} defaultValue={accountNumber}/>
				        </FormControl>

				        <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>

				        <CardActions sx={{ gridColumn: '1/-1' }}>
				          <Button type="submit" disabled={loading || gettingMoney} variant="solid" color="primary">
				            {earnings > 0 ? "Save and get earnings" : "Save bank information"}
				            <div style={{ marginLeft: 10 }}><LockOutlinedIcon /></div>
				          </Button>
				        </CardActions>

			        
				      </CardContent>

				      {loading && (
	            	<div style={{ height: 25, margin: '20px auto', width: 25 }}>
									<ClipLoader color="black" size={20}/>
								</div>
	            )}

	            <div className="row">
				      	<div style={{ display: 'flex', flexDirection: 'row' }}>
				        	<div className="column">Powered by </div>
				        	<img src="/stripe.png" style={{ height: 50, marginLeft: 10, width: 50 }}/>
				        </div>
				      </div>
				     </Box>
			    </Card>
				</>
				:
				<div style={{ height: 20, margin: '10% auto', width: 20 }}>
					<ClipLoader color="black" size={20}/>
				</div>
			}

	    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
	      {'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}
	    </Typography>

	    {earnedBox.show && (
	      <div id="hidden-box">
         	<div id="earned-box">
           	<div id="earned-header">
           		{earnedBox.earned > 0 && "Yay! You've earned $" + earnedBox.earned.toFixed(2)}
           		{earnedBox.pending && (
           			<div style={{ fontSize: 20, padding: '0 5%' }}>
           				<br/><br/>
           				We are processing your withdrawal. You will get an e-mail to withdraw your money soon.
           			</div>
           		)}

           		{earnedBox.leftover && <div style={{ fontSize: 20, padding: '5%' }}>We only do 5 money transfers at a time.<br/>You still have more transfers</div>}

            	<br/><br/>

            	Thank you for your contribution
           	</div>
         	</div>
	     	</div>
	    )}
    </div>
	)
}
