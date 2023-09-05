import './earnings.scss';
import { useEffect, useState } from 'react';
import { getUserInfo, getBankaccountInfo, submitBankaccountInfo, getEarnings } from '../../apis/user'

// components
import Header from '../components/header'

export default function Earnings() {
	const [userId, setUserid] = useState('')

	const [line1, setLine1] = useState('1111 Dundas Steet E')
	const [zipcode, setZipcode] = useState('M4M3H5')
	const [dob, setDob] = useState('07301996')
	const [firstName, setFirstname] = useState('Kevin')
	const [lastName, setLastname] = useState('Mai')
	const [country, setCountry] = useState('CA')
	const [currency, setCurrency] = useState('usd')
	const [routingNumber, setRoutingnumber] = useState('110000000')
	const [accountNumber, setAccountnumber] = useState('000123456789')

	const [bankaccountDone, setBankaccountdone] = useState(false)
	const [earnings, setEarnings] = useState(0.0)
	const [earnedBox, setEarnedbox] = useState({ show: false, earned: 0.0 })

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
	const submitTheBankaccountInfo = () => {
		if (line1 && zipcode && dob && firstName && lastName && country && currency && routingNumber && accountNumber) {
			const data = { userId, line1, zipcode, dob, firstName, lastName, country, currency, routingNumber, accountNumber }

			submitBankaccountInfo(data)
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

			{earnings > 0 && (
				<>
					<div id="get-earnings" onClick={() => getTheEarnings()}>Get earnings now</div>

					<br/>
					Or
				</>
			)}

			{bankaccountDone && <div id="earnings-header">Update your bank information below</div>}

			<div id="form">
				<div id="header">Your bank account info (to get your earnings)</div>

				<div className="form-input">
					<div className="input-header">Enter your address line 1:</div>
					<input class="input" placeholder="Address line #1" type="text" onChange={e => setLine1(e.target.value)} value={line1}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter your Zipcode:</div>
					<input class="input" placeholder="Zipcode" type="text" onChange={e => setZipcode(e.target.value)} value={zipcode}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter your Date of birth:</div>
					<input class="input" placeholder="DDMMYYYY" type="text" onChange={e => setDob(e.target.value)} value={dob}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter your first name:</div>
					<input class="input" placeholder="First name" type="text" onChange={e => setFirstname(e.target.value)} value={firstName}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter your last name:</div>
					<input class="input" placeholder="Last name" type="text" onChange={e => setLastname(e.target.value)} value={lastName}/>
				</div>

				<div className="form-input">
					<div className="input-header">Enter country:</div>
					<input class="input" placeholder="CA" type="text" onChange={e => setCountry(e.target.value)} value={country}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter currency:</div>
					<input class="input" placeholder="CAD" type="text" onChange={e => setCurrency(e.target.value)} value={currency}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter your routing number:</div>
					<input class="input" placeholder="Routing number" type="text" onChange={e => setRoutingnumber(e.target.value)} value={routingNumber}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter your account number:</div>
					<input class="input" placeholder="Account number" type="text" onChange={e => setAccountnumber(e.target.value)} value={accountNumber}/>
				</div>

				<div id="errormsg">{errorMsg}</div>

				<div id="submit" onClick={() => submitTheBankaccountInfo()}>Get earnings</div>
			</div>

			{earnedBox.show && (
				<div id="hidden-box">
					<div id="earned-box">
						<div id="earned-header">
							Yay! Your have earned ${earnedBox.earned.toFixed(2)}
							<br/><br/>
							Thank you for your contribution
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
