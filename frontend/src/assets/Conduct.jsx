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
        const response = await axios.get(`http://localhost:5000/quizzes?title=${quizName}`);
        if (response.data.questions) {
          setQuestions(response.data.questions);
          setError('');
        } else {
          setError('Quiz not found or no questions available.');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('An error occurred while fetching the quiz.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizName]);

  const handleAnswer = (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.answer === answer;
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setUserAnswers([...userAnswers, { question: currentQuestion.question, answer, isCorrect }]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) {
    return <p>Loading quiz...</p>;
  }

  return (
    <div className="quiz">
      {error && <p>{error}</p>}
      {questions.length > 0 && !quizCompleted && (
        <div>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <p>{questions[currentQuestionIndex].question}</p>
          <ul>
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <li key={idx} onClick={() => handleAnswer(option)}>{option}</li>
            ))}
          </ul>
        </div>
      )}
      {quizCompleted && (
        <div>
          <p>Quiz completed! Your score: {score} / {questions.length}</p>
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
