import {combineReducers, configureStore} from "@reduxjs/toolkit";
import sliceNewsList from "./sliceNewsList";
import sliceNewsItem from "./sliceNewsItem";

export const rootReducer = combineReducers({
    sliceNewsList,
    sliceNewsItem
});

export const setStore = () => configureStore({reducer: rootReducer});