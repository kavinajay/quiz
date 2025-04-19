import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './Test.css';

function Conduct() {
  const location = useLocation();
  const { quizName } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`https://quiz-rfj1.onrender.com/quizzes/search?title=${quizName}`); // Updated to Render URL
        if (response.data.questions && response.data.questions.length > 0) { // Check for valid questions
          setQuestions(response.data.questions);
          setError('');
        } else {
          setError('Quiz found, but no questions are available.');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('An error occurred while fetching the quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizName]);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === answer;

    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: currentQuestion.question, answer, isCorrect },
    ]);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) {
    return <p>Loading quiz...</p>;
  }

  return (
    <div className="quiz">
      {error && <p className="error-message">{error}</p>}
      {questions.length > 0 && !quizCompleted && (
        <div>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex].question}</p>
          <ul>
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <li
                key={idx}
                className="quiz-option"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
      {quizCompleted && (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your score: {score} / {questions.length}</p>
          <h3>Your Answers:</h3>
          <ul>
            {userAnswers.map((answer, idx) => (
              <li key={idx}>
                <strong>Question:</strong> {answer.question}<br />
                <strong>Your Answer:</strong> {answer.answer}<br />
                <strong>Correct:</strong> {answer.isCorrect ? 'Yes' : 'No'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Conduct;
