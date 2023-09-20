import './landing.scss';
import { resizePhoto } from 'geottuse-tools';

export default function Landing() {
	return (
		<div id="landing">
			<div id="landing-header">
				<div className="row">
					<div className="column">
						<div id="logo">
		      		<img src="/logo.png"/>
		      	</div>
					</div>

					<div id="title">GET PRODUCT FEEDBACK</div>
				</div>

				<div className="column">
					<div id="navs">
						<div className="nav" onClick={() => window.location = '/register'}>REGISTER</div>
						<div className="nav" onClick={() => window.location = '/login'}>LOGIN</div>
					</div>
				</div>
			</div>

			<div id="body">
				<div id="masthead" style={{ height: window.innerHeight * 0.8, overflow: 'hidden', width: '100%' }}>
					<div id="masthead-header">
						<div id="top-header">
							HAVE A <strong>HIGH</strong> GUARANTEE NOTICE AND USAGE OF YOUR PRODUCT WITH LITTLE INVESTMENT
						</div>
						<div id="info-header">
							Reward users to tryout your product and give you feedbacks
						</div>

						<div id="learnmore" onClick={() => window.location = "/register"}>GET STARTED</div>
					</div>
					<img id="masthead-image" src="/background.jpeg" style={{ ...resizePhoto({ width: 1000, height: 597 }, window.innerWidth, 200, "width") }}/>
				</div>

				<div id="infos">
					<div className="info">
						<div className="info-header">
							For creators (get product feedback)
						</div>

						<div className="info-row">
							<div className="row">
								<div className="info-info">
									<div className="index">1</div>
									<div className="header">
										Launch your product with a $20 deposit
									</div>
									<div className="image">
										<img src="/launchproduct.png"/>
									</div>
								</div>

								<div className="info-info">
									<div className="index">2</div>
									<div className="header">
										See feedbacks given by 5 users, approve them and reward them $4 of your deposit
									</div>
									<div className="image" style={{ marginTop: -30 }}>
										<img src="/reward.png"/>
									</div>
								</div>

								<div className="info-info">
									<div className="index">3</div>
									<div className="header">
										The most accurate way<br/>to hit product/market fit
									</div>
									<div className="image">
										<img src="/accuracy.png"/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="info">
						<div className="info-header">
							For testers (to earn $$)
						</div>

						<div className="info-row">
							<div className="row">
								<div className="info-info">
									<div className="index">1</div>
									<div className="header">
										Tryout a product anyway you can and<br/>
										write a good feedback
									</div>
									<div className="image" style={{ marginTop: -30 }}>
										<img src="/5testers.png"/>
									</div>
								</div>

								<div className="info-info">
									<div className="index">2</div>
									<div className="header">
										The product creator can see the GOOD<br/>feedback and reward you $4
									</div>
									<div className="image" style={{ marginTop: -30 }}>
										<img src="/earnmoney.png"/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="infos-header">
					That's it. It's that simple
					<br/>
					<div style={{ fontSize: 30, marginTop: 10 }}>Enjoy your feedbacks/earnings</div>
				</div>
			</div>

			<div id="footer">{'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}</div>
		</div>
	)
}