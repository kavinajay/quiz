import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Test.css';
import axios from 'axios';

function Tes() {
  const [quizName, setQuizName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loader state
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!quizName.trim()) { // Enhanced validation logic
      setError('Please enter a valid quiz name.');
      return;
    }

    setIsLoading(true); // Show loading state
    setError('');

    try {
      const response = await axios.get(`https://quiz-rfj1.onrender.com/quizzes/search?title=${quizName}`); // Updated endpoint
      if (response.data.questions && response.data.questions.length > 0) { // Check if questions exist
        navigate('/ontest', { state: { quizName, questions: response.data.questions } }); // Pass questions data
      } else {
        setError('Quiz found, but no questions are available.');
      }
    } catch (error) {
      console.error('Error validating quiz name:', error);
      setError('An error occurred while validating the quiz name. Please try again later.');
    }

    setIsLoading(false); // Hide loading state
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
      <button onClick={handleStart} disabled={isLoading}>
        {isLoading ? 'Validating...' : 'Start'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Tes;
