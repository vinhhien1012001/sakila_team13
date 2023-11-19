import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Logger from "./screen/Logger";
import Login from "./screen/Login";
import ActorsList from "./screen/Actors";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/actors-list" element={<ActorsList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
