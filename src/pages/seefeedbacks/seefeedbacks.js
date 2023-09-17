import './seefeedbacks.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { resizePhoto } from 'geottuse-tools';

// material ui components
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

// components
import Header from '../../components/header'

import { rewardCustomer, rejectFeedback } from '../../apis/user'
import { getFeedbacks } from '../../apis/product'

const LOGO_URL = process.env.REACT_APP_LOGO_URL

export default function Seefeedbacks() {
	const [userId, setUserid] = useState('')

	const [products, setProducts] = useState([])
	const [name, setName] = useState('')
	const [image, setImage] = useState({ name: '', width: 0, height: 0 })
	const [rejectReasonbox, setRejectreasonbox] = useState({ show: false, reason: '', info: {} })
	const [loaded, setLoaded] = useState(false)
 
	const getTheFeedbacks = () => {
		const id = localStorage.getItem("id")
		const data = { userId: id }

		getFeedbacks(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setProducts(res.products)
					setUserid(id)
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
	const rejectTheFeedback = (id, testerId, productIndex, feedbackIndex) => {
		if (!rejectReasonbox.show) {
			setRejectreasonbox({ show: true, reason: '', info: { id, testerId, productIndex, feedbackIndex } })
		} else {
			const { info, reason } = rejectReasonbox
			const data = { productId: info.id, testerId: info.testerId, reason }
			const newProducts = [...products]

			rejectFeedback(data)
				.then((res) => {
					if (res.status == 200) {
						return res.json()
					}

					throw res
				})
				.then((res) => {
					if (res) {
						newProducts[info.productIndex].feedbacks.splice(info.feedbackIndex, 1)

						if (newProducts[info.productIndex].feedbacks.length == 0) {
							newProducts.splice(info.productIndex, 1)
						}

						setProducts(newProducts)
						setRejectreasonbox({ show: false, reason: '' })
					}
				})
		}
	}
	const rewardTheCustomer = (id, testerId, productIndex, feedbackIndex) => {
		const data = { productId: id, testerId }
		const newProducts = [...products]

		rewardCustomer(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					newProducts[productIndex].feedbacks.splice(feedbackIndex, 1)

					if (newProducts[productIndex].feedbacks.length == 0) {
						newProducts.splice(productIndex, 1)
					}

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
		getTheFeedbacks()
	}, [])

	return (
		<div id="seefeedbacks">
			<Header/>

			{loaded ? 
				products.length > 0 ? 
					<div id="feedbacks">
						{products.map((product, productIndex) => (
							<div className="product">
								<div className="info">
									<div className="logo" style={resizePhoto(image, 100, 100)}>
										<img src={LOGO_URL + '/' + product.image.name}/>
									</div>
								</div>

								<div id="feedbacks-header">
									Your feedbacks for <strong>{product.name}</strong>
									<br/>
									<div style={{ fontSize: 20 }}>(Please save your feedback somewhere)</div>
								</div>

								<div id="product-feedbacks">
									{product.feedbacks.map((feedback, feedbackIndex) => (
										<div className="feedback" key={feedback.key}>
											<div className="feedback-header">{feedback.header}</div>

											<Stack>
												<div className="feedback-actions">
													<Button style={{ margin: '0 5px' }} variant="contained" onClick={() => rejectTheFeedback(product.id, feedback.testerId, productIndex, feedbackIndex)}>Reject feedback</Button>
													<Button style={{ margin: '0 5px' }} variant="contained" onClick={() => rewardTheCustomer(product.id, feedback.testerId, productIndex, feedbackIndex)}>Reward customer</Button>
												</div>
											</Stack>
										</div>
									))}
								</div>
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

			{rejectReasonbox.show && (
				<div id="hidden-box">
					<div id="reject-box">
						<div id="reject-header">Why are you rejecting this feedback ? (Optional)</div>

						<textarea id="reject-input" maxlength="200" onChange={e => setRejectreasonbox({ ...rejectReasonbox, reason: e.target.value })} value={rejectReasonbox.reason}/>

						<div id="actions">
							<div className="action" onClick={() => setRejectreasonbox({ show: false, reason: '' })}>Cancel</div>
							<div className="action" onClick={() => rejectTheFeedback()}>Submit</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
