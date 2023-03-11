import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDefaultNewsItemState, IStory, IComments, IChildrenComments } from "../Types/reduxTypes";

const initialState:IDefaultNewsItemState = {
	newsItem: {} as IStory,
	rootComments: [],
	comments: []
};

export const sliceNewsItem = createSlice({
	name: "news item",
	initialState,
	reducers: {
		setNewsItem(state, action: PayloadAction<IStory>) {
			state.newsItem = action.payload;
		},
		setRootComments(state, action: PayloadAction<IComments[]>) {
			state.rootComments = action.payload;
		},
		addComments(state, action: PayloadAction<IChildrenComments>) {
			state.comments.push(action.payload);
		},
		resetComments(state) {
			state.rootComments = [];
			state.comments = [];
		},
		setDefault(state) {
			state.newsItem = {} as IStory;
			state.rootComments = [];
			state.comments = [];
		}
	}
})

export default sliceNewsItem.reducer;