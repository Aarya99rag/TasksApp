import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Signup/SignUp";
import Todo from "./pages/Home/Todo";

const routes = (
  // In JavaScript, when you write JSX (like in your <Router> and <Routes>), you need to return it in a single expression.Without parentheses, the JavaScript code could get confusing or misinterpreted because the JSX spans multiple lines.When the JSX expression is complex and spans multiple lines, parentheses ensure everything inside is part of a single returnable entity. Without parentheses, JavaScript might treat the JSX incorrectly, potentially causing errors.
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
);

function App() {
  return <div>{routes}</div>;
}

export default App;


// <Navigate to="/dashboard" />:

// The Navigate component is used to redirect users from one route to another.
// When the user accesses / (default path), they will be redirected to /dashboard.
// URL Behavior:

// When you run the project, visiting http://localhost:5173/ will automatically redirect to http://localhost:5173/dashboard.