import React from 'react';
import { Link } from "react-router-dom";


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
								<div href="/api/apart/main" className="button alt">View More</div>
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
						<li><div href="/house/house/main" className="button alt">View More</div></li>
					</ul>
				</div>
				<div>
					<header>
						<h3>Sed Magna</h3>
					</header>
					<p>Suspendisse mauris. Fusce accumsan mollis eros. Pellentesque a diam sit amet mi ullamcorper vehicula.</p>
					<ul className="actions">
						<li><div href="/api/main" className="button alt">Learn More</div></li>
					</ul>
				</div>
			</div>
		</div>
	</section>
    </>
  );
  
}

export default SectionTwo;