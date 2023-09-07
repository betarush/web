import './landing.scss';
import { resizePhoto } from 'geottuse-tools';

export default function Landing() {
	return (
		<div id="landing">
			<div id="landing-header">
				<div id="title">GETPRODUCTFEEDBACK</div>

				<div id="navs">
					<div className="nav" onClick={() => window.location = '/register'}>REGISTER</div>
					<div className="nav" onClick={() => window.location = '/login'}>LOGIN</div>
				</div>
			</div>

			<div id="body">
				<div id="masthead" style={resizePhoto({ width: 626, height: 237 }, window.innerWidth, 200, "width")}>
					<div id="masthead-header" style={resizePhoto({ width: 626, height: 237 }, window.innerWidth, 200, "width")}>
						It's better to have a few people love your product than a few 
						thousands who sort of like it
					</div>
					<img src="/background.jpeg"/>
				</div>

				<div id="infos">
					<div className="info">
						<div className="info-header">For creators</div>

						<div className="info-info">
							<div className="header">
								Creators can launch products they built and deposit $20
							</div>
							<div className="image" style={{ borderRadius: 75 }}>
								<img src="/launchproduct.png"/>
							</div>
						</div>

						<div className="info-info">
							<div className="header">
								Reward maximum of 5 users each $4 to explore/tryout your product and give you feedback
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
						<div className="info-header">For testers</div>

						<div className="info-info">
							<div className="header">
								A product can be tested by only a maximum of 5 users
							</div>
							<div className="image" style={{ borderRadius: 75, ...resizePhoto({ width: 960, height: 540 }, 300, 300) }}>
								<img src="/5testers.jpg"/>
							</div>
						</div>

						<div className="info-info">
							<div className="header">
								A tester can explore/tryout a product anyway they can and
								write a good feedback
							</div>
							<div className="image" style={{ borderRadius: 75, ...resizePhoto({ width: 1000, height: 563 }, 300, 300) }}>
								<img src="/givingfeedback.jpg"/>
							</div>
						</div>

						<div className="info-info">
							<div className="header">
								The creator can see the feedback and reward the tester with $4
							</div>
							<div className="image" style={{ borderRadius: 75, ...resizePhoto({ width: 793, height: 496 }, 300, 300) }}>
								<img src="/earnmoney.jpg"/>
							</div>
						</div>
					</div>
				</div>

				<div id="infos-header">That's it. It's that simple</div>
			</div>
		</div>
	)
}