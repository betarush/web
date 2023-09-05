import './feedback.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// components
import Header from '../components/header'
import { rewardCustomer } from '../../apis/user'
import { getFeedbacks } from '../../apis/product'

export default function Feedbacks(props) {
	const { id } = useParams()

	const [userId, setUserid] = useState('')

	const [feedbacks, setFeedbacks] = useState([])

	const getTheFeedbacks = () => {
		const data = { productId: id }

		getFeedbacks(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					setFeedbacks(res.feedbacks)
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const rewardTheCustomer = (testerId, index) => {
		const data = { productId: id, testerId }
		const newFeedbacks = [...feedbacks]

		rewardCustomer(data)
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
		<div id="feedback">
			<Header/>

			<div id="feedbacks">
				<div className="product">
					<div className="info">
						<div className="logo">
							<img src=""/>
						</div>
					</div>

					<div id="feedbacks-header">Your feedbacks for <strong>Product name</strong></div>

					<div id="product-feedbacks">
						{feedbacks.map((feedback, index) => (
							<div className="feedback" key={feedback.key}>
								<div className="feedback-header">{feedback.header}</div>
								<div className="feedback-reward" onClick={() => rewardTheCustomer(feedback.testerId, index)}>Reward customer</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
