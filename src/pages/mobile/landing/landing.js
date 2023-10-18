import './landing.scss';
import { resizePhoto } from 'geottuse-tools';

window.analytics.track('landing', { mobile: true });

export default function MobileLanding() {
	return (
		<div id="mobile-landing">
			<div id="landing-header">
				<div className="row">
					<div className="row">
						<div className="column">
							<div id="logo">
			      		<img src="/logo.png"/>
			      	</div>
						</div>

						<div id="title">GET PRODUCT FEEDBACK</div>
					</div>
				</div>

				<div className="row">
					<div id="navs">
						<div className="nav" onClick={() => window.location = '/register'}>REGISTER</div>
						<div className="nav" onClick={() => window.location = '/login'}>LOGIN</div>
					</div>
				</div>
			</div>

			<div id="body">
				<div id="masthead" style={{ height: 200, overflow: 'hidden', width: '100%' }}>
					<div id="masthead-header">
						<h1 id="top-header">
							HAVE A <strong>HIGH</strong> GUARANTEE NOTICES AND USAGE OF YOUR PRODUCT WITH AS LITTLE AS <strong>$20</strong>
						</h1>
						<div id="info-header">
							<strong>Reward</strong> users to tryout your product and give you feedback
						</div>

						<div id="learnmore" onClick={() => window.location = "/register"}>GET STARTED</div>
					</div>
					<img id="masthead-image" src="/background.jpeg" style={{ ...resizePhoto({ width: 1000, height: 597 }, window.innerWidth, 200, "width") }}/>
				</div>

				<div className="body-header">
					<div className="header">Are you finished with your MVP and want some USEFUL FEEDBACK ?</div>
					<img src="/mvp.png" style={{ height: 150, width: 150 }}/>
				</div>
				<div className="body-header">
					<div className="header">
						Don't waste your money on social media ads
						<br/>(without proof of concept)
					</div>
					<img src="/wastemoney.png" style={{ height: 300, marginTop: -70, width: 300 }}/>
				</div>
				<div className="body-header">
					<div className="header">
						We have a userbase of people who are looking
						to try new products, give their best feedback and get rewarded with $4
					</div>
					<img src="/userbase.png" style={{ height: 300, marginTop: -60, width: 300 }}/>
				</div>

				<div className="body-header">
					<div className="header">
						How it works?
					</div>
				</div>

				<div id="infos">
					<div className="info">
						<div className="info-header">(for Project creators)</div>

						<div className="info-info">
							<div className="index">1</div>
							<div className="row">
								<div className="image">
									<img src="/launchproduct.png"/>
								</div>
								<div className="header">
									Project creators can submit their product with a $20 deposit
									<br/>($4 reward for each user of 5)
								</div>
							</div>
						</div>

						<div className="info-info">
							<div className="index">2</div>
							<div className="row">
								<div className="image">
									<img src="/reward.png"/>
								</div>
								<div className="header">
									Project creators will get emails when testers write feedback about their product
								</div>
							</div>
						</div>

						<div className="info-info">
							<div className="index">3</div>
							<div className="row">
								<div className="image">
									<img src="/vote.png"/>
								</div>
								<div className="header">
									Project creators 
									<br/>
									can either reject the feedback they don't like
									<br/>or<br/>
									approve the feedback they like and the tester will be rewarded $4
									<br/>(and then iterate)
								</div>
							</div>
						</div>

						<div className="info-info">
							<div className="index">4</div>
							<div className="row">
								<div className="image">
									<img src="/accuracy.png"/>
								</div>
								<div className="header">
									The most accurate way<br/>to hit product/market fit
								</div>
							</div>
						</div>
					</div>
					<div className="info">
						<div className="info-header">(for Testers)</div>

						<div className="info-info">
							<div className="index">1</div>
							<div className="row">
								<div className="image">
									<img src="/5testers.png"/>
								</div>
								<div className="header">
									Tryout a product you like and<br/>
									try to write a GOOD feedback that the creator will like
								</div>
							</div>
						</div>

						<div className="info-info">
							<div className="index">2</div>
							<div className="row">
								<div className="image">
									<img src="/earnmoney.png"/>
								</div>
								<div className="header">
									The product creator can see the GOOD<br/>feedback, approve it and reward you $4
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="infos-header">
					That's it. It's that simple
					<br/>
					<div style={{ fontSize: 20, marginTop: 10 }}>Enjoy your feedback/earnings</div>
				</div>
			</div>

			<div id="footer">{'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}</div>
		</div>
	)
}
