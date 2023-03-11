import { TDispatch, TRootReducer, IStory, IComments } from "../Types/reduxTypes";
import { sliceNewsList } from "./sliceNewsList";
import { sliceNewsItem } from "./sliceNewsItem";

export const asyncGetTopNews = () => async (dispatch: TDispatch, getState: () => TRootReducer) => {
	(async function Loop() {
		const { setNewsArray, pushTimerId, clearTimer } = sliceNewsList.actions,
			timer = getState().sliceNewsList.timer;
		timer.forEach(item => clearTimeout(item));
		dispatch(clearTimer());
		const newsArray = [] as IStory[];
		const responseNewsNumbers = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
		const resultNewsNumbers: number[] = await responseNewsNumbers.json();
		let counter = 0;
		await new Promise<void>((success) => {
			(async function newsGetter() {
				if (newsArray.length === 100) return success();
				const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${resultNewsNumbers[counter]}.json`);
				const result:IStory = await response.json();
				if (result.type !== "story") {
					counter++;
					newsGetter();
				}
				else {
					newsArray.push(result);
					counter++;
					newsGetter();
				}
			})();
		});
		const newTimer = setTimeout(Loop, 60000);
		dispatch(pushTimerId(+newTimer));
		const sortedNewsArray = newsArray.sort((a, b) => b.time - a.time);
		return dispatch(setNewsArray(sortedNewsArray));
	})();
}

export const asyncGetRootComments = () => async (dispatch: TDispatch, getState: () => TRootReducer) => {
	const [rootCommentsId, descendants] = [getState().sliceNewsItem.newsItem.kids, getState().sliceNewsItem.newsItem.descendants],
		{setRootComments} = sliceNewsItem.actions,
		rootComments = [] as IComments[];
	if (!descendants) return;
	let counter = 0;
	await new Promise<void>((success) => {
		(async function commentsGetter() {
			if (counter === rootCommentsId.length) return success();
			const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${rootCommentsId[counter]}.json`);
			const result:IComments = await response.json();
			rootComments.push(result);
			counter++;
			commentsGetter();
		})();
	});
	return dispatch(setRootComments(rootComments));
}

export const asyncGetComments = (target:number) => async (dispatch: TDispatch, getState: () => TRootReducer) => {
	const [commentsId, targetId] = [getState().sliceNewsItem.rootComments[target].kids, getState().sliceNewsItem.rootComments[target].id],
		{addComments} = sliceNewsItem.actions,
		comments = [] as IComments[];
	let counter = 0;
	await new Promise<void>((success) => {
		(async function commentsGetter() {
			if (counter === commentsId!.length) return success();
			const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentsId![counter]}.json`);
			const result: IComments = await response.json();
			comments.push(result);
			counter++;
			commentsGetter();
		})();
	});
	let childrenCounter = 0,
		kidsCounter = 0;
	await new Promise<void>((success) => {
		(async function childrenGetter() {
			if (childrenCounter === comments.length - 1) return success();
			if (!comments[childrenCounter].kids) {
				childrenCounter++;
				childrenGetter();
			}
			else {
				const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${comments[childrenCounter].kids![kidsCounter]}.json`);
				const result: IComments = await response.json();
				comments.push(result);
				if (kidsCounter === comments[childrenCounter].kids!.length - 1) {
					kidsCounter = 0;
					childrenCounter++;
					childrenGetter();
				}
				else {
					kidsCounter++;
					childrenGetter();
				}
			}
		})();
	});
	return dispatch(addComments({parent: targetId, children: comments}));
}

export const asyncRefreshComments = () => async (dispatch: TDispatch, getState: () => TRootReducer) => {
	const {setRootComments, resetComments} = sliceNewsItem.actions;
	dispatch(resetComments());
	const [rootCommentsId, descendants] = [getState().sliceNewsItem.newsItem.kids, getState().sliceNewsItem.newsItem.descendants],
		rootComments = [] as IComments[];
	if (!descendants) return;
	let counter = 0;
	await new Promise<void>((success) => {
		(async function commentsGetter() {
			if (counter === rootCommentsId.length) return success();
			const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${rootCommentsId[counter]}.json`);
			const result:IComments = await response.json();
			rootComments.push(result);
			counter++;
			commentsGetter();
		})();
	});
	return dispatch(setRootComments(rootComments));
}