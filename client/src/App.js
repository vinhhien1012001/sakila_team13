import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logger from "./screen/Logger";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Logger />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
