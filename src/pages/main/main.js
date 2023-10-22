import './main.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { resizePhoto } from 'geottuse-tools';
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

export default function Main() {
	const [userId, setUserid] = useState('')
	const [isCreator, setIscreator] = useState(false)

	const [products, setProducts] = useState([])
	const [offset, setOffset] = useState(0)

	const [viewType, setViewtype] = useState('')

	const [intro, setIntro] = useState(false)
	const [userWrite, setUserwrite] = useState({ show: false, advice: '', feedback: '', id: null, index: -1, amountSpent: 0, loading: false })
	const [relaunch, setRelaunch] = useState({ show: false, cardInfo: {}, productId: null, loading: false })

	const [bankaccountDone, setBankaccountdone] = useState(false)
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
					newProducts[index].trying = true

					setProducts(newProducts)

					if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('untested', { id: userId, productId, web: true });

					setTimeout(function () {
						getTheTestingProducts(true)
						window.open(link)
					}, 2000)
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
		if (!relaunch.show) {
			getPaymentInfo({ userId })
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						setRelaunch({ show: true, cardInfo: res.card, productId })
					}
				})
		} else {
			setRelaunch({ ...relaunch, loading: true })

			relistProduct({ productId: relaunch.productId })
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
	}
	const submitTheFeedback = () => {
		setUserwrite({ ...userWrite, loading: true })

		const { advice, feedback, id, index } = userWrite

		if (advice || feedback) {
			const data = { userId, productId: id, advice, feedback }
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
						setUserwrite({ ...userWrite, show: false, advice: '', feedback: '', id: null, index: -1, loading: false })

						newProducts[index].gave_feedback = true

						setProducts(newProducts)
					}
				})
				.catch((err) => {
					if (err.status == 400) {
						err.json().then(() => {

						})
					}
				})
		} else {
			setUserwrite({ ...userWrite, errorMsg: 'You need to write an advice or feedback' })
		}
	}

	useEffect(() => {
		getTheUserInfo()

		if (localStorage.getItem("testerIntro")) {
			localStorage.removeItem("testerIntro")

			setIntro(true)
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
			<Header/>

			<div id="main-body">
				<div className="page-navs">
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
															Come back to give a QA advice/feedback when you're done testing
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
														<div className="header">{product.earned ? "Earned $" + product.reward + " for trying" : product.gave_feedback && "Waiting for creator to reward you"}</div>

														{!product.gave_feedback && (
															<div>
																<div className="product-action" style={{ marginBottom: 10 }} onClick={() => setUserwrite({ ...userWrite, show: true, input: '', id: product.id, index, amountSpent: product.amountSpent, loading: false })}>Give advice/feedback & Earn ${product.reward.toFixed(2)}</div>
																<div className="product-action" onClick={() => window.open(product.link)}>Go To Product</div>
															</div>
														)}
													</div>
													:
													<div className="info-container">
														{product.numLeftover > 0 ? 
															<>
																<div className="header">Amount spent: ${product.amountSpent.toFixed(2)}</div>

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
																		<div className="reward" onClick={() => window.location = '/feedback/' + product.id}>Reward them</div>
																	</div>
																)}

																{product.numRewarded > 0 && <div className="header">{product.numRewarded} people rewarded</div>}
																{product.numRejected > 0 && <div className="header">{product.numRejected} people rejected</div>}
															</>
															:
															<div className="header">
																{5 - product.numLeftover} people rewarded
																<div className="relaunch" onClick={() => relaunchTheProduct(product.id)}>Relaunch for testers</div>
															</div>
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

			{(intro || userWrite.show || relaunch.show) && (
				<div id="hidden-box">
					{intro && (
						<div id="intro">
							<div id="intro-header">Welcome</div>

							<div className="intro-mini-header">
								We built this platform that enables you to earn some money
								by helping creators improve their product.
								<br/><br/>
								All you have to do is tryout products and write <strong>good QA advices/feedback</strong>.
								<br/><br/>
								You will get rewarded with money if the creator <strong>likes and approves</strong> your <strong>QA advice/feedback</strong> so
								try your best to write good words
								<br/><br/>
								That's it! Enjoy your time making money here:)
							</div>

							<div id="intro-actions">
								<div className="intro-action" onClick={() => setIntro(false)}>OK</div>
							</div>
						</div>
					)}
					{userWrite.show && (
						<div id="feedback-box">
							<div id="feedback-header">What's your advice</div>

							<textarea id="feedback-input" maxlength="500" disabled={userWrite.loading} placeholder="Write a good advice" onChange={e => setUserwrite({ ...userWrite, advice: e.target.value })} value={userWrite.advice}/>
							
							<div id="feedback-header">What's your feedback</div>

							<textarea id="feedback-input" maxlength="500" disabled={userWrite.loading} placeholder="Write a good feedback" onChange={e => setUserwrite({ ...userWrite, feedback: e.target.value })} value={userWrite.feedback}/>

							<div className="errormsg">{userWrite.errorMsg}</div>

							<div id="actions">
								<div className="action" onClick={() => !userWrite.loading && setUserwrite({ ...userWrite, show: false, advice: '', feedback: '' })}>Cancel</div>
								<div className="action" onClick={() => !userWrite.loading && submitTheFeedback()}>Submit</div>
							</div>
						</div>
					)}
					{relaunch.show && (
						<div id="relaunch-box">
							<div id="relaunch-header">Relaunch payment summary</div>

							<div className="relaunch-div"/>

							<div id="relaunch-infos">
								<div className="relaunch-info-header"><strong>Subtotal:</strong> $20.00</div>
								<div className="relaunch-info-header"><strong>Service fee:</strong> $5.00</div>

								<div className="relaunch-div"/>

								<div className="relaunch-info-header"><strong>Total:</strong> $25.00</div>
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
			      			{/*<div id="update" onClick={() => {
			      				localStorage.setItem("relaunchProduct", relaunch.productId.toString())

			      				window.location = "/payment"
			      			}}>Update payment</div>*/}
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
				</div>
			)}
		</div>
	)
}