import './main.scss';
import { useEffect, useState } from 'react';
import { resizePhoto } from 'geottuse-tools';
import { getUserInfo } from '../../apis/user';
import { getUntestedProducts, getTestedProducts, getMyProducts, tryProduct } from '../../apis/product'
import { submitFeedback } from '../../apis/producttesting'

// components
import Header from '../components/header'

const LOGO_URL = process.env.REACT_APP_LOGO_URL

export default function Main() {
	const [userId, setUserid] = useState('')

	const [username, setUsername] = useState('')
	const [products, setProducts] = useState([])
	const [viewType, setViewtype] = useState('')
	const [feedback, setFeedback] = useState({ show: false, input: '', id: null, index: -1 })

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
					setUsername(res.username)
					setUserid(id)
				}
			})
	}
	const getTheUntestedProducts = () => {
		const data = { userId }

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
		if (userId) getTheUntestedProducts()
	}, [userId])

	return (
		<div id="main">
			<Header username={username}/>

			<div id="main">
				<div className="row">
					<div className="page-navs">
						<div className="column"><div className={"page-nav" + (viewType == 'untested' ? '-focus' : '')} onClick={() => viewType != 'untested' && getTheUntestedProducts()}>Untested by you</div></div>
						<div className="column"><div className={"page-nav" + (viewType == 'tested' ? '-focus' : '')} onClick={() => viewType != 'tested' && getTheTestedProducts()}>Testing by you</div></div>
						<div className="column"><div className={"page-nav" + (viewType == 'myproducts' ? '-focus' : '')} onClick={() => viewType != 'myproducts' && getTheMyProducts()}>Your products</div></div>
					</div>
				</div>

				<div id="products">
					{products.map((product, index) => (
						<div className="product" key={product.key}>
							<div className="image" style={resizePhoto(product.logo, 100, 100)}>
								<img src={LOGO_URL + '/' + product.logo.name}/>
							</div>
							<div className="desc">
								<div style={{ fontWeight: 'bold' }}>{product.name}</div><br/>
								{product.info}
							</div>

							{viewType == 'untested' ? 
								<div className="column">
									<div className="info">
										<div className="header">3 people left can try</div>
										<div className="actions">
											<div className={"action" + (product.trying ? "" : "-disabled")} onClick={() => {
												if (product.trying) {
													setFeedback({ show: true, input: '', id: product.id, index })
												}
											}}>Give feedback & Earn $2</div>
											<div className={"action" + (!product.trying ? "" : "-disabled")} onClick={() => {
												if (!product.trying) {
													tryTheProduct(index, product.id, product.link)
												}
											}}>Try first</div>
										</div>
									</div>
								</div>
								:
								<div className="column">
									{viewType == "tested" ? 
										<div className="info">
											<div className="header">Earned: $2.00 for trying</div>
										</div>
										:
										<div className="info-container">
											<div className="header">Amount spent: $20.00</div>
											<div className="header">Created on<br/>July 14, 2023 @ 2:30 PM</div>
											<div className="header">5 people tried it</div>
										</div>
									}
								</div>
							}
						</div>
					))}
				</div>
			</div>

			{feedback.show && (
				<div id="hidden-box">
					<div id="feedback-box">
						<div id="feedback-header">Your feedback</div>

						<textarea id="feedback-input" maxlength="200" onChange={e => setFeedback({ ...feedback, input: e.target.value })} value={feedback.input}/>

						<div id="actions">
							<div className="action" onClick={() => setFeedback({ show: false, input: '' })}>Cancel</div>
							<div className="action" onClick={() => submitTheFeedback()}>Submit and get pay $2</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}