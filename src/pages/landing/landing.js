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
				<div id="masthead" style={resizePhoto({ width: 1531, height: 376 }, window.innerWidth, 200, "width")}>
					<div id="masthead-header">
						It's better to have a few people love your product than a few 
						thousands who sort of like it

						<div>
							Get rewarded with money by giving feedbacks to startup founders for
							their products
						</div>
					</div>
					<img id="masthead-image" src="/background.jpeg"/>
				</div>

				<div id="infos-header">How it works</div>

				<div id="infos">
					<div className="info">
						<div className="info-header">
							For creators
							<br/>
							<div style={{ fontSize: 25 }}>(get product feedback)</div>
						</div>

						<div className="info-info">
							<div className="header">
								Launch your product with a $20 deposit
							</div>
							<div className="image" style={{ borderRadius: 75 }}>
								<img src="/launchproduct.png"/>
							</div>
						</div>

						<div className="info-info">
							<div className="header">
								Reward 5 users each with $4 to tryout your product and provide a GOOD feedback
							</div>
							<div className="image">
								<img src="/reward.png"/>
							</div>
						</div>

						<div className="info-info">
							<div className="header">
								The most accurate way to hit product/market fit
							</div>
							<div className="image" style={{ borderRadius: 75 }}>
								<img src="/accuracy.png"/>
							</div>
						</div>
					</div>
					<div className="info">
						<div className="info-header">
							For testers
							<br/>
							<div style={{ fontSize: 25 }}>(earn $$)</div>
						</div>

						<div className="info-info">
							<div className="header">
								Tryout a product anyway you can and
								write a good feedback
							</div>
							<div className="image" style={{ borderRadius: 75, ...resizePhoto({ width: 960, height: 540 }, 300, 300) }}>
								<img src="/5testers.jpg"/>
							</div>
						</div>

						<div className="info-info">
							<div className="header">
								The product creator can see the GOOD feedback and reward you $4
							</div>
							<div className="image" style={{ borderRadius: 75, ...resizePhoto({ width: 793, height: 496 }, 300, 300) }}>
								<img src="/earnmoney.jpg"/>
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
		</div>
	)
}