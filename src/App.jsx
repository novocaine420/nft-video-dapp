import React from 'react';
import Home from './components/Home';
import Install from './components/Install';

function App() {
	if (window.ethereum) {
		return <Home />;
	}
	return <Install />;
}

export default App;
