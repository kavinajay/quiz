import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Test.css';
import axios from 'axios';

function Tes() {
  const [quizName, setQuizName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!quizName) {
      setError('Please enter a quiz name.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/quizzes?title=${quizName}`);
      if (response.data.questions) {
        setError('');
        navigate(`/ontest`, { state: { quizName } });  // Navigate to Conduct component
      } else {
        setError('Quiz not found or no questions available.');
      }
    } catch (error) {
      console.error('Error validating quiz name:', error);
      setError('An error occurred while validating the quiz name.');
    }
  };

  return (
    <div className="quiz-start">
      <h1>Enter the Quiz Name</h1>
      <input
        type="text"
        placeholder="Quiz name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
      />
      <button onClick={handleStart}>Start</button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Tes;
