import './rejections.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { getRejections } from '../../apis/producttesting';
import { resizePhoto } from 'geottuse-tools';

// components
import Header from '../../components/header'

const LOGO_URL = process.env.REACT_APP_LOGO_URL

export default function Rejections() {
	const [userId, setUserid] = useState(null)

	const [rejections, setRejections] = useState([])
	const [offset, setOffset] = useState(0)
	const [loaded, setLoaded] = useState(false)

	const getTheRejections = start => {
		const id = localStorage.getItem("id")
		const data = { userId: id, offset: start ? 0 : offset }

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
						setOffset(res.offset)
						setLoaded(true)

						window.analytics.track('rejections', { id, web: true });
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

			{loaded ? 
				rejections.length > 0 ? 
					<div id="rejections" onScroll={(e) => {
						const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

						if (bottom) {
							getTheRejections()
						}
					}}>
						{rejections.map((rejection, index) => (
							<div className="product" key={rejection.key}>
								<div className="info">
									<div className="logo" style={resizePhoto(rejection.logo, 100, 100)}>
										<img src={LOGO_URL + '/' + rejection.logo.name}/>
									</div>
									<div className="header">{rejection.name}</div>
								</div>

								<div className="rejections-header">
									Your feedback: <strong>"{rejection.feedback}",</strong> was rejected 
									{rejection.header && " for this reason: " + rejection.header}
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
		</div>
	)
}