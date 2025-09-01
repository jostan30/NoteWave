import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Signin from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Test from './pages/Test';

function App() {
  const isLoggedIn = false; // replace with real auth logic

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="test" element={<Test/>}/>
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />}
      />
    </Routes>
  );
}

export default App;
