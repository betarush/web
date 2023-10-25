import './landing.scss';
import { useEffect, useState } from 'react';
import { resizePhoto } from 'geottuse-tools';
import { BiNotepad } from "react-icons/bi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { AiOutlineArrowRight } from "react-icons/ai";

if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('landing', { web: true });

export default function Landing() {
	const [viewType, setViewtype] = useState('creators')

	return (
		<div id="landing">
			<div id="landing-header">
				<div className="row">
					<div className="column">
						<div id="logo" onClick={() => window.location = "/"}>
		      		<img src="/logo.png" alt="product logo"/>
		      	</div>
					</div>

					<div className="column"><div id="title">SHAPER</div></div>
				</div>

				<div className="column">
					<div id="navs">
						<div className="nav" onClick={() => window.location = '/register'}>Register</div>
						<div className="nav" onClick={() => window.location = '/login'}>Login</div>
					</div>
				</div>
			</div>

			<div id="body">
				<div id="masthead" style={{ height: window.innerHeight * 0.8, overflow: 'hidden', width: '100%' }}>
					<div id="masthead-header">
						<h1 id="top-header">SHAPE YOUR PRODUCT THE WAY YOUR USERS LOVE/NEED IT</h1>

						<div id="info-header">Reward people cash to tryout your product and provide their QA advices/feedback</div>

						<div id="learnmore" onClick={() => window.location = "/register"}>GET STARTED</div>
					</div>
					<img id="masthead-image" alt="masthead image" src="/masthead.png" style={{ ...resizePhoto({ width: 1920, height: 1268 }, window.innerWidth * 0.4, window.innerWidth * 0.4, "width") }}/>
				</div>

				<div id="benefits">
					<div id="benefit-header">What we are</div>

					<div id="benefit-row">
						<div className="benefit-item">
							<div className="image">
								<BiNotepad style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header">YOU HAVE A PRODUCT</div>
							<div className="header-info">
								Are you finished with your product and wants some 
								<strong style={{ color: 'black' }}> QA ADVICES/FEEDBACK</strong> ?
							</div>
						</div>
						<div className="benefit-arrow"><AiOutlineArrowRight style={{ color: 'black', height: '100%', width: '100%' }}/></div>
						<div className="benefit-item">
							<div className="image">
								<FaPeopleGroup style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header">PEOPLE</div>
							<div className="header-info">
								We have recruited alot of people
								to try products and write 
								<strong style={{ color: 'black' }}> approvable QA ADVICES/FEEDBACK </strong> 
								to earn cash as an reward
							</div>
						</div>
						<div className="benefit-arrow"><AiOutlineArrowRight style={{ color: 'black', height: '100%', width: '100%' }}/></div>
						<div className="benefit-item">
							<div className="image">
								<FaMoneyBillAlt style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header">ITERATE BEFORE ADS</div>
							<div className="header-info">
								We help you make sure your product has three things before you start running ads<br/>

								<ul>
									<li>Bug-free</li>
									<li>Usable</li>
									<li>Has a proof of solution</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div id="infos">
					<div id="infos-header">How it works</div>

					<div id="infos-options">
						<div className={"option" + (viewType == "creators" ? "-selected" : "")} onClick={() => setViewtype("creators")}>for Creators</div>
						<div className={"option" + (viewType == "testers" ? "-selected" : "")} onClick={() => setViewtype("testers")}>for Testers</div>
					</div>

					{viewType == "creators" ? 
						<div className="info">
							<div className="row">
								<div className="info-info">
									<div className="index">1</div>
									<div className="header">
										<div className="header-title">PRODUCT SUBMISSION</div>
										<div className="header-info">
											Start a project submission along with $20 to reward users
										</div>
									</div>
								</div>

								<div className="info-info">
									<div className="index">3</div>
									<div className="header">
										<div className="header-title">REJECT/APPROVE</div>
										<div className="header-info">
											Approve the QA advice/feedback you like and 
											the tester will be notified that they are rewarded
										</div>
									</div>
								</div>
							</div>

							<div className="row">
								<div className="info-info">
									<div className="index">2</div>
									<div className="header">
										<div className="header-title">RECEIVE E-MAILS</div>
										<div className="header-info">
											Receive an email when a user writes a
											QA advice/feedback about your product
										</div>
									</div>
								</div>
								<div className="info-info">
									<div className="index">4</div>
									<div className="header">
										<div className="header-title">5 TESTERS FOR A SUBMISSION</div>
										<div className="header-info">
											You can have up to 5 users try out your product and give
											you good QA advices/feedback for every submission
										</div>
									</div>
								</div>
							</div>
						</div>
						:
						<div className="info">
							<div className="row">
								<div className="info-info">
									<div className="index">1</div>
									<div className="header">
										<div className="header-title">TRY PRODUCTS</div>
										<div className="header-info">
											Tryout a product you like and
											write a good QA advice/feedback that
											the creator would approve
										</div>
									</div>
								</div>

								<div className="info-info">
									<div className="index">2</div>
									<div className="header">
										<div className="header-title">EARN FOR YOUR CONTRIBUTION</div>
										<div className="header-info">
											The creator can see the good QA advice/feedback, approve it
											and then reward you a portion of their deposit
										</div>
									</div>
								</div>
							</div>
						</div>
					}
				</div>

				<div id="getstarted" onClick={() => window.location = "/register"}>GET STARTED</div>
			</div>

			<div id="footer">
				<div id="socialmedias">
					<div className="socialmedia" onClick={() => window.open("https://www.facebook.com/shaper.app2023")}>
						<img alt="link to facebook page" src="/facebook-icon.png"/>
					</div>
					<div className="socialmedia" onClick={() => window.open("https://twitter.com/shaper2023")}>
						<img alt="link to twitter page" src="/twitter-icon.png"/>
					</div>
					<div className="socialmedia" onClick={() => window.open("https://www.linkedin.com/company/97192981")}>
						<img alt="link to linkedin page" src="/linkedin-icon.png"/>
					</div>
				</div>

				<div id="footer-header">{'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}</div>
			</div>
		</div>
	)
}