import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utilities/axiosConfig';
import LikeButton from './LikeButton';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const { data } = await api.get(`/question/${id}`);
        setQuestion(data);
      } catch (err) {
        setError('Error fetching question details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return alert('Answer cannot be empty.');

    try {
      const { data } = await api.post(`/question/${id}/answer`, { text: answerText });
      setQuestion((prev) => ({
        ...prev,
        answers: [data.answer, ...prev.answers],
      }));
      setAnswerText('');
      setShowAnswerForm(false);
    } catch (error) {
      alert('Failed to submit answer.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin delay-200"></div>
        </div>
        <p className="mt-4 text-lg font-semibold text-yellow-500 animate-pulse">Loading questions...</p>
      </div>
    );
  }

  if (error) return <p className="text-center mt-16 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen mt-16 px-4 lg:px-16">
      <div className="bg-neutral-900 shadow-md p-6 rounded-md">
        <h1 className="text-2xl font-bold mb-4">{question.text}</h1>
        <p className="text-gray-600 mb-4">ክፍል: {question.category}</p>
        <p className="text-sm text-gray-500 mb-4">
          በ: {question.user?.username || 'Anonymous'} • {new Date(question.createdAt).toLocaleDateString()}
        </p>

        <LikeButton questionId={question._id} answerId={''} likes={question.likes} />

        {/* Give Answer Button */}
        <button
          onClick={() => setShowAnswerForm(!showAnswerForm)}
          className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition duration-300"
        >
          {showAnswerForm ? 'Cancel' : 'Give Answer'}
        </button>

        {/* Answer Form */}
        {showAnswerForm && (
          <form onSubmit={handleAnswerSubmit} className="mt-6">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="w-full p-4 border-neutral-700 border-2 rounded-md focus:outline-none"
              rows="2"
              placeholder="Write your answer here..."
            ></textarea>
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition duration-300"
            >
              Submit Answer
            </button>
          </form>
        )}
      </div>

      {/* Answers Section */}
      <div className="mt-8 pl-6">
        <h2 className="text-xl font-semibold mb-4">መልሶች</h2>
        {question.answers.length > 0 ? (
          question.answers.map((answer) => (
            <div key={answer._id} className="bg-neutral-900 p-4 rounded-md mb-4">
              <p>{answer.text}</p>
              <p className="text-sm text-gray-500 mt-2">በ {answer.user?.username || 'Anonymous'}</p>
              <LikeButton questionId={question._id} answerId={answer._id} likes={answer.likes} />
            </div>
          ))
        ) : (
          <p className="text-gray-500">እስካሁን ምንም አይነት ምላሽ አልተሰጠም! የመጀመሪያው መላሽ ይሁኑ።</p>
        )}
      </div>
    </div>
  );
}; 

export default QuestionDetail;
