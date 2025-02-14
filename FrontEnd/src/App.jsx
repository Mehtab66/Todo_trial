import "./App.css";
import { Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
