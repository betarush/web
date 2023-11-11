import './feedback.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { getUserInfo, createCheckout, createCustomerPayment } from "../../../apis/user"
import { depositAmount, regainAmount } from "../../../info"
import { useParams } from 'react-router-dom';
import { resizePhoto } from 'geottuse-tools';
import { FaBan } from "react-icons/fa"
import { ImHappy } from "react-icons/im"
import { BsArrowRepeat, BsCheckCircle } from "react-icons/bs"

// material ui components
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// components
import Header from '../../../components/mobile/header'

import { rateCustomer } from '../../../apis/user'
import { getProductFeedbacks } from '../../../apis/product'

const LOGO_URL = process.env.REACT_APP_LOGO_URL
let sessionId = ""

if (window.location.search.includes("session_id")) {
	const urlParams = new URLSearchParams(window.location.search)
	
	sessionId = urlParams.get('session_id')
}

export default function Feedbacks(props) {
	const { id } = useParams()

	const [userId, setUserid] = useState('')

	const [feedbacks, setFeedbacks] = useState([])

	const [name, setName] = useState('')
	const [image, setImage] = useState({ name: '', width: 0, height: 0 })
	const [deposited, setDeposited] = useState({ show: false, productId: -1 })
	const [paymentDone, setPaymentdone] = useState({ brand: "", last4: "" })

	// hidden boxes
	const [warningReasonbox, setWarningreasonbox] = useState({ show: false, reason: '', info: {}, errorMsg: "" })
	const [confirmDeposit, setConfirmdeposit] = useState({ show: false, productId: -1, loading: false })
	const [regainAccountconfirm, setRegainaccountconfirm] = useState({ show: false, cardInfo: {}, loading: false })
	const [bannedSign, setBannedsign] = useState(false)

	// popup boxes
	const [whyFee, setWhyfee] = useState(false)

	const [loaded, setLoaded] = useState(false)

	const getTheUserInfo = () => {
		const userId = localStorage.getItem("id")

		getUserInfo({ userId })
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setUserid(userId)
					setPaymentdone(res.paymentDone)
				}
			})
	}
	const getTheProductFeedbacks = () => {	
		const data = { productId: id }

		getProductFeedbacks(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setFeedbacks(res.feedbacks)
					setName(res.name)
					setImage(res.logo)
					setDeposited(res.deposited)
					setUserid(userId)
					setLoaded(true)

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('feedback', { id: userId, mobile: true });
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const deposit = productId => {
		setConfirmdeposit({ ...confirmDeposit, loading: true })

		if (paymentDone.brand) {
			const data = { userId, productId }

			createCustomerPayment(data)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						window.location = "/seefeedbacks"
					}
				})
		} else {
			const data = { userId, redirect: "seefeedbacks" }

			createCheckout(data)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}
					
					throw res
				})
				.then((res) => {
					if (res) {
						localStorage.setItem("productId", productId)

						window.location = res.url
					}
				})
				.catch((err) => {

				})
		}
	}
	const rateTheCustomer = (testerId, type, index) => {
		if (type == "warn" || warningReasonbox.info.type == "warn") {
			if (!warningReasonbox.show) {
				setWarningreasonbox({ ...warningReasonbox, show: true, reason: '', info: { testerId, type, index } })
			} else {
				const { info, reason } = warningReasonbox

				if (reason) {
					const data = { productId: id, testerId: info.testerId, type: info.type, reason }
					const newFeedbacks = [...feedbacks]

					rateCustomer(data)
						.then((res) => {
							if (res.status == 200) {
								return res.json()
							}

							throw res
						})
						.then((res) => {
							if (res) {
								newFeedbacks.splice(info.index, 1)

								if (newFeedbacks.length > 0) {
									setFeedbacks(newFeedbacks)
								} else {
									window.location = '/main'
								}
							}
						})
				} else {
					setWarningreasonbox({ ...warningReasonbox, errorMsg: "Please include a reason" })
				}
			}
		} else {
			const data = { productId: id, testerId, type, reason: "" }
			const newFeedbacks = [...feedbacks]

			rateCustomer(data)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						newFeedbacks.splice(index, 1)

						if (newFeedbacks.length > 0) {
							setFeedbacks(newFeedbacks)
						} else {
							window.location = '/main'
						}
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
							window.location = "/feedback"
						}
					})
			} else {
				const data = { userId, redirect: "feedback" }

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
				productId: localStorage.getItem("productId") ? localStorage.getItem("productId") : null,
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
						window.location = "/feedback"
					}
			})
		} else {
			getTheUserInfo()
		}
	}, [])

	useEffect(() => {
		if (userId) getTheProductFeedbacks()
	}, [userId])

	return (
		<div id="mobile-feedback">
			<Header
				regainAccount={() => regainTheAccount()}
			/>

			{loaded ? 
				<div id="feedbacks">
					<div className="product">
						<div className="info">
							<div className="logo" style={resizePhoto(image, 100, 100)}>
								<img src={LOGO_URL + '/' + image.name}/>
							</div>
						</div>

						<div id="feedbacks-header">
							Advices for <strong>{name}</strong>
							<br/>
							{(deposited && feedbacks.length > 0) && <div style={{ fontSize: 20 }}>(Please save the good advices somewhere)</div>}
						</div>

						{!deposited && (
							<div id="feedbacks-rules-header">
								<br/><br/>
								Yes! Woohoo. You have {feedbacks.length} advice(s) from test users
								<br/>
								Deposit only ${depositAmount.toFixed(2)} to see the advices
								<br/><br/>
								You will get a refund of the leftover deposit in a week if you possibly don't receive up to 5 advices

								<div id="deposit-button" onClick={() => setConfirmdeposit({ show: true, productId: id })}>Deposit</div>
							</div>
						)}

						{deposited && (
							feedbacks.length > 0 ? 
									<div id="product-feedbacks">
									{feedbacks.map((feedback, index) => (
										<div className="feedback" key={feedback.key}>
											<div className="feedback-header"><strong>Advice: </strong> {feedback.advice}</div>

											<Stack>
												<div className="feedback-actions-header">Rate this tester's advice <strong>(anonymously)</strong></div>
												<div className="feedback-actions">
													<div className="feedback-action" onClick={() => rateTheCustomer(feedback.testerId, 'warn', index)}>
														<div className="feedback-action-icon"><FaBan style={{ color: 'red', height: '100%', width: '100%' }}/></div>
														<div className="feedback-action-header">Warn to be banned</div>
													</div>
													<div className="feedback-action" onClick={() => rateTheCustomer(feedback.testerId, 'good', index)}>
														<div className="feedback-action-icon"><BsCheckCircle style={{ color: 'green', height: '100%', width: '100%' }}/></div>
														<div className="feedback-action-header">Good advice</div>
													</div>
													<div className="feedback-action" onClick={() => rateTheCustomer(feedback.testerId, 'nice', index)}>
														<div className="feedback-action-icon"><ImHappy style={{ color: 'blue', height: '100%', width: '100%' }}/></div>
														<div className="feedback-action-header">Very nice advice</div>
													</div>
												</div>
											</Stack>
										</div>
									))}
								</div>
								:
								<div id="no-result">No Results</div>
						)}
					</div>
				</div>
				:
				<div style={{ height: 20, margin: '10% auto', width: 20 }}>
					<ClipLoader color="black" size={20}/>
				</div>
			}

			{(
				warningReasonbox.show || confirmDeposit.show || regainAccountconfirm.show || bannedSign ||
				
				whyFee
			) && (
				<>
					{(warningReasonbox.show || confirmDeposit.show || regainAccountconfirm.show || bannedSign) && (
						<div id="hidden-box">
							{warningReasonbox.show && (
								<div id="reject-box">
									<div id="reject-header">Why are you warning this tester to be banned ?</div>

									<textarea id="reject-input" maxlength="200" onChange={e => setWarningreasonbox({ ...warningReasonbox, reason: e.target.value })} value={warningReasonbox.reason}/>

									<div className="errormsg">{warningReasonbox.errorMsg}</div>

									<div id="actions">
										<div className="action" onClick={() => setWarningreasonbox({ ...warningReasonbox, show: false, reason: '' })}>Cancel</div>
										<div className="action" onClick={() => rateTheCustomer()}>Submit</div>
									</div>
								</div>
							)}
							{confirmDeposit.show && (
								<div id="confirm-deposit-box" style={confirmDeposit.loading ? { opacity: 0.5 } : { opacity: 1 }}>
									<div id="confirm-deposit-header">Deposit detail</div>

									{paymentDone.brand && (
										<div id="confirm-deposit-card-info">
											<div id="card-icon"><img src="/visa.png"/></div>
											<div id="card-header">****{paymentDone.last4}</div>
										</div>
									)}

									<div id="confirm-deposit-details">
										<div className="confirm-deposit-detail"><strong>Total:</strong> ${depositAmount.toFixed(2)}</div>
										<div className="confirm-deposit-detail">
											<strong>Service fee:</strong> $5.00
											<strong className="confirm-deposit-detail-why" onClick={() => setWhyfee(true)}>?</strong>
										</div>
										<div className="confirm-deposit-detail"><strong>Total:</strong> ${(depositAmount + 5).toFixed(2)}</div>
									</div>

									<div id="actions">
										<div className="action" onClick={() => {
											if (!confirmDeposit.loading) {
												setConfirmdeposit({ ...confirmDeposit, show: false, productId: -1 })
											}
										}}>Cancel</div>
										<div className="action" onClick={() => {
											if (!confirmDeposit.loading) {
												deposit(confirmDeposit.productId)
											}
										}}>Deposit now</div>
									</div>

									<div id="poweredby">
										<div id="poweredby-header">Powered by </div>
										<div id="stripe-icon"><img src="/stripe.png"/></div>
									</div>

									{confirmDeposit.loading && (
										<div style={{ height: 20, margin: '5% auto', width: 20 }}>
											<ClipLoader color="black" size={20}/>
										</div>
									)}
								</div>
							)}
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

					{(whyFee) && (
						<div id="popup-box">
							{whyFee && (
								<div id="whyfee-box">
									<div id="whyfee-header">
										The service fee is for us to run the platform
									</div>

									<div id="whyfee-button" onClick={() => setWhyfee(false)}>Ok</div>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</div>
	)
}
