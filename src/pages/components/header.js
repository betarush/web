import './header.scss';

export default function Header() {
	return (
		<div id="header">
			<div id="navs">
				<div className="page-navs">
					<div className="column"><div className="page-nav">Privacy</div></div>
					<div className="column"><div className="page-nav">Terms</div></div>
				</div>
				<div className="page-navs">
					<div className="column"><div className="page-nav">You earned: $15.90</div></div>
					<div className="column"><div className="page-nav">List your product</div></div>
					<div className="column"><div className="page-nav">Log-Out</div></div>
				</div>
			</div>
		</div>
	)
}