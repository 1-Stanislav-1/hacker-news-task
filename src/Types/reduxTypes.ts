import { rootReducer, setStore } from "../Redux/store";

export interface IDefaultNewsItemState {
	newsItem: IStory;
	rootComments: IComments[],
	comments: IChildrenComments[]
}

export interface IComments {
	by: string,
	id: number,
	kids?: number[],
	parent: number,
	text: string,
	time: number,
	type: string
}

export interface IChildrenComments {
	parent: number,
	children: IComments[]
}

export interface IDefaultNewsListState {
	news: IStory[],
	timer: number[]
}

export interface IStory {
	by: string,
	descendants: number,
	id: number,
	kids: number[],
	score: number,
	time: number,
	title: string,
	type: string,
	url: string
}

export type TRootReducer = ReturnType<typeof rootReducer>;

type TStore = ReturnType<typeof setStore>;

export type TDispatch = TStore["dispatch"];