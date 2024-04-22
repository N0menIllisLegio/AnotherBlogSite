import './assets/App.css'
import NavigationBar from "./components/NavigationBar.tsx";
import {Outlet} from "react-router";

function App() {
  
  return (
    <div>
        <NavigationBar />
        <div className="pageContent">
            <Outlet />
        </div>
    </div>
  )
}

export default App
