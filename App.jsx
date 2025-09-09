import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const questions = [
  {
    questionText: 'What is the capital of India?',
    answerOptions: [
      { answerText: 'Kolkata', isCorrect: false },
      { answerText: 'New Delhi', isCorrect: true },
      { answerText: 'Chennai', isCorrect: false },
      { answerText: 'Mumbai', isCorrect: false },
    ],
  },
  {
    questionText: 'Which planet is known as the Red Planet?',
    answerOptions: [
      { answerText: 'Earth', isCorrect: false },
      { answerText: 'Mars', isCorrect: true },
      { answerText: 'Jupiter', isCorrect: false },
      { answerText: 'Venus', isCorrect: false },
    ],
  },
  {
    questionText: 'What is 2 + 2?',
    answerOptions: [
      { answerText: '3', isCorrect: false },
      { answerText: '4', isCorrect: true },
      { answerText: '5', isCorrect: false },
      { answerText: '6', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the largest ocean on Earth?',
    answerOptions: [
      { answerText: 'Atlantic', isCorrect: false },
      { answerText: 'Indian', isCorrect: false },
      { answerText: 'Arctic', isCorrect: false },
      { answerText: 'Pacific', isCorrect: true },
    ],
  },
  {
    questionText: 'Who painted the Mona Lisa?',
    answerOptions: [
      { answerText: 'Vincent van Gogh', isCorrect: false },
      { answerText: 'Pablo Picasso', isCorrect: false },
      { answerText: 'Leonardo da Vinci', isCorrect: true },
      { answerText: 'Claude Monet', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the capital of France?',
    answerOptions: [
      { answerText: 'London', isCorrect: false },
      { answerText: 'Berlin', isCorrect: false },
      { answerText: 'Paris', isCorrect: true },
      { answerText: 'Rome', isCorrect: false },
    ],
  },
  {
    questionText: 'Which gas do plants absorb from the atmosphere?',
    answerOptions: [
      { answerText: 'Oxygen', isCorrect: false },
      { answerText: 'Nitrogen', isCorrect: false },
      { answerText: 'Carbon Dioxide', isCorrect: true },
      { answerText: 'Hydrogen', isCorrect: false },
    ],
  },
  {
    questionText: 'How many continents are there?',
    answerOptions: [
      { answerText: '5', isCorrect: false },
      { answerText: '6', isCorrect: false },
      { answerText: '7', isCorrect: true },
      { answerText: '8', isCorrect: false },
    ],
  },
  {
    questionText: 'What is the chemical symbol for water?',
    answerOptions: [
      { answerText: 'O2', isCorrect: false },
      { answerText: 'H2O', isCorrect: true },
      { answerText: 'CO2', isCorrect: false },
      { answerText: 'NACL', isCorrect: false },
    ],
  },
  {
    questionText: 'Which animal is known as the "King of the Jungle"?',
    answerOptions: [
      { answerText: 'Tiger', isCorrect: false },
      { answerText: 'Lion', isCorrect: true },
      { answerText: 'Bear', isCorrect: false },
      { answerText: 'Elephant', isCorrect: false },
    ],
  },
];

const QUESTION_TIME_LIMIT = 30;

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [totalQuizTime, setTotalQuizTime] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (!quizStarted || showScore) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          handleAnswerSubmit(null);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestion, quizStarted, showScore]);

  useEffect(() => {
    if (!quizStarted || showScore) {
      return;
    }

    const totalTimeInterval = setInterval(() => {
      setTotalQuizTime((prevTotalTime) => prevTotalTime + 1);
    }, 1000);

    return () => clearInterval(totalTimeInterval);
  }, [quizStarted, showScore]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setTotalQuizTime(0);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setShowScore(false);
    setSelectedAnswer(null);
    setAnswerFeedback(null);
  };

  const handleAnswerOptionClick = (answer) => {
    setSelectedAnswer(answer);
    setAnswerFeedback(null);
  };

  const handleAnswerSubmit = (selectedOption) => {
    clearInterval(timerRef.current);

    const answer = selectedOption || selectedAnswer;

    if (answer && answer.isCorrect) {
      setScore(score + 1);
      setAnswerFeedback('correct');
    } else {
      setAnswerFeedback('incorrect');
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setTimeLeft(QUESTION_TIME_LIMIT);
        setSelectedAnswer(null);
        setAnswerFeedback(null);
      } else {
        setShowScore(true);
        clearInterval(timerRef.current);
      }
    }, 1500);
  };

  if (!quizStarted) {
    return (
      <div className='app'>
        <div className='quiz-card start-screen'>
          <h2>Welcome to the Quiz Application!</h2>
          <p>You will have 30 seconds for each of the {questions.length} questions.</p>
          <p>Total time taken for the quiz will be tracked.</p>
          <button className='start-button' onClick={startQuiz}>Start Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className='app'>
      {showScore ? (
        <div className='quiz-card score-section'>
          You scored {score} out of {questions.length}
          <p>Total time taken: {totalQuizTime} seconds</p>
          <button className='restart-button' onClick={startQuiz}>Restart Quiz</button>
          <p className='congrats'>
            {score === questions.length ? 'Fantastic work!' : (score >= questions.length / 2 ? 'Good job!' : 'Keep practicing!')}
          </p>
        </div>
      ) : (
        <div className='quiz-card'>
          <div className='quiz-header'>
            <div className='time-left'>Time: {timeLeft} sec</div>
            <div className='score-progress'>Score: {score}/{questions.length}</div>
          </div>
          <div className='question-section'>
            <div className='question-count'>
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className='question-text'>{questions[currentQuestion].questionText}</div>
          </div>
          <div className='answer-section'>
            {questions[currentQuestion].answerOptions.map((answerOption, index) => (
              <button
                key={index}
                onClick={() => handleAnswerOptionClick(answerOption)}
                className={`answer-button ${selectedAnswer === answerOption ? 'selected' : ''}`}
                disabled={answerFeedback !== null}
              >
                {answerOption.answerText}
              </button>
            ))}
          </div>
          {answerFeedback && (
            <div className={`feedback ${answerFeedback === 'correct' ? 'correct' : 'incorrect'}`}>
              {answerFeedback === 'correct' ? 'Correct!' : 'Incorrect!'}
            </div>
          )}
          <div className='navigation-buttons'>
            <button
              onClick={() => handleAnswerSubmit(selectedAnswer)}
              disabled={selectedAnswer === null || answerFeedback !== null}
              className='submit-button'
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;