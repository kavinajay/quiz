import React from 'react';
import './Quiz.css';
import { useNavigate } from 'react-router-dom';
import Crete from '../Crete';

function Quiz() {
  const navigate = useNavigate();

  function handleCreateQuiz() {
    navigate('/Crete'); // Navigate to the Create Quiz page
  }
  function handleCreate() {
    navigate('/Test'); // Navigate to the Create Quiz page
  }


  return (
    <>
      <h1>Quiz creation & Store DashBoard</h1>
      <div className="main">
        <div className='cr' onClick={handleCreateQuiz}>CREATE QUIZ</div>
        <div className='di' onClick={handleCreate}>DISPLAY</div>
      </div>
    </>
  );
}

export default Quiz;
