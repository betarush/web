import './earnings.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { getUserInfo, getBankaccountInfo, submitBankaccountInfo, getEarnings } from '../../apis/user'

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
import Header from '../../components/header'

let stripe = require('stripe')('sk_test_51NmA1PFqjgkiO0WHxOmFjOzgwHorLyTxjyWJ926HiBK10KHnTnh7q8skEmQ5c0NpHxI3mk2fbejMASjazhPlmGkv00L98uIq8G');

export default function Earnings() {
	const [userId, setUserid] = useState('')

	const [line1, setLine1] = useState('1111 Dundas Steet E')
	const [zipcode, setZipcode] = useState('M4M3H5')
	const [dob, setDob] = useState('07301996')
	const [firstName, setFirstname] = useState('Kevin')
	const [lastName, setLastname] = useState('Mai')
	const [country, setCountry] = useState('CA')
	const [currency, setCurrency] = useState('cad')
	const [routingNumber, setRoutingnumber] = useState('11000000')
	const [accountNumber, setAccountnumber] = useState('000123456789')

	// real data
	// const [line1, setLine1] = useState('275 Broadview Avenue')
	// const [zipcode, setZipcode] = useState('M4M3H5')
	// const [dob, setDob] = useState('07301996')
	// const [firstName, setFirstname] = useState('Kevin')
	// const [lastName, setLastname] = useState('Mai')
	// const [country, setCountry] = useState('CA')
	// const [currency, setCurrency] = useState('cad')
	// const [routingNumber, setRoutingnumber] = useState('000305842')
	// const [accountNumber, setAccountnumber] = useState('5207790')

	const [bankInfo, setBankinfo] = useState('')

	const [bankaccountDone, setBankaccountdone] = useState(false)
	const [earnings, setEarnings] = useState(0.0)
	const [earnedBox, setEarnedbox] = useState({ show: false, earned: 0.0 })

	const [loaded, setLoaded] = useState(true)
	const [loading, setLoading] = useState(false)
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

		getEarnings(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setEarnings(0.0)
					setEarnedbox({ show: true, earned: res.earnedAmount })

					setTimeout(function () {
						setEarnedbox({ show: false, earned: 0.0 })
						window.location = "/main"
					}, 2000)
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
		<div id="earnings">
			<Header/>

			{loaded ? 
				<>
					{(bankaccountDone && earnings > 0) && (
						<>
							<Stack>
								<StackButton style={{ margin: '50px auto 0 auto', width: 200 }} variant="contained" onClick={() => getTheEarnings()}>Get earnings now</StackButton>
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
				          <Input placeholder="Address line #1" name="line1" disabled={loading} defaultValue={line1}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your Zipcode:</FormLabel>
				          <Input placeholder="Zipcode" name="zipcode" disabled={loading} defaultValue={zipcode}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Ener your Date of Birth:</FormLabel>
				          <Input placeholder="DDMMYY" name="dob" disabled={loading} defaultValue={dob}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your first name:</FormLabel>
				          <Input placeholder="Enter cardholder's full name" name="firstName" disabled={loading} defaultValue={firstName}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your last name:</FormLabel>
				          <Input placeholder="Enter cardholder's last name" name="lastName" disabled={loading} defaultValue={lastName}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter country:</FormLabel>
				          <Input placeholder="Enter country" name="country" disabled={loading} defaultValue={country}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter currency</FormLabel>
				          <Input placeholder="Enter currency" name="currency" disabled={loading} defaultValue={currency}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your routing number:</FormLabel>
				          <Input placeholder="Routing number" name="routingNumber" disabled={loading} defaultValue={routingNumber}/>
				        </FormControl>
				        <FormControl sx={{ gridColumn: '1/-1' }}>
				          <FormLabel>Enter your account number:</FormLabel>
				          <Input placeholder="Account number" name="accountNumber" disabled={loading} defaultValue={accountNumber}/>
				        </FormControl>

				        <Typography component="h1" variant="h6" color="red">{errorMsg}</Typography>

				        <CardActions sx={{ gridColumn: '1/-1' }}>
				          <Button type="submit" disabled={loading} variant="solid" color="primary">
				            {earnings > 0 ? "Save and get earnings" : "Save bank information"}
				            <div style={{ marginLeft: 10 }}><LockOutlinedIcon /></div>
				          </Button>
				        </CardActions>
				      </CardContent>
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
	             Yay! You've earned ${earnedBox.earned.toFixed(2)}
	             <br/><br/>
	             Thank you for your contribution
	           </div>
	         </div>
	       </div>
	     )}
    </div>
	)
}
