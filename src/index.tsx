import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { setStore } from './Redux/store';
import App from './Components/App';
import './Styles/styles.scss';

const store = setStore();

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<Provider store={store}>
		<App />
	</Provider >
);
