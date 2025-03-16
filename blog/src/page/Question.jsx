import React, { useState, useEffect, useContext } from "react";
import { FaThumbsUp } from "react-icons/fa";
import api from "../utilities/axiosConfig"; // Import the axios config
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]); // For search filtering
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {user} = useAuth()

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fetch all questions
  const fetchQuestions = async () => {
    try {
      const { data } = await api.get("/question");
      setQuestions(data);
      setFilteredQuestions(data); // Initialize search results
    } catch (err) {
      setError("Error fetching questions.");
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((q) =>
        q.text.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  };

  // Submit a new question
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      setLoading(true);
      const { data } = await api.post("/question", {
        text: newQuestion,
        isAnonymous: true,
      });
      setQuestions([data.question, ...questions]); // Add new question to UI
      setFilteredQuestions([data.question, ...questions]); // Update search results
      setNewQuestion("");
    } catch (err) {
      setError("Failed to post question.");
    } finally {
      setLoading(false);
    }
  };

  // Submit an answer
  const handleAnswer = async (questionId) => {
    if (!newAnswer[questionId]?.trim()) return;

    try {
      const { data } = await api.post(`/question/${questionId}/answer`, {
        text: newAnswer[questionId],
      });

      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId ? { ...q, answers: [...q.answers, data.answer] } : q
        )
      );
      setFilteredQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q._id === questionId ? { ...q, answers: [...q.answers, data.answer] } : q
        )
      );
      setNewAnswer({ ...newAnswer, [questionId]: "" });
    } catch (err) {
      setError("Failed to post answer.");
    }
  };

  return (
    <div className="mt-14 mx-auto p-6 flex-col justify-between gap-6 w-full max-w-6xl">
      {/* Ask a question */}
      <div className="w-full h-[25vh] lg:h-[50vh] flex lg:gap-6 justify-between flex-col lg:flex-row mt-16 ">
          <div className="w-full lg:w-6xl flex flex-col gap-6 items-center justify-center"> 
            <p className="text-2xl">ስለ ኦርቶዶክስ ተዋህዶ ጥያቄ አለዎት?</p>
            {user 
                ? 
                  <NavLink to='/ask' className='bg-yellow-600 mx-auto lg:mx-0 hover:bg-yellow-700 transition-all duration-300 text-center p-2 rounded-sm w-30 font-bold text-black hover:text-amber-950 font-abysinica text-2xl cursor-pointer'>ይጠይቁ</NavLink>
                :
                  <NavLink to='/register' className='bg-yellow-600 mx-auto lg:mx-0 hover:bg-yellow-700 transition-all duration-300 text-center p-2 rounded-sm w-30 font-bold text-black hover:text-amber-950 font-abysinica text-2xl cursor-pointer'>ይመዝገቡ</NavLink>
            }
          </div>
          <div className="flex flex-col items-center justify-center">
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleAskQuestion} className="w-full flex gap-3 justify-center items-center mb-6">
              <input
                className="w-100 p-2 outline-none border rounded-md border-neutral-500"
                placeholder="Ask a question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                disabled={loading}
              />
                <button
                  type="submit"
                  className="py-2 bg-yellow-600 text-black cursor-pointer font-bold rounded-md px-8 disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? "እየለጠፈ ነው..." : "ጠይቅ"}
                </button>
            </form>
          </div>
      </div>

        {/* List of Questions */}
        <div className="lg:w-3/5 w-full">
          {/* Search bar */}
          <div className="mb-4 lg:sticky lg:top-14 bg-[#0F0F0F] p-2 h-14">
            <input
              type="text"
              className="w-full p-2 border rounded-md border-neutral-500 outline-none"
              placeholder="ጥያቄዎችን ፈልግ. . ."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <div key={q._id} className="p-4 border-b mb-4">
                <p className="font-bold">{q.text}</p>
                <p className="text-sm text-gray-500">
                  {q.user?.username || "Anonymous"} • {q.answers.length} መልሶች
                </p>

                {/* Like button */}
                <button
                  className="mt-2 flex items-center text-gray-500 hover:text-blue-500"
                >
                  <FaThumbsUp className="mr-1" /> {q.likes}
                </button>

                {/* Display answers */}
                <div className="ml-4 mt-2 border-l pl-4">
                  {q.answers.length > 0 ? (
                    q.answers.map((ans, index) => (
                      <p key={index} className="text-gray-700">
                        {ans?.user?.username || "Anonymous"}: {ans?.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-400">ምንም መልስ የለም</p>
                  )}
                </div>

                {/* Answer input */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Write an answer..."
                    value={newAnswer[q._id] || ""}
                    onChange={(e) =>
                      setNewAnswer({ ...newAnswer, [q._id]: e.target.value })
                    }
                  />

                  <button
                    onClick={() => handleAnswer(q._id)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-md"
                  >
                    መልስ
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">የተገኘ ጥያቄ የለም።</p>
          )}
        </div>
    </div>
  );
};

export default Questions;
