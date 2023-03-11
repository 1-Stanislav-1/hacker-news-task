import React, {useEffect} from 'react';
import { Link } from "react-router-dom";
import { useTypedSelector, useTypedDispatch } from '../Hooks/reduxHooks';
import {sliceNewsItem} from "../Redux/sliceNewsItem"
import {asyncGetTopNews} from "../Redux/asyncActions";

function NewsList() {

	const news = useTypedSelector(state => state.sliceNewsList.news),
		{setNewsItem} = sliceNewsItem.actions,
		dispatch = useTypedDispatch();

	useEffect(() => {
		dispatch(asyncGetTopNews());
	}, []);


	function refreshClick() {
		dispatch(asyncGetTopNews());
	}

	function storyClick(i:number) {
		dispatch(setNewsItem(news[i]))
	}

	return <div className="NewsList">
		<h1 className="NewsList-header">News List</h1>
		<div className="NewsList-container">
			{news.length ? news.map((item, i) => {
				return <Link to="/story" style={{textDecoration: "none"}}>
					<div className="NewsList-block" key={i} onClick={() => storyClick(i)}>
						<h3 className="NewsList-newsTitle">{item.title}</h3>
						<div className="NewsList-additionalData">
							<p className="NewsList-newsBy">by: {item.by}</p>
							<p className="NewsList-newsScore">score: {item.score}</p>
							<p className="NewsList-newsTime">{new Date(item.time).toString().replace(/ GMT.+$/, "")}</p>
						</div>
					</div>
				</Link>
				}
			) : <svg className="NewsList-loading">
					<text x="75" y="130" fill="grey">Loading...</text>
					<circle cx="125" cy="125" r="120" fill="none" stroke="lightgrey" strokeWidth="2px" strokeDasharray="100 150" >
						<animate attributeName="stroke-dashoffset" begin="0s;" values="1000; 0" dur="30s" repeatCount="indefinite" />
					</circle>
					<circle cx="125" cy="125" r="100" fill="none" stroke="lightgrey" strokeWidth="2px" strokeDasharray="100 5">
						<animate attributeName="stroke-dashoffset" begin="0s;" values="0; 1500" dur="30s" repeatCount="indefinite" />
					</circle>
				</svg>
			}
		</div>
		<button className="NewsList-refreshButton" onClick={refreshClick}>Refresh</button>
	</div>
}

export default NewsList;
