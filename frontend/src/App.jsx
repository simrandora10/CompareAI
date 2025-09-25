import { Routes, Route, Navigate } from "react-router-dom";
import SignupFormDemo from "./components/signup-form";
import LoginPage from "./components/Login-page";
import HomePage from "./components/HomePage";
import ComparisonPage from "./components/ComparisonPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/signup" element={<SignupFormDemo />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/compare" element={<ComparisonPage />}/>
    </Routes>
  );
}

export default App;
