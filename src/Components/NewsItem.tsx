import React, {ReactNode, useEffect} from 'react';
import { Link } from "react-router-dom";
import { useTypedDispatch, useTypedSelector } from '../Hooks/reduxHooks';
import { IChildrenComments, IComments } from "../Types/reduxTypes";
import { sliceNewsItem } from "../Redux/sliceNewsItem";
import { asyncGetRootComments, asyncGetComments, asyncRefreshComments } from "../Redux/asyncActions";

export default function NewsItem() {

	const [newsItem, rootComments, comments] = useTypedSelector(state => [state.sliceNewsItem.newsItem, state.sliceNewsItem.rootComments, state.sliceNewsItem.comments]),
		{setDefault} = sliceNewsItem.actions,
		dispatch = useTypedDispatch();
	
	useEffect(() => {
		dispatch(asyncGetRootComments());
	}, []);

	function showCommentsClick(event:React.MouseEvent<HTMLElement>, target:number):void {
		event.currentTarget.classList.add("hidden");
		event.currentTarget.nextElementSibling?.classList.remove("hidden");
		dispatch(asyncGetComments(target));
	}

	function renderChildrenHelper(children:IComments[], id:number, width: number):ReactNode {
		return children.map(child => {
			if (child.parent === id) {
				return <>
					<div className="NewsItem-commentBlock" key={child.id} style={{width: `${width - 30}px`}}>
						<div className='NewsItem-commentAdditionalData'>
							<p className="NewsItem-commentBy">by: {child.by}</p>
							<p className="NewsItem-commentDate">{new Date(child.time!).toString().replace(/ GMT.+$/, "")}</p>
						</div>
						<div className="NewsItem-commentText" dangerouslySetInnerHTML={{ __html: child.text }}></div>
					</div>
					{child.kids && renderChildrenHelper(children, child.id, width - 30)}
				</>
			}
		});
	}

	function renderChildren(comments:IChildrenComments):ReactNode {
		return comments.children.map(item => {
			if (comments.parent === item.parent) {
				return <>
					<div className="NewsItem-commentBlock" key={item.id} style={{width: "578px"}}>
						<div className='NewsItem-commentAdditionalData'>
							<p className="NewsItem-commentBy">by: {item.by}</p>
							<p className="NewsItem-commentDate">{new Date(item.time!).toString().replace(/ GMT.+$/, "")}</p>
						</div>
						<div className="NewsItem-commentText" dangerouslySetInnerHTML={{ __html: item.text }}></div>
					</div>
					{item.kids && renderChildrenHelper(comments.children, item.id, 578)}
				</>
			}
		})
	}

	function refreshButtonClick():void {
		dispatch(asyncRefreshComments());
	}

	function backButtonClick():void {
		dispatch(setDefault());
	}

	return <div className="NewsItem">
		<h2 className="NewsItem-title">{newsItem.title}</h2>
		<div className="NewsItem-container">
			<div className='NewsItem-additionalData'>
				<p className="NewsItem-by">by: {newsItem.by}</p>
				<p className="NewsItem-date">{new Date(newsItem.time!).toString().replace(/ GMT.+$/, "")}</p>
			</div>
			<a href={newsItem.url} className="NewsItem-link">URL: {newsItem.url}</a>
			<div className="NewsItem-buttonsContainer">
				<Link to="/">
					<button className="NewsItem-back" onClick={backButtonClick}>Back</button>
				</Link>
				<button className="NewsItem-Refresh" onClick={refreshButtonClick}>Refresh</button>
			</div>
			<p className="NewsItem-commentsTotal">comments total: {newsItem.descendants}</p>
			<div className="NewsItem-commentsContainer">
				{rootComments.length ? rootComments.map((item, i) => <>
						<div className="NewsItem-commentBlock" key={item.id}>
							<div className='NewsItem-commentAdditionalData'>
								<p className="NewsItem-commentBy">by: {item.by}</p>
								<p className="NewsItem-commentDate">{new Date(item.time!).toString().replace(/ GMT.+$/, "")}</p>
							</div>
							<div className="NewsItem-commentText" dangerouslySetInnerHTML={{ __html: item.text }}></div>
							{item.kids?.length && (!comments.length || !comments.find(comment => comment.parent === item.id)) && <>
								<p className="NewsItem-showComments" onClick={(event) => showCommentsClick(event, i)}>show comments</p>
								<p className="NewsItem-showCommentsLoading hidden">loading...</p>
							</>}
						</div>
						{comments.find(comment => comment.parent === item.id) && renderChildren(comments.find(comment => comment.parent === item.id)!)}
					</>
				) : newsItem.descendants ?
					<svg className="NewsItem-loading">
						<text x="75" y="130" fill="grey">Loading...</text>
						<circle cx="125" cy="125" r="120" fill="none" stroke="lightgrey" strokeWidth="2px" strokeDasharray="100 150" >
							<animate attributeName="stroke-dashoffset" begin="0s;" values="1000; 0" dur="30s" repeatCount="indefinite" />
						</circle>
						<circle cx="125" cy="125" r="100" fill="none" stroke="lightgrey" strokeWidth="2px" strokeDasharray="100 5">
							<animate attributeName="stroke-dashoffset" begin="0s;" values="0; 1500" dur="30s" repeatCount="indefinite" />
						</circle>
					</svg> : ""
				}
			</div>
		</div>
	</div>
}