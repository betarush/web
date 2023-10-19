import './landing.scss';
import { useEffect, useState } from 'react';
import { resizePhoto } from 'geottuse-tools';

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

					<div className="column"><div id="title">GET PRODUCT FEEDBACK</div></div>
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
						<h1 id="top-header">
							Have users tryout your product TODAY
						</h1>
						<div id="info-header">
							Reward users small amount of money to tryout your product
							and give you a <strong>good</strong> feedback
						</div>

						<div id="learnmore" onClick={() => window.location = "/register"}>GET STARTED</div>
					</div>
					<img id="masthead-image" alt="masthead image" src="/background.jpeg" style={{ ...resizePhoto({ width: 1000, height: 597 }, window.innerWidth, 200, "width") }}/>
				</div>

				<div id="benefits">
					<div id="benefit-header">What we are</div>

					<div id="benefit-row">
						<div className="benefit-item">
							<div className="header">Are you finished with your MVP and want some USEFUL FEEDBACK ?</div>
							<div className="image"><img alt="get useful feedback from users" src="/mvp.png"/></div>
						</div>
						<div className="benefit-item">
							<div className="header">
								Don't risk your money running ads yet
								until you have a solid proof of
								solution that works
							</div>
							<div className="image"><img alt="don't waste your money on ads yet" src="/burningmoney.png"/></div>
						</div>
						<div className="benefit-item">
							<div className="header">
								A community of people here are looking
								to try new products, give their best <strong>APPROVABLE</strong> feedback to them and get rewarded with money
							</div>
							<div className="image"><img alt="a bunch of people waiting to test products and get rewarded" src="/userbase.png"/></div>
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
							<div className="info-header">(for Project creators)</div>
							<div className="info-info">
								<div className="index">1</div>
								<div className="header">
									Submit your product with a $20 deposit
									<br/>(Reward each user $4)
									<br/>(Maximum of 5 users can test)
								</div>
							</div>

							<div className="info-info">
								<div className="index">2</div>
								<div className="header">
									You will get an email when a tester writes a feedback about your product
								</div>
							</div>

							<div className="info-info">
								<div className="index">3</div>
								<div className="header">
									You can either reject the feedback if you don't like it or
									<br/>
									approve the feedback if you like and the tester will be rewarded $4
								</div>
							</div>

							<div className="info-info">
								<div className="index">4</div>
								<div className="header">
									You can have up to 5 users try out your product and give
									you good feedback for every $20 you spent
								</div>
							</div>
						</div>
						:
						<div className="info">
							<div className="info-header">(for Testers)</div>
							<div className="info-info">
								<div className="index">1</div>
								<div className="header">
									Tryout a product you like and<br/>
									try to write a GOOD feedback that the creator will like
								</div>
							</div>

							<div className="info-info">
								<div className="index">2</div>
								<div className="header">
									The product creator can see the GOOD<br/>feedback, approve it, reward you
									and then<br/>you can connect your bank account to withdraw the money
								</div>
							</div>
						</div>
					}
				</div>
			</div>

			<div>
				<div id="socialmedias">
					<div className="socialmedia" onClick={() => window.open("https://www.facebook.com/profile.php?id=61551403930434")}>
						<img alt="link to facebook page" src="/facebook-icon.png"/>
					</div>
					<div className="socialmedia" onClick={() => window.open("https://twitter.com/getfeedback2023")}>
						<img alt="link to twitter page" src="/twitter-icon.png"/>
					</div>
					<div className="socialmedia" onClick={() => window.open("https://www.linkedin.com/company/97192981")}>
						<img alt="link to linkedin page" src="/linkedin-icon.png"/>
					</div>
				</div>

				<div id="footer">{'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}</div>
			</div>
		</div>
	)
}