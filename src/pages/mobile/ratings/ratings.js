import './ratings.scss';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { resizePhoto } from 'geottuse-tools';
import { depositAmount, regainAmount } from "../../../info"
import { getRatingsNum, getRatings, createCheckout, createCustomerPayment } from '../../../apis/user'
import { FaBan } from "react-icons/fa"
import { ImHappy } from "react-icons/im"
import { BsArrowRepeat, BsCheckCircle } from "react-icons/bs";

// material ui components
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import BuildIcon from '@mui/icons-material/Build';

// components
import Header from '../../../components/mobile/header'

const LOGO_URL = process.env.REACT_APP_LOGO_URL
let sessionId = ""

if (window.location.search.includes("session_id")) {
	const urlParams = new URLSearchParams(window.location.search)
	
	sessionId = urlParams.get('session_id')
}

export default function Ratings() {
	const [userId, setUserid] = useState(null)
	const [headers, setHeaders] = useState({ warn: 0, good: 0, nice: 0 })
	const [rates, setRates] = useState({ type: '', list: [], offset: 0 })

	const [loaded, setLoaded] = useState(false)
	const [loading, setLoading] = useState(false)

	const [regainAccountconfirm, setRegainaccountconfirm] = useState({ show: false, cardInfo: {}, loading: false })
  const [paymentDone, setPaymentdone] = useState({ brand: "", last4: "" })

	const getTheRatingsNum = () => {
    const id = localStorage.getItem("id")
    const data = { userId: id }

    getRatingsNum(data)
      .then((res) => {
        if (res.status == 200) {
          return res.json()
        }

        throw res
      })
      .then((res) => {
        if (res) {
          setHeaders({
            warn: res.ratings.numWarns,
            good: res.ratings.numGoods,
            nice: res.ratings.numNice
          })
          setUserid(id)
        }
      })
      .catch((err) => {

      })
  }
  const getTheRatings = (start, type) => {
    const data = { userId, type }

    getRatings(data)
      .then((res) => {
        if (res.status == 200) {
          return res.json()
        }

        throw res
      })
      .then((res) => {
        if (res) {
          setRates({
            type,
            list: res.rates,
            offset: res.offset
          })

          if (start) {
            setLoaded(true)
          } else {
            setLoading(false)
          }
        }
      })
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
							window.location = "/ratings"
						}
					})
			} else {
				const data = { userId, redirect: "ratings" }

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
						window.location = "/ratings"
					}
			})
		} else {
			getTheRatingsNum()
		}
	}, [])

	useEffect(() => {
		if (userId) {
			if (headers.warn > 0) {
				getTheRatings(true, "warn")
			} else {
				getTheRatings(true, "good")
			}
		}
	}, [userId])

	return (
		<div id="mobile-ratings">
			<Header
				regainAccount={() => regainTheAccount()}
			/>

			<div id="main-body">
				<div id="page-navs">
					<div className={rates.type == "warn" ? "page-nav-focus" : "page-nav"} onClick={() => getTheRatings(true, 'warn')}>
						<div className="row">
							<ListItemDecorator>
								<FaBan style={{ color: 'red', height: 30, width: 30 }}/>
	            </ListItemDecorator>
							<div className="column">Warning({headers.warn})</div>
						</div>
					</div>
					<div className={rates.type == "good" ? "page-nav-focus" : "page-nav"} onClick={() => getTheRatings(true, 'good')}>
						<div className="row">
							<ListItemDecorator>
								<BsCheckCircle style={{ color: 'green', height: 30, width: 30 }}/>
	            </ListItemDecorator>
							<div className="column">Good({headers.good})</div>
						</div>
					</div>
					<div className={rates.type == "nice" ? "page-nav-focus" : "page-nav"} onClick={() => getTheRatings(true, 'nice')}>
						<div className="row">
							<ListItemDecorator>
								<ImHappy style={{ color: 'blue', height: 30, width: 30 }}/>
	            </ListItemDecorator>
							<div className="column">Nice({headers.nice})</div>
						</div>
					</div>
				</div>
			</div>

			{loaded ? 
				rates.list.length > 0 ? 
					<div id="rates" onScroll={(e) => {
						const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

						if (bottom) {
							getTheRatings(rates.type)
						}
					}}>
						{rates.list.map((rate, index) => (
							<div className="rate" key={rate.key}>
								<div className="info">
									<div className="logo" style={resizePhoto(rate.product.logo, 100, 100)}>
										<img src={LOGO_URL + '/' + rate.product.logo.name}/>
									</div>
									<div className="header">{rate.product.name}</div>
								</div>

								<div className="rate-header">
                  <div><strong>You wrote:</strong> {rate.advice}</div>
									{rates.type == "warn" && <div><strong>Warning message:</strong> {rate.reason}</div>}
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
			
			{(regainAccountconfirm.show) && (
				<div id="hidden-box">
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
				</div>
			)}
		</div>
	)
}