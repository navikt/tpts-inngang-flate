import './index.less';
import React from 'react';

import { Header } from './components/header/header';

function App() {
	return (
		<div>
			<header>
				<Header />
			</header>
			<body>
				<div>Her kommer innhold</div>
			</body>
		</div>
	);
}

export default App;
