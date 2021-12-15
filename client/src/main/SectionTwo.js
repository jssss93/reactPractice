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
						OPEN_API<br />
						EJS -{'>'} React
					</p>
					<ul className="actions">
						<li>
							<Link to="/apart">
								<div className="button alt">View More</div>
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
						OPEN_API<br/>
						EJS -{'>'} React
					</p>
					<ul className="actions">
						<li>
							<Link to="/house">
								<div className="button alt">View More</div>
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<header>
						<h3>개발 로그 확인하기</h3>
					</header>
					<p>
						Node JS(14.16v) - Express<br/>
						MongoDB(4.4.4v) - Mongoose <br/>
						Custom<br/>
						React
					</p>
					<ul className="actions">
						<li>
							<Link to="/devLog">
								<div className="button alt">View More</div>
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
    </>
  );
  
}

export default SectionTwo;