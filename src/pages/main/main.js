import './main.scss';

// components
import Header from '../components/header'

export default function Main() {
	return (
		<div id="main">
			<Header/>

			<div id="main">
				<div className="row">
					<div className="page-navs">
						<div className="column"><div className="page-nav">Untested by you</div></div>
						<div className="column"><div className="page-nav">Testing by you</div></div>
					</div>
				</div>

				<div id="products">
					<div className="product">
						<div className="image">
							<img src=""/>
						</div>
						<div className="desc">
							<div style={{ fontWeight: 'bold' }}>product name</div><br/>
							this is the product description this is the product description 
							this is the product description this is the product description this is the product description 
							this is the product description this is the product description
						</div>
						<div className="column">
							<div className="info">
								<div className="header">3 people left can try</div>
								<div className="action" onClick={() => {}}>Try and earn $2</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}