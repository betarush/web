import './feedback.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resizePhoto } from 'geottuse-tools';

// components
import Header from '../components/header'
import { rewardCustomer, rejectFeedback } from '../../apis/user'
import { getFeedbacks } from '../../apis/product'

const LOGO_URL = process.env.REACT_APP_LOGO_URL

export default function Feedbacks(props) {
	const { id } = useParams()

	const [userId, setUserid] = useState('')

	const [feedbacks, setFeedbacks] = useState([])
	const [name, setName] = useState('')
	const [image, setImage] = useState({ name: '', width: 0, height: 0 })
	const [rejectReasonbox, setRejectreasonbox] = useState({ show: false, reason: '', info: {} })

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
					setName(res.name)
					setImage(res.logo)
				}
			})
			.catch((err) => {
				if (err.status == 400) {
					err.json().then(() => {

					})
				}
			})
	}
	const rejectTheFeedback = (testerId, index) => {
		if (!rejectReasonbox.show) {
			setRejectreasonbox({ show: true, reason: '', info: { testerId, index } })
		} else {
			const { info, reason } = rejectReasonbox
			const data = { productId: id, testerId: info.testerId, reason }
			const newFeedbacks = [...feedbacks]

			rejectFeedback(data)
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
		}
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
						<div className="logo" style={resizePhoto(image, 100, 100)}>
							<img src={LOGO_URL + '/' + image.name}/>
						</div>
					</div>

					<div id="feedbacks-header">Your feedbacks for <strong>{name}</strong></div>

					<div id="product-feedbacks">
						{feedbacks.map((feedback, index) => (
							<div className="feedback" key={feedback.key}>
								<div className="feedback-header">{feedback.header}</div>

								<div className="feedback-actions">
									<div className="feedback-action" onClick={() => rejectTheFeedback(feedback.testerId, index)}>Reject feedback</div>
									<div className="feedback-action" onClick={() => rewardTheCustomer(feedback.testerId, index)}>Reward customer</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

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
