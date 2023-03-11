import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStory,IDefaultNewsListState } from "../Types/reduxTypes";

const initialState:IDefaultNewsListState = {
	news: [],
	timer: []
};

export const sliceNewsList = createSlice({
	name: "news list",
	initialState,
	reducers: {
		setNewsArray(state, action: PayloadAction<IStory[]>) {
			state.news = action.payload;
		},
		pushTimerId(state, action: PayloadAction<number>) {
			state.timer.push(action.payload);
		},
		clearTimer(state) {
			state.timer = [];
		}
	}
})

export default sliceNewsList.reducer;