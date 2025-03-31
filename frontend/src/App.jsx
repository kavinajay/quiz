import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Quiz from './assets/Quiz.jsx'
import Crete from './Crete.jsx';
import Tes from './assets/Tes.jsx';
import Conduct from './assets/Conduct.jsx';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupMode, setSignupMode] = useState(false);
  const navigate = useNavigate();

  function sign() {
    setSignupMode(true);
  }

  async function handleLogin() {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      alert(response.data);
      navigate('/dashboard'); // Redirect to the dashboard page after successful login
    } catch (error) {
      alert('Login failed');
    }
  }

  async function handleSignUp() {
    try {
      const response = await axios.post('http://localhost:5000/signup', { username, password });
      alert(response.data);
      navigate('/dashboard'); // Redirect to the welcome page after successful sign up
    } catch (error) {
      alert('Sign up failed');
    }
  }

  return (
    <><div className="app">
      <div className='l' onClick={() => setSignupMode(false)}><b>LOGIN</b></div>
      <div className='l' onClick={sign}><b>SIGN UP</b></div>
    </div><div id="c" className='c'>
        <h3>Username</h3>
        <input
          id="user"
          placeholder={signupMode ? 'set username' : 'username'}
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <h3>Password</h3>
        <input
          id="password"
          type="password"
          placeholder={signupMode ? 'set password' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button onClick={signupMode ? handleSignUp : handleLogin}>
          {signupMode ? 'SIGN UP' : 'LOGIN'}
        </button>
      </div></>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Quiz />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/Crete" element={<Crete />} />
        <Route path="/Test" element={<Tes />} />
        <Route path="/ontest" element={<Conduct/>} />
      </Routes>
    </Router>
  );
}

function Dashboard() {
  return <h1>Dashboard</h1>;
}

function Welcome() {
  return <h1>Welcome!</h1>;
}

export default App;
