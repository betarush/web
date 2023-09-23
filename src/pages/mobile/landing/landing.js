import './landing.scss';
import { resizePhoto } from 'geottuse-tools';

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
						<div id="top-header">
							HAVE A <strong>HIGH</strong> GUARANTEE NOTICES AND USAGE OF YOUR PRODUCT WITH AS LITTLE AS <strong>$20</strong>
						</div>
						<div id="info-header">
							<strong>Reward</strong> users to tryout your product and give you feedbacks
						</div>

						<div id="learnmore" onClick={() => window.location = "/register"}>GET STARTED</div>
					</div>
					<img id="masthead-image" src="/background.jpeg" style={{ ...resizePhoto({ width: 1000, height: 597 }, window.innerWidth, 200, "width") }}/>
				</div>

				<div id="infos">
					<div className="info">
						<div className="info-header">
							For creators
							<div style={{ fontSize: 15 }}>(to get customer's feedback)</div>
						</div>

						<div className="info-info">
							<div className="index">1</div>
							<div className="row">
								<div className="image">
									<img src="/launchproduct.png"/>
								</div>
								<div className="header">
									Launch your product with a $20 deposit
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
									See feedbacks given by 5 users, approve them and reward them $4 of your deposit
								</div>
							</div>
						</div>

						<div className="info-info">
							<div className="index">3</div>
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
						<div className="info-header">
							For testers
							<div style={{ fontSize: 15 }}>(to earn $$)</div>
						</div>

						<div className="info-info">
							<div className="index">1</div>
							<div className="row">
								<div className="image">
									<img src="/5testers.png"/>
								</div>
								<div className="header">
									Tryout a product anyway you can and<br/>
									write a good feedback
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
									The product creator can see the GOOD<br/>feedback and reward you $4
								</div>
							</div>
						</div>
					</div>
				</div>

				<div id="infos-header">
					That's it. It's that simple
					<br/>
					<div style={{ fontSize: 20, marginTop: 10 }}>Enjoy your feedbacks/earnings</div>
				</div>
			</div>

			<div id="footer">{'Copyright © ' + new Date().getFullYear() + ' Geottuse, Inc.'}</div>
		</div>
	)
}
