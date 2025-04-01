import React, { useEffect, useState } from 'react';
import api from '../utilities/axiosConfig';
import { useNavigate } from 'react-router-dom';

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get('/question');
        setQuestions(res.data);
      } catch (err) {
        setError("Failed to fetch questions.");
      }
    };

    fetchQuestions();
  }, []);

  // Handle View Question
  const handleView = (id) => {
    navigate(`/question/${id}`);
  };

  return (
    <div className="px-6 py-2">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>

      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-neutral-900 border-neutral-500">
            <th className="border p-2">Author</th>
            <th className="border p-2">Question</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question._id}>
              <td className="border border-neutral-500 p-2">{question.user?.username || "Anonymous"}</td>
              <td className="border border-neutral-500 p-2">{question.text}</td>
              <td className="border border-neutral-500 p-2 flex justify-center">
                <button
                  onClick={() => handleView(question._id)}
                  className="bg-green-500 text-white px-3 py-1 cursor-pointer rounded hover:bg-green-700"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuestions;
