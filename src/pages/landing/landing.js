import './landing.scss';
import { resizePhoto } from 'geottuse-tools';

export default function Landing() {
	return (
		<div id="landing">
			<div id="landing-header">
				<div id="title">GETPRODUCTFEEDBACK</div>

				<div id="navs">
					<div className="nav">REGISTER</div>
					<div className="nav">LOGIN</div>
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
							Creators can launch products they built and deposit $20
						</div>
					</div>
					<div className="info">
						<div className="info-header">For testers</div>

						<div className="info-info">
							A product can be tested by only a maximum of 5 users
						</div>

						<div className="info-info">
							A tester can explore/tryout a product anyway they can and
							write a good feedback
						</div>

						<div className="info-info">
							The creator can see the feedback and reward the tester with $4
						</div>
					</div>
				</div>

				<div id="infos-header">That's it. Simple as that</div>
			</div>
		</div>
	)
}