import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewsList from './NewsList';
import NewsItem from './NewsItem';

function App() {
	return <Router>
		<Routes>
			<Route path="/" element={<NewsList />} />
			<Route path="/story" element={<NewsItem />} />
		</Routes>
	</Router>
}

export default App;
