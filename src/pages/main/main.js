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
	const [feedback, setFeedback] = useState({ show: false, input: '', id: null, index: -1, amountSpent: 0, loading: false })
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
		setFeedback({ ...feedback, loading: true })

		const { input, id, index } = feedback
		const data = { userId, productId: id, feedback: input }
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
					setFeedback({ ...feedback, show: false, input: '', id: null, index: -1, loading: false })

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

			<div id="main">
				<div className="row">
					<Box>
			      <List
			        role="menubar"
			        orientation="horizontal"
			        sx={{ '--List-radius': '8px', '--List-padding': '4px', '--List-gap': '8px' }}
			      >
			        <ListItem role="none">
			          <ListItemButton style={{ backgroundColor: viewType == 'untested' ? 'rgba(0, 0, 0, 0.5)' : '' }} role="menuitem" onClick={() => getTheUntestedProducts(true)}>
			            <ListItemDecorator>
			              <BuildIcon/>
			            </ListItemDecorator>
			            <div style={{ color: viewType == 'untested' ? 'white' : 'black' }}>Untested by you</div>
			          </ListItemButton>
			        </ListItem>
			        <ListItem role="none">
			          <ListItemButton style={{ backgroundColor: viewType == 'testing' ? 'rgba(0, 0, 0, 0.5)' : '' }} role="menuitem" onClick={() => getTheTestingProducts(true)}>
			            <ListItemDecorator>
			              <SpeedRoundedIcon/>
			            </ListItemDecorator>
			            <div style={{ color: viewType == 'testing' ? 'white' : 'black' }}>Testing by you</div>
			          </ListItemButton>
			        </ListItem>
			        {isCreator == true && (
			        	<ListItem role="none">
				          <ListItemButton style={{ backgroundColor: viewType == 'myproducts' ? 'rgba(0, 0, 0, 0.5)' : '' }} role="menuitem" onClick={() => getTheMyProducts(true)}>
				            <ListItemDecorator>
				              <PersonIcon/>
				            </ListItemDecorator>
				            <div style={{ color: viewType == 'myproducts' ? 'white' : 'black' }}>Your products</div>
				          </ListItemButton>
				        </ListItem>
			        )}
			      </List>
			    </Box>
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
														<Button disabled={product.trying} variant="contained" onClick={() => tryTheProduct(index, product.id, product.link)}>Try first then earn $$</Button>
														:
														<div className="header">
															Come back to give feedback when you're done testing
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
															<>
																<Button variant="contained" style={{ marginBottom: 10 }} onClick={() => setFeedback({ ...feedback, show: true, input: '', id: product.id, index, amountSpent: product.amountSpent, loading: false })}>Give feedback & Earn ${product.reward.toFixed(2)}</Button>
																<Button variant="contained" onClick={() => window.open(product.link)}>Go To Product</Button>
															</>
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

			{(intro || feedback.show || relaunch.show) && (
				<div id="hidden-box">
					{intro && (
						<div id="intro">
							<div id="intro-header">Welcome</div>

							<div className="intro-mini-header">
								We built this platform that enables you to earn some money
								by helping creators improve their product.
								<br/><br/>
								All you have to do is tryout products and write a good feedback.
								<br/><br/>
								You will get rewarded with money if the creator likes your feedback so
								make sure to write a few good words
								<br/><br/>
								That's it! Enjoy your time making money here:)
							</div>

							<div id="intro-actions">
								<div className="intro-action" onClick={() => setIntro(false)}>OK</div>
							</div>
						</div>
					)}
					{feedback.show && (
						<div id="feedback-box">
							<div id="feedback-header">Write a good feedback to earn ${(feedback.amountSpent / 5).toFixed(2)}</div>

							<textarea id="feedback-input" maxlength="500" disabled={feedback.loading} placeholder="Write here" onChange={e => setFeedback({ ...feedback, input: e.target.value })} value={feedback.input}/>

							<div id="actions">
								<div className="action" style={{ opacity: feedback.loading ? 0.5 : 1 }} onClick={() => !feedback.loading && setFeedback({ show: false, input: '' })}>Cancel</div>
								<div className="action" style={{ opacity: feedback.loading ? 0.5 : 1 }} onClick={() => !feedback.loading && submitTheFeedback()}>Submit</div>
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