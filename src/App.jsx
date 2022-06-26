import React from 'react';
import Home from './components/Home';
import Install from './components/Install';

// const API_KEY = '83cvWr3Pz27DGyGTi3DUDfo5nC0BQ5iC';

function App() {
	if (window.ethereum) {
		return <Home />;
	}
	return <Install />;
}

export default App;
