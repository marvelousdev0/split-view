import "./App.css";
import Sidebar from "./components/Sidebar";
import SplitView from "./components/SplitView";

function App() {
  return (
    <div className="app">
      <div className="container">
        <SplitView
          left={<Sidebar />}
          right={<div style={{ margin: "1rem" }}>Right item</div>}
        />
      </div>
    </div>
  );
}

export default App;
