import './App.css';
import { Header } from './components/header/Header';
import { Schedule } from './components/schedule/Schedule';
import { SidebarLeft } from './components/sidebarLeft/SidebarLeft';
import { SidebarRight } from './components/sidebarRight/SidebarRight';

function App() {
  return (
    <div className="wrapper">
      <Header /> 
      <div className="main">
      <SidebarLeft />
      <Schedule />
      <SidebarRight />
      </div>
    </div>
  );
}

export default App;
