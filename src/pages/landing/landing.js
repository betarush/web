import './landing.scss';
import { useEffect, useState } from 'react';
import { resizePhoto } from 'geottuse-tools';
import { BiNotepad } from "react-icons/bi";
import { FaMoneyBillAlt } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

import { AiOutlineArrowRight } from "react-icons/ai";
import { BsArrowDown } from "react-icons/bs";

import { isMobile } from 'react-device-detect';

if (process.env.REACT_APP_SEGMENT_ON == true) window.analytics.track('landing', { web: true });

export default function Landing() {
	const [viewType, setViewtype] = useState('creators')

	return (
		<div id="landing">
			<div id={"landing-header-" + (isMobile ? "m" : "w")}>
				{isMobile ? 
					<div className="row">
						<div className="row">
							<div className="column">
								<div id="logo" onClick={() => window.location = "/"}>
									<img src="/logo.png" alt="product logo"/>
								</div>
							</div>

							<div className="column"><div id="title">SHAPER</div></div>
						</div>
					</div>
					:
					<div className="row">
						<div className="column">
							<div id="logo" onClick={() => window.location = "/"}>
								<img src="/logo.png" alt="product logo"/>
							</div>
						</div>

						<div className="column"><div id="title">SHAPER</div></div>
					</div>
				}

				<div className={isMobile ? "row" : "column"}>
					<div id="navs">
						<div className="nav" style={!isMobile ? { marginRight: 50 } : { margin: 10 }} onClick={() => window.location = '/register'}>Register</div>
						<div className="nav" style={!isMobile ? { marginRight: 50 } : { margin: 10 }} onClick={() => window.location = '/login'}>Login</div>
					</div>
				</div>
			</div>

			<div id="body">
				{isMobile ? 
					<div id="masthead" style={{ height: 300, overflow: 'hidden', width: '100%' }}>
						<div id="masthead-header-m">
							<h1 id="top-header-m">SHAPE YOUR PRODUCT THE WAY YOUR USERS LOVE/NEED IT</h1>
							<div id="info-header">Reward people cash to tryout your product and provide their QA advices/feedback</div>

							<div id="learnmore-m" onClick={() => window.location = "/register"}>GET STARTED</div>
						</div>
						<img id="masthead-image-m" alt="masthead image" src="/masthead.png" style={{ ...resizePhoto({ width: 1920, height: 1268 }, window.innerWidth, 300, "width") }}/>
					</div>
					:
					<div id="masthead" style={{ height: window.innerHeight * 0.8, overflow: 'hidden', width: '100%' }}>
						<div id="masthead-header-w">
							<h1 id="top-header-w">SHAPE YOUR PRODUCT THE WAY YOUR USERS LOVE/NEED IT</h1>

							<div id="info-header">Reward people cash to tryout your product and provide their QA advices/feedback</div>

							<div id="learnmore-w" onClick={() => window.location = "/register"}>GET STARTED</div>
						</div>
						<img id="masthead-image-w" alt="masthead image" src="/masthead.png" style={{ ...resizePhoto({ width: 1920, height: 1268 }, window.innerWidth * 0.4, window.innerWidth * 0.4, "width") }}/>
					</div>
				}
				
				<div id="whyus">
					<div id={"whyus-header-" + (isMobile ? "m" : "w")}>What choose us</div>

					<div id={!isMobile ? "whyus-row" : ""}>
						<div className="whyus-item" style={!isMobile ? { width: '30%' } : {}}>
							<div className="image">
								<BiNotepad style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header" style={isMobile ? { } : { margin: '30px 0' }}>GET QUICK BETA TESTERS</div>
							<div className="header-info" style={isMobile ? {} : { height: 100 }}>
								Testers will try out your product right away to earn rewards
							</div>
						</div>
						<div className="whyus-arrow">
							{isMobile ? 
								<BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/>
								:
								<AiOutlineArrowRight style={{ color: 'black', height: '100%', width: '100%' }}/>
							}
						</div>
						<div className="whyus-item" style={!isMobile ? { width: '30%' } : {}}>
							<div className="image">
								<FaPeopleGroup style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header" style={isMobile ? { } : { margin: '30px 0' }}>EFFECTIVE SMALL INVESTING</div>
							<div className="header-info" style={isMobile ? {} : { height: 100 }}>
								Get 5 QA advices and feedback for every product submission on a fixed deposit
							</div>
						</div>
						<div className="whyus-arrow">
							{isMobile ? 
								<BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/>
								:
								<AiOutlineArrowRight style={{ color: 'black', height: '100%', width: '100%' }}/>
							}
						</div>
						<div className="whyus-item" style={!isMobile ? { width: '30%' } : {}}>
							<div className="image">
								<FaMoneyBillAlt style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header" style={isMobile ? { } : { margin: '30px 0' }}>QUICK QA</div>
							<div className="header-info" style={isMobile ? {} : { height: 100 }}>
								The quickest way to get your product quality assuranced before you start launching for the targeted audiences
							</div>
						</div>
					</div>
				</div>

				<div id="benefits">
					<div id={"benefit-header-" + (isMobile ? "m" : "w")}>How it works</div>

					<div id={!isMobile ? "benefit-row" : ""}>
						<div className="benefit-item" style={!isMobile ? { width: '30%' } : {}}>
							<div className="image">
								<BiNotepad style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header" style={isMobile ? { } : { margin: '30px 0' }}>YOU HAVE A PRODUCT</div>
							<div className="header-info" style={isMobile ? {} : { height: 100 }}>
								Are you finished with your product and wants some 
								<strong style={{ color: 'black' }}> QA ADVICES/FEEDBACK</strong> ?
							</div>
						</div>
						<div className="benefit-arrow">
							{isMobile ? 
								<BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/>
								:
								<AiOutlineArrowRight style={{ color: 'black', height: '100%', width: '100%' }}/>
							}
						</div>
						<div className="benefit-item" style={!isMobile ? { width: '30%' } : {}}>
							<div className="image">
								<FaPeopleGroup style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header" style={isMobile ? { } : { margin: '30px 0' }}>PEOPLE</div>
							<div className="header-info" style={isMobile ? {} : { height: 100 }}>
								We have recruited alot of people
								to try products and write 
								<strong style={{ color: 'black' }}> approvable QA ADVICES/FEEDBACK </strong> 
								to earn cash as an reward
							</div>
						</div>
						<div className="benefit-arrow">
							{isMobile ? 
								<BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/>
								:
								<AiOutlineArrowRight style={{ color: 'black', height: '100%', width: '100%' }}/>
							}
						</div>
						<div className="benefit-item" style={!isMobile ? { width: '30%' } : {}}>
							<div className="image">
								<FaMoneyBillAlt style={{ color: "white", height: '70%', margin: '0 auto', width: '70%' }}/>
							</div>
							<div className="header" style={isMobile ? { } : { margin: '30px 0' }}>ITERATE BEFORE ADS</div>
							<div className="header-info" style={isMobile ? {} : { height: 100 }}>
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

				<div id="infos" style={!isMobile ? { height: 550 } : {}}>
					<div id="infos-header">How it works</div>

					<div id="infos-options">
						<div className={"option" + (viewType == "creators" ? "-selected" : "")} onClick={() => setViewtype("creators")}>for Creators</div>
						<div className={"option" + (viewType == "testers" ? "-selected" : "")} onClick={() => setViewtype("testers")}>for Testers</div>
					</div>

					{viewType == "creators" ? 
						<div className="info" style={!isMobile ? { margin: '10px auto', width: '50%' } : { width: '100%' }}>
							{isMobile ? 
								<>
									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>1</div>
										<div className="row">
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>PRODUCT SUBMISSION</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Start a project submission along with $20 to reward users
												</div>
											</div>
										</div>
									</div>
									<div className="info-arrow"><BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/></div>
									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>2</div>
										<div className="row">
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>REJECT/APPROVE</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Approve the QA advice/feedback you like and 
													the tester will be notified that they are rewarded
												</div>
											</div>
										</div>
									</div>
									<div className="info-arrow"><BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/></div>
									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>3</div>
										<div className="row">
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>RECEIVE E-MAILS</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Receive an email when a user writes a
													QA advice/feedback about your product
												</div>
											</div>
										</div>
									</div>
									<div className="info-arrow"><BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/></div>
									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>4</div>
										<div className="row">
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>5 TESTERS FOR A SUBMISSION</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													You can have up to 5 users try out your product and give
													you good QA advices/feedback for every submission
												</div>
											</div>
										</div>
									</div>
								</>
								:
								<>
									<div className="row">
										<div className={"info-info-" + (isMobile ? "m" : "w")}>
											<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>1</div>
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>PRODUCT SUBMISSION</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Start a project submission along with $20 to reward users
												</div>
											</div>
										</div>

										<div className={"info-info-" + (isMobile ? "m" : "w")}>
											<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>3</div>
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>REJECT/APPROVE</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Approve the QA advice/feedback you like and 
													the tester will be notified that they are rewarded
												</div>
											</div>
										</div>
									</div>

									<div className="row">
										<div className={"info-info-" + (isMobile ? "m" : "w")}>
											<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>2</div>
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>RECEIVE E-MAILS</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Receive an email when a user writes a
													QA advice/feedback about your product
												</div>
											</div>
										</div>
										<div className={"info-info-" + (isMobile ? "m" : "w")}>
											<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>4</div>
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>5 TESTERS FOR A SUBMISSION</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													You can have up to 5 users try out your product and give
													you good QA advices/feedback for every submission
												</div>
											</div>
										</div>
									</div>
								</>
							}
						</div>
						:
						<div className="info" style={!isMobile ? { margin: '10px auto', width: '50%' } : { width: '100%' }}>
							{isMobile ? 
								<>
									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>1</div>

										{isMobile ? 
											<div className="row">
												<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
													<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>TRY PRODUCTS</div>
													<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
														Tryout a product you like and
														write a good QA advice/feedback that
														the creator would approve
													</div>
												</div>
											</div>
											:
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>TRY PRODUCTS</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Tryout a product you like and
													write a good QA advice/feedback that
													the creator would approve
												</div>
											</div>
										}
									</div>

									<div className="info-arrow"><BsArrowDown style={{ color: 'black', height: '100%', width: '100%' }}/></div>

									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>2</div>

										{isMobile ? 
											<div className="row">
												<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
													<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>EARN FOR YOUR CONTRIBUTION</div>
													<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
														The creator can see the good QA advice/feedback, approve it
														and then reward you a portion of their deposit
													</div>
												</div>
											</div>
											:
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>EARN FOR YOUR CONTRIBUTION</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													The creator can see the good QA advice/feedback, approve it
													and then reward you a portion of their deposit
												</div>
											</div>
										}
									</div>
								</>
								:
								<div className="row">
									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>1</div>

										{isMobile ? 
											<div className="row">
												<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
													<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>TRY PRODUCTS</div>
													<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
														Tryout a product you like and
														write a good QA advice/feedback that
														the creator would approve
													</div>
												</div>
											</div>
											:
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>TRY PRODUCTS</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													Tryout a product you like and
													write a good QA advice/feedback that
													the creator would approve
												</div>
											</div>
										}
									</div>

									<div className={"info-info-" + (isMobile ? "m" : "w")}>
										<div className="index" style={isMobile ? { margin: '0 auto' } : {}}>2</div>

										{isMobile ? 
											<div className="row">
												<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
													<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>EARN FOR YOUR CONTRIBUTION</div>
													<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
														The creator can see the good QA advice/feedback, approve it
														and then reward you a portion of their deposit
													</div>
												</div>
											</div>
											:
											<div className="header" style={isMobile ? { width: 'calc(100% - 60px)' } : { marginLeft: 20, width: 500 }}>
												<div className="header-title" style={isMobile ? { margin: '20px auto', textAlign: 'center' } : { marginBottom: 10 }}>EARN FOR YOUR CONTRIBUTION</div>
												<div className="header-info" style={isMobile ? { textAlign: 'center' } : { width: '80%' }}>
													The creator can see the good QA advice/feedback, approve it
													and then reward you a portion of their deposit
												</div>
											</div>
										}
									</div>
								</div>
							}
						</div>
					}
				</div>

				<div id="getstarted" onClick={() => window.location = "/register"}>GET STARTED</div>
			</div>

			<div id="footer">
				<div id="socialmedias">
					<div className="socialmedia" onClick={() => window.open("https://www.facebook.com/shaper.app2023")}>
						<img alt="link to facebook page" loading="lazy" src="/facebook-icon.png"/>
					</div>
					<div className="socialmedia" onClick={() => window.open("https://twitter.com/shaper2023")}>
						<img alt="link to twitter page" loading="lazy" src="/twitter-icon.png"/>
					</div>
					<div className="socialmedia" onClick={() => window.open("https://www.linkedin.com/company/97192981")}>
						<img alt="link to linkedin page" loading="lazy" src="/linkedin-icon.png"/>
					</div>
				</div>

				<div id="footer-header">{'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}</div>
			</div>
		</div>
	)
}