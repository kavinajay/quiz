import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assets/Crete.css';

function Crete() {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    try {
      const response = await axios.get('http://localhost:5000/quizze');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  }

  async function handleAddQuiz() {
    try {
      const response = await axios.post('http://localhost:5000/quizzes', { title: newQuizTitle });
      setQuizzes([...quizzes, response.data]);
      setNewQuizTitle('');
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  }

  async function handleAddQuestion() {
    try {
      const response = await axios.post(`http://localhost:5000/quizzes/${selectedQuiz._id}/questions`, { question, options, answer });
      fetchQuizzes(); // Refresh quizzes to show the updated questions
      setQuestion('');
      setOptions(['', '', '', '']);
      setAnswer('');
    } catch (error) {
      console.error('Error adding question:', error);
    }
  }

  function toggleShowQuestions() {
    setShowQuestions(!showQuestions);
  }

  return (
    <div className="crete">
      <div className="existing-quizzes">
        <h2 className='ex'>Existing Quizzes</h2>
        {quizzes.map((quiz) => (
          <div key={quiz._id} onClick={() => setSelectedQuiz(quiz)}>
            {quiz.title}
          </div>
        ))}
      </div>

      <div className="add-quiz">
        <input
          type="text"
          placeholder="New Quiz Title"
          value={newQuizTitle}
          onChange={(e) => setNewQuizTitle(e.target.value)}
        />
        <button onClick={handleAddQuiz}>Add Quiz</button>
      </div>

      {selectedQuiz && (
        <div
          className="add-question"
        >
          <h2>Add Question to {selectedQuiz.title}</h2>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
            />
          ))}
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={handleAddQuestion}>Add Question</button>
          <button onClick={toggleShowQuestions}>
            {showQuestions ? 'Hide Questions' : 'Display Questions'}
          </button>

          {showQuestions && (
            <div className="questions-list">
              <h3>Questions in {selectedQuiz.title}</h3>
              {selectedQuiz.questions.map((q, index) => (
                <div key={index}>
                  <p><strong>Question {index + 1}:</strong> {q.question}</p>
                  <ul>
                    {q.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                  <p><strong>Answer:</strong> {q.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Crete;
