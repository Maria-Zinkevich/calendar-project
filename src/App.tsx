import './App.css';
import { Header } from './components/header/Header';
import { Schedule } from './components/schedule/Schedule';
import { SidebarLeft } from './components/sidebarLeft/SidebarLeft';
import { SidebarRight } from './components/sidebarRight/SidebarRight';
import { Provider } from 'react-redux';
import { store } from './redux/store';

function App() {
	return (
		<Provider store={store}>
			<div className="wrapper">
				<Header /> 
				<div className="main">
					<SidebarLeft />
					<Schedule />
					<SidebarRight />
				</div>
			</div>
		</Provider>
	);
}

export default App;
