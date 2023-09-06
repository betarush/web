import './rejections.scss';
import { useEffect, useState } from 'react';
import { getRejections } from '../../apis/producttesting';
import { resizePhoto } from 'geottuse-tools';

// components
import Header from '../components/header'

const LOGO_URL = process.env.REACT_APP_LOGO_URL

export default function Rejections() {
	const [userId, setUserid] = useState(null)

	const [rejections, setRejections] = useState([])

	const getTheRejections = () => {
		const id = localStorage.getItem("id")
		const data = { userId: id }

		getRejections(data)
			.then((res) => {
				if (res.status == 200) {
					return res.json()
				}

				throw res
			})
			.then((res) => {
				if (res) {
					if (res) {
						setRejections(res.rejections)
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
		getTheRejections()
	}, [])

	return (
		<div id="rejection">
			<Header/>

			<div id="rejections">
				{rejections.map((rejection, index) => (
					<div className="product" key={rejection.key}>
						<div className="info">
							<div className="logo" style={resizePhoto(rejection.logo, 100, 100)}>
								<img src={LOGO_URL + '/' + rejection.logo.name}/>
							</div>
						</div>

						<div className="rejections-header"><strong>Your feedback for {rejection.name} was rejected:</strong> {rejection.header}</div>
					</div>
				))}
			</div>
		</div>
	)
}