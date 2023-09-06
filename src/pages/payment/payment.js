import './payment.scss';
import { useEffect, useState } from 'react';
import { submitPaymentInfo, getPaymentInfo } from '../../apis/user'
import { listProduct } from '../../apis/product'

// components
import Header from '../components/header'

let stripe = require('stripe')('sk_test_51NmA1PFqjgkiO0WHxOmFjOzgwHorLyTxjyWJ926HiBK10KHnTnh7q8skEmQ5c0NpHxI3mk2fbejMASjazhPlmGkv00L98uIq8G');

export default function Payment() {
	const [userId, setUserid] = useState('')

	const [name, setName] = useState('the account')
	const [number, setNumber] = useState('4000000000000007')
	const [cvc, setCvc] = useState('234')
	const [expdate, setExpdate] = useState('122024')

	// real date
	// const [name, setName] = useState('Kevin Hien Luong Mai')
	// const [number, setNumber] = useState('4512238770577855')
	// const [cvc, setCvc] = useState('086')
	// const [expdate, setExpdate] = useState('1123')

	const [errorMsg, setErrormsg] = useState('')

	const [newProduct, setNewproduct] = useState(false)

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
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const submitThePaymentInfo = async() => {
		if (name && number && cvc && expdate) {
			// let card = await stripe.tokens.create({
			// 	card: {
			// 		number: '4000000000000007',
			//     exp_month: '11',
			//     exp_year: '23',
			//     cvc: '123'
			// 	}
			// })
			const data = { userId, name, number, cvc, expdate, token: "tok_bypassPending" }

			submitPaymentInfo(data)
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

			<div id="form">
				<div id="header">Your payment info</div>

				<div className="form-input">
					<div className="input-header">Enter the card holder name:</div>
					<input class="input" placeholder="Card holder name" type="text" onChange={e => setName(e.target.value)} value={name}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter the card number:</div>
					<input class="input" placeholder="Card number" type="text" onChange={e => setNumber(e.target.value)} value={number}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter the card security code (CVC):</div>
					<input class="input" placeholder="Security code" type="text" onChange={e => setCvc(e.target.value)} value={cvc}/>
				</div>
				<div className="form-input">
					<div className="input-header">Enter the card expiry date:</div>
					<input class="input" placeholder="MMYYYY" type="text" onChange={e => setExpdate(e.target.value)} value={expdate}/>
				</div>

				<div id="errormsg">{errorMsg}</div>

				<div id="submit" onClick={() => submitThePaymentInfo()}>{newProduct ? "Submit and launch" : "Save payment info"}</div>
			</div>
		</div>
	)
}
