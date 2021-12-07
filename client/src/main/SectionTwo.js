import React from 'react';
import { Link, Route, Switch, BrowserRouter as Router } from "react-router-dom";


function SectionTwo(props) {
  return (
    <>
    <section id="two" className="wrapper style3">
		<div className="inner">
			<div id="flexgrid">
				<div>
					<header>
						<h3>아파트 가격 확인하기</h3>
					</header>
					<p>
						Node JS(14.16v) - Express<br/>
						MongoDB(4.4.4v) - Mongoose <br/>
						OPENAPI<br />
						EJS
					</p>
					<ul className="actions">
						<li>
							<Link to="/apart">
								<a href="/api/apart/main" className="button alt">View More</a>
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<header>
						<h3>건물 가격 확인하기</h3>
					</header>
					<p>
						Node JS(14.16v) - Express<br/>
						MongoDB(4.4.4v) - Mongoose <br/>
						OPENAPI<br/>
						EJS
					</p>
					<ul className="actions">
						<li><a href="/house/house/main" className="button alt">View More</a></li>
					</ul>
				</div>
				<div>
					<header>
						<h3>Sed Magna</h3>
					</header>
					<p>Suspendisse mauris. Fusce accumsan mollis eros. Pellentesque a diam sit amet mi ullamcorper vehicula.</p>
					<ul className="actions">
						<li><a href="/api/main" className="button alt">Learn More</a></li>
					</ul>
				</div>
			</div>
		</div>
	</section>
    </>
  );
  
}

export default SectionTwo;