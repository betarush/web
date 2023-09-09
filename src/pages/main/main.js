import './main.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { resizePhoto } from 'geottuse-tools';
import { getUserInfo } from '../../apis/user'
import { getUntestedProducts, getTestedProducts, getMyProducts, tryProduct } from '../../apis/product'
import { submitFeedback } from '../../apis/producttesting'

// material ui components
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
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

	const [products, setProducts] = useState([])
	const [viewType, setViewtype] = useState('')
	const [feedback, setFeedback] = useState({ show: false, input: '', id: null, index: -1 })

	const [bankaccountDone, setBankaccountdone] = useState(false)
	const [loaded, setLoaded] = useState(false)

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
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const getTheUntestedProducts = () => {
		const data = { userId }

		setLoaded(false)

		getUntestedProducts(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setProducts(res.products)
					setViewtype('untested')
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
	const getTheTestedProducts = () => {
		const data = { userId }

		setLoaded(false)

		getTestedProducts(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setProducts(res.products)
					setViewtype('tested')
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
	const getTheMyProducts = () => {
		const data = { userId }

		setLoaded(false)

		getMyProducts(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setProducts(res.products)
					setViewtype('myproducts')
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

					window.open(link)
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
					setFeedback({ show: false, input: '', id: null, index: -1 })

					getTheTestedProducts()
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
	}, [])

	useEffect(() => {
		if (userId) {
			getTheUntestedProducts()
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
			          <ListItemButton style={{ backgroundColor: viewType == 'untested' ? 'rgba(0, 0, 0, 0.5)' : 'white' }} role="menuitem" component="a" href="#navigation-menu" onClick={() => viewType != 'untested' && getTheUntestedProducts()}>
			            <ListItemDecorator>
			              <BuildIcon />
			            </ListItemDecorator>
			            <div style={{ color: viewType == 'untested' ? 'white' : 'black' }}>Untested by you</div>
			          </ListItemButton>
			        </ListItem>
			        <ListItem role="none">
			          <ListItemButton style={{ backgroundColor: viewType == 'tested' ? 'rgba(0, 0, 0, 0.5)' : '' }} role="menuitem" component="a" href="#navigation-menu" onClick={() => viewType != 'tested' && getTheTestedProducts()}>
			            <ListItemDecorator>
			              <SpeedRoundedIcon />
			            </ListItemDecorator>
			            <div style={{ color: viewType == 'tested' ? 'white' : 'black' }}>Testing by you</div>
			          </ListItemButton>
			        </ListItem>
			        <ListItem role="none">
			          <ListItemButton style={{ backgroundColor: viewType == 'myproducts' ? 'rgba(0, 0, 0, 0.5)' : '' }} role="menuitem" component="a" href="#navigation-menu" onClick={() => viewType != 'myproducts' && getTheMyProducts()}>
			            <ListItemDecorator>
			              <PersonIcon />
			            </ListItemDecorator>
			            <div style={{ color: viewType == 'myproducts' ? 'white' : 'black' }}>Your products</div>
			          </ListItemButton>
			        </ListItem>
			      </List>
			    </Box>
				</div>

				{loaded ? 
					products.length > 0 ? 
						<div id="products">
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
													<div className="header">{product.numTried} people left can try</div>

													<Button disabled={!product.trying} variant={product.trying ? "contained" : ""} onClick={() => {
														if (product.trying) {
															setFeedback({ show: true, input: '', id: product.id, index })
														}
													}}>Give feedback & Earn ${product.reward.toFixed(2)}</Button>
													<Button disabled={product.trying} variant={!product.trying ? "contained" : ""} onClick={() => {
														if (!product.trying) {
															tryTheProduct(index, product.id, product.link)
														}
													}}>Try first</Button>
												</div>
											</div>
											:
											<div className="column">
												{viewType == "tested" ? 
													<div className="info">
														<div className="header">{product.earned ? "Earned: $" + product.reward.toFixed(2) + " for trying" : "Waiting for creator to reward you"}</div>
													</div>
													:
													<div className="info-container">
														<div className="header">Amount spent: ${product.amountSpent.toFixed(2)}</div>

														{product.numTesting > 0 && (
															<div className="header">
																{product.numTesting + " people testing"}
															</div>
														)}

														{product.numFeedback > 0 && (
															<div className="header">
																{product.numTesting} people gave feedback<br/>
																<div className="reward" onClick={() => window.location = '/feedback/' + product.id}>Reward them</div>
															</div>
														)}															
															
														<div className="header">
															{product.numTested} people rewarded
														</div>
													</div>
												}
											</div>
										}
									</Stack>
								</div>
							))}
						</div>
						:
						<div id="no-result">No Results</div>
					:
					<div style={{ height: 20, margin: '10% auto', width: 20 }}>
						<ClipLoader color="black" size={20}/>
					</div>
				}
			</div>

			{feedback.show && (
				<div id="hidden-box">
					<div id="feedback-box">
						<div id="feedback-header">Write a good feedback to earn $4.00</div>

						<textarea id="feedback-input" maxlength="200" onChange={e => setFeedback({ ...feedback, input: e.target.value })} value={feedback.input}/>

						<div id="actions">
							<div className="action" onClick={() => setFeedback({ show: false, input: '' })}>Cancel</div>
							<div className="action" onClick={() => submitTheFeedback()}>Submit</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}