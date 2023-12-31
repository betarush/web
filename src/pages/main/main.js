import './main.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { resizePhoto } from 'geottuse-tools';
import { depositAmount, regainAmount } from "../../info"
import { getUserInfo, getPaymentInfo, createCheckout, createCustomerPayment } from '../../apis/user'
import { getUntestedProducts, getTestingProducts, getMyProducts, tryProduct, relistProduct } from '../../apis/product'
import { submitFeedback } from '../../apis/producttesting'

// material ui components
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/joy/Divider';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import BuildIcon from '@mui/icons-material/Build';
import Button from '@mui/material/Button';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import PersonIcon from '@mui/icons-material/Person';

// components
import Header from '../../components/header'

const LOGO_URL = process.env.REACT_APP_LOGO_URL
let sessionId = ""

if (window.location.search.includes("session_id")) {
	const urlParams = new URLSearchParams(window.location.search)
	
	sessionId = urlParams.get('session_id')
}

export default function Main() {
	const [userId, setUserid] = useState('')
	const [isCreator, setIscreator] = useState(false)

	const [products, setProducts] = useState([])
	const [offset, setOffset] = useState(0)

	const [viewType, setViewtype] = useState('')

	const [intro, setIntro] = useState(false)
	const [userWrite, setUserwrite] = useState({ show: false, advice: '', id: null, index: -1, amountSpent: 0, loading: false })
	const [relaunch, setRelaunch] = useState({ show: false, cardInfo: {}, productId: null, loading: false })
	const [regainAccountconfirm, setRegainaccountconfirm] = useState({ show: false, cardInfo: {}, loading: false })
	const [bannedSign, setBannedsign] = useState(false)

	const [bankaccountDone, setBankaccountdone] = useState(false)
	const [paymentDone, setPaymentdone] = useState({ brand: "", last4: "" })
	const [loaded, setLoaded] = useState(false)
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
					setBankaccountdone(res.bankaccountDone)
					setUserid(id)
					setIscreator(res.isCreator)

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('main', { id, web: true });
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const getTheUntestedProducts = start => {
		const data = { userId, offset: start ? 0 : offset }

		if (!start) {
			setLoading(true)
		} else {
			setLoaded(false)
		}

		getUntestedProducts(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					if (start) {
						setProducts(res.products)
					} else {
						setProducts([...products, ...res.products])
					}

					setOffset(res.offset)
					setViewtype('untested')

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('untested', { id: userId, web: true });

					if (start) {
						setLoaded(true)
					} else {
						setLoading(false)
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
	const getTheTestingProducts = start => {
		const data = { userId, offset: start ? 0 : offset }

		if (!start) {
			setLoading(true)
		} else {
			setLoaded(false)
		}

		getTestingProducts(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					if (start) {
						setProducts(res.products)
					} else {
						setProducts([...products, ...res.products])
					}
					
					setOffset(res.offset)
					setViewtype('testing')

					if (start) {
						setLoaded(true)
					} else {
						setLoading(false)
					}

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('testing', { id: userId, web: true });
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})	
	}
	const getTheMyProducts = start => {
		const data = { userId, offset: start ? 0 : offset }

		if (!start) {
			setLoading(true)
		} else {
			setLoaded(false)
		}

		getMyProducts(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					if (start) {
						setProducts(res.products)
					} else {
						setProducts([...products, ...res.products])
					}
					
					setOffset(res.offset)
					setViewtype('myproducts')

					if (start) {
						setLoaded(true)
					} else {
						setLoading(false)
					}

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('myprojects', { id: userId, web: true });
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const tryTheProduct = (index, productId, link) => {
		const data = { userId, productId }
		const newProducts = [...products]

		tryProduct(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					if (res.msg) {
						newProducts[index].trying = true

						setProducts(newProducts)

						if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('untested', { id: userId, productId, web: true });

						setTimeout(function () {
							getTheTestingProducts(true)
							window.open("https://" + link)
						}, 2000)
					} else {
						setBannedsign(true)
					}
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(({ status }) => {
						console.log(status)
					})
				}
			})
	}
	const relaunchTheProduct = productId => {
		relistProduct({ productId })
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					localStorage.setItem("viewMyProducts", "true")

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('relaunch', { id: userId, productId: relaunch.productId, web: true });
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
	const submitTheFeedback = () => {
		setUserwrite({ ...userWrite, loading: true })

		const { advice, id, index } = userWrite

		if (advice) {
			const data = { userId, testingId: id, advice }
			const newProducts = [...products]

			submitFeedback(data)
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
			setUserwrite({ ...userWrite, errorMsg: 'You need to write an advice' })
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
							window.location = "/main"
						}
					})
			} else {
				const data = { userId, redirect: "main" }

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
						window.location = "/main"
					}
			})
		} else {
			getTheUserInfo()

			if (localStorage.getItem("testerIntro")) {
				localStorage.removeItem("testerIntro")

				setIntro(true)
			}
		}
	}, [])

	useEffect(() => {
		if (userId) {
			if (localStorage.getItem("viewMyProducts")) {
				localStorage.removeItem("viewMyProducts")

				getTheMyProducts(true)
			} else {
				getTheUntestedProducts(true)
			}
		}
	}, [userId])

	return (
		<div id="main">
			<Header
				regainAccount={() => regainTheAccount()}
			/>

			<div id="main-body">
				<div id="page-navs">
					<div className="page-nav" onClick={() => getTheUntestedProducts(true)}>
						<div className="row">
							<ListItemDecorator>
	              <BuildIcon/>
	            </ListItemDecorator>
							<div className="column">Untested by you</div>
						</div>
					</div>
					<div className="page-nav" onClick={() => getTheTestingProducts(true)}>
						<div className="row">
							<ListItemDecorator>
	              <SpeedRoundedIcon/>
	            </ListItemDecorator>
							<div className="column">Testing by you</div>
						</div>
					</div>
					<div className="page-nav" onClick={() => getTheMyProducts(true)}>
						<div className="row">
							<ListItemDecorator>
	              <PersonIcon/>
	            </ListItemDecorator>
							<div className="column">Your products</div>
						</div>
					</div>
				</div>

				{loaded ? 
					products.length > 0 ? 
						<div id="products" onScroll={(e) => {
							const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

							if (bottom) {
								if (viewType == "untested") {
									getTheUntestedProducts()
								} else if (viewType == "testing") {
									getTheTestingProducts()
								} else {
									getTheMyProducts()
								}
							}
						}}>
							{products.map((product, index) => (
								<div className="product" key={product.key}>
									<div className="product-row">
										<div className="image" style={resizePhoto(product.logo, 100, 100)}>
											<img src={LOGO_URL + '/' + product.logo.name}/>
										</div>

										<div className="desc">
											<div style={{ fontWeight: 'bold' }}>{product.name}</div><br/>
											{product.info}
										</div>
									</div>

									<Stack>
										{viewType == 'untested' ? 
											<div className="column">
												<div className="info">
													{!product.trying && <div className="header">{product.numLeftover} people left can try</div>}

													{!product.trying ? 
														<div disabled={product.trying} className="product-action" onClick={() => tryTheProduct(index, product.id, product.link)}>Test first then earn $$</div>
														:
														<div className="header">
															Come back to give an advice
															<br/><br/>
															redirecting to website....
														</div>
													}
												</div>
											</div>
											:
											<div className="column">
												{viewType == "testing" ? 
													<div className="info">
														{!product.gave_feedback && (
															<div>
																<div className="product-action" style={{ marginBottom: 10 }} onClick={() => setUserwrite({ ...userWrite, show: true, input: '', id: product.id, index, amountSpent: product.amountSpent, loading: false })}>Give advice & Earn ${product.reward.toFixed(2)}</div>
																<div className="product-action" onClick={() => window.open("https://" + product.link)}>Go To Product</div>
															</div>
														)}
													</div>
													:
													<div className="info-container">
														{product.numLeftover > 0 ? 
															<>
																{product.deposited && <div className="header">Amount spent: ${product.amountSpent.toFixed(2)}</div>}

																{product.numTesting > 0 && (
																	<div className="header">
																		{product.numTesting + " people testing"}
																	</div>
																)}

																{product.numLeftover > 0 && (
																	<div className="header">
																		{product.numLeftover + " people left can try"}
																	</div>
																)}

																{product.numFeedback > 0 && (
																	<div className="header">
																		{product.numFeedback} people gave feedback<br/>
																		<div className="product-action" onClick={() => window.location = '/feedback/' + product.id}>See advice(s)</div>
																	</div>
																)}

																{product.numRewarded > 0 && <div className="header">{product.numRewarded} people rewarded</div>}
															</>
															:
															<>
																<div className="header">
																	{5 - product.numLeftover} people rewarded
																	<div className="relaunch" onClick={() => relaunchTheProduct(product.id)}>Relaunch for testers</div>
																</div>

																{product.numFeedback > 0 && (
																	<div className="header">
																		{product.numFeedback} people gave feedback<br/>
																		<div className="product-action" onClick={() => window.location = '/feedback/' + product.id}>See advice(s)</div>
																	</div>
																)}
															</>
														}
													</div>
												}
											</div>
										}
									</Stack>
								</div>
							))}

							{loading && (
								<div style={{ height: 20, margin: '10px auto', width: 20 }}>
									<ClipLoader color="black" size={20}/>
								</div>
							)}
						</div>
						:
						<div id="no-result">No Results</div>
					:
					<div style={{ height: 20, margin: '10% auto', width: 20 }}>
						<ClipLoader color="black" size={20}/>
					</div>
				}
			</div>
			
			{(intro || userWrite.show || relaunch.show || regainAccountconfirm.show || bannedSign) && (
				<div id="hidden-box">
					{intro && (
						<div id="intro">
							<div id="intro-header">Welcome to BetaRush</div>

							<div className="intro-mini-header">
								BetaRush enables you to earn money
								by helping creators ensure QA for their product.
								<br/><br/>
								Try products and write good QA advices.
								<br/><br/>
								You will earn $2.00 for every good advice you submit
							</div>

							<div id="intro-actions">
								<div className="intro-action" onClick={() => setIntro(false)}>OK</div>
							</div>
						</div>
					)}
					{userWrite.show && (
						<div id="feedback-box">
							<div id="feedback-header">
								What's your advice
								<br/>
								<div style={{ fontSize: 15 }}>
									(Please write a proper advice or else you'll be warn first time to be banned)
								</div>
								<div style={{ fontSize: 15 }}>
									(You'll have to pay $10.00 to get unbanned)
								</div>
							</div>
							<textarea id="feedback-input" maxlength="500" disabled={userWrite.loading} placeholder="Write a good advice" onChange={e => setUserwrite({ ...userWrite, advice: e.target.value })} value={userWrite.advice}/>

							<div className="errormsg">{userWrite.errorMsg}</div>

							<div id="actions">
								<div className="action" onClick={() => !userWrite.loading && setUserwrite({ ...userWrite, show: false, advice: '' })}>Cancel</div>
								<div className="action" onClick={() => !userWrite.loading && submitTheFeedback()}>Submit & Earn</div>
							</div>
						</div>
					)}
					{relaunch.show && (
						<div id="relaunch-box">
							<div id="relaunch-header">Resubmit payment summary</div>

							<div className="relaunch-div"/>

							<div id="relaunch-infos">
								<div className="relaunch-info-header"><strong>Subtotal:</strong> ${depositAmount.toFixed(2)}</div>
								<div className="relaunch-info-header"><strong>Service fee:</strong> $5.00</div>

								<div className="relaunch-div"/>

								<div className="relaunch-info-header"><strong>Total:</strong> ${(depositAmount + 5).toFixed(2)}</div>
							</div>

							{relaunch.cardInfo.last4 && (
			      		<div id="card-info">
			      			<div id="type">
			      				{relaunch.cardInfo.name == "Visa" && <img src="/visa.png"/>}
			      				{relaunch.cardInfo.name == "MasterCard" && <img src="/mastercard.png"/>}
			      				{relaunch.cardInfo.name == "American Express" && <img src="/amex.jpg"/>}
			      				{relaunch.cardInfo.name == "Discover" && <img src="/discover.jpg"/>}
			      				{relaunch.cardInfo.name == "Diners Club" && <img src="/dinersclub.png"/>}
			      				{relaunch.cardInfo.name == "JCB" && <img src="/jcb.jpg"/>}
			      				{relaunch.cardInfo.name == "UnionPay" && <img src="/unionpay.png"/>}
			      			</div>
			      			<div id="header">
			      				{relaunch.cardInfo.name}
			      				<br/>
			      				*********{relaunch.cardInfo.last4}
			      			</div>
			      		</div>
			      	)}

							<div id="actions">
								<div className="action" style={{ opacity: relaunch.loading ? 0.5 : 1 }} onClick={() => !relaunch.loading && setRelaunch({ show: false, cardInfo: {} })}>Cancel</div>
								<div className="action" style={{ opacity: relaunch.loading ? 0.5 : 1 }} onClick={() => !relaunch.loading && relaunchTheProduct()}>Pay and launch again</div>
							</div>

							{relaunch.loading && (
								<div style={{ height: 20, margin: '5px auto', width: 20 }}>
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
		</div>
	)
}