import React, { useState, useEffect } from "react";
import api from "../utilities/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import logo from '/logo.png'

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ሁሉም");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAskBar, setShowAskBar] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [searchTerm, selectedCategory, questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/question");
      setQuestions(data);
      extractCategories(data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching questions.");
      setLoading(false);
    }
  };

  const extractCategories = (questions) => {
    const uniqueCategories = ["All", ...new Set(questions.map((q) => q.category))];
    setCategories(uniqueCategories);
  };

  const filterQuestions = () => {
    let filtered = questions;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((q) => q.text.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredQuestions(filtered);
  };

  // Handle new question submission
  const handleAskSubmit = async () => {
    if (!newQuestion.trim()) return alert("Please enter a question!");
    try {
      const { data } = await api.post("/question", { text: newQuestion, category});
      setQuestions((prev) => [data, ...prev]);
      setNewQuestion("");
      setCategory('');
      setShowAskBar(false); // Hide ask bar after submission
    } catch (err) {
      alert("Failed to submit question.");
    }
  };


  const getTopQuestions = (key, limit = 5, condition = () => true) => {
    return questions.filter(condition).sort((a, b) => b[key]?.length - a[key]?.length).slice(0, limit);
  };
    // Toggle Ask Bar visibility
    const handleAskClick = () => {
      setShowAskBar(true);
    };
    
    const truncateText = (text, maxLength = 70) => {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

  return (
    <div className="w-full mt-16 flex flex-col gap-6 px-4 lg:px-0">
      <div>
        {/* Ask Section */}
        <div className="w-full flex justify-evenly gap-6 items-center p-6 rounded-md text-center mb-6 shadow-md">
          <div>
            <img src={logo} alt="apostolic" className="w-50" />
          </div>

          <div>
            <p className="text-xl font-semibold">ስለ ኦርቶዶክስ ተዋህዶ ጥያቄ አለዎት?</p>

            <div className="flex w-full justify-between">
              <button
                onClick={handleAskClick}
                className="block mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-md">
                ይጠይቁ
              </button>
              <NavLink
                to="/register"
                className="block mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-md">
                ይመዝገቡ
              </NavLink>
            </div>
          </div>
        </div>

      {/* Ask Bar */}
      {showAskBar && (
        <div className="w-1/2 mx-auto bg-neutral-900 p-4 rounded-md shadow-md">
          <form onSubmit={handleAskSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="ጥያቄዎን ይጻፉ..."
              onChange={e=>setNewQuestion(e.target.value)}
              className="w-full p-2  rounded-sm border outline-none border-neutral-500"
            />
            <select onChange={e => setCategory(e.target.value)} className="w-full p-2 rounded-sm border outline-none border-neutral-500">
              <option value="">የጥያቄውን ክፍል ይምረጡ . . .</option>
              <option value="ትርጉም">ትርጉም</option>
              <option value="ምክንያት">ምክንያት</option>
              <option value="ነገረ ማርያም">ነገረ ማርያም</option>
              <option value="ነገረ ክርስቶስ">ነገረ ክርስቶስ</option>
              <option value="ነገረ ቅዱሳን">ነገረ ቅዱሳን</option>
              <option value="አምስቱ ምስጥራት">አምስቱ ምስጥራት</option>
              <option value="መጽሐፍ ቅዱስ">መጽሐፍ ቅዱስ</option>
            </select>
            <button
              type="submit"
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-md"
            >
              አስገባ
            </button>
          </form>

        </div>
      )}
    </div>
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-1/4 bg-neutral-900 p-4 rounded-md shadow-md">
          <div className="p-2">
            <h3 className="text-lg font-bold mt-6 text-white border-b-2 border-amber-950 mb-4">ክፍል</h3>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li
                  key={index}
                  className={`cursor-pointer ${selectedCategory === category ? "text-yellow-500 font-bold" : "hover:text-yellow-500"}`}
                  onClick={() => setSelectedCategory(category)}>
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Most Liked Questions */}
          <div className="p-2">
            <h3 className="text-lg font-bold mt-6 text-white border-b-2 border-amber-950 mb-4">ተወዳጅ ጥያቄ</h3>
            <ul>
              {getTopQuestions("likes", 5, (q) => (q.likes?.length || 0) > 0).map((q) => (
                <li key={q._id}>
                  <NavLink to={`/question/${q._id}`} className="hover:text-yellow-500">
                    {truncateText(q.text,50)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Most Answered Questions */}
          <div className="p-2">
            <h3 className="text-lg font-bold mt-6 text-white border-b-2 border-amber-950 mb-4">ባለ ብዙ መልስ</h3>
            <ul>
              {getTopQuestions("answers", 5, (q) => (q.answers?.length || 0) > 0).map((q) => (
                <li key={q._id}>
                  <NavLink to={`/question/${q._id}`} className="hover:text-yellow-500">
                    {truncateText(q.text,50)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Unanswered Questions */}
          <div className="p-2">
            <h3 className="text-lg font-bold mt-6 text-white border-b-2 border-amber-950 mb-4">ያልተመለሱ</h3>
            <ul className="flex flex-col">
              {getTopQuestions("answers", 5, (q) => q.answers.length === 0).map((q) => (
                <li key={q._id} className="text-sm mt-2 p-2 border-sm shadow-sm shadow-neutral-600">
                  <NavLink to={`/question/${q._id}`} className="hover:text-yellow-500">                   
                     {truncateText(q.text,50)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Most Visited Questions */}
          <div className="p-2">
            <h3 className="text-lg font-bold mt-6 text-white border-b-2 border-amber-950 mb-4">በብዙ የታዩ</h3>
            <ul>
              {getTopQuestions("view", 5, (q) => (q.view || 0) > 0).map((q) => (
                <li key={q._id}>
                  <NavLink to={`/question/${q._id}`} className="hover:text-yellow-500">
                    {truncateText(q.text)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded-sm border-neutral-600"
              placeholder="ጥያቄዎችን ፈልግ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative flex items-center justify-center w-16 h-16">
                <div className="absolute w-full h-full border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin delay-200"></div>
              </div>
              <p className="mt-4 text-lg font-semibold text-yellow-500 animate-pulse">Loading questions...</p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q._id} className="p-4 border-b bg-neutral-900 rounded-md shadow-md mb-4">
                <NavLink to={`/question/${q._id}`} className="font-bold text-lg hover:text-yellow-500">{q.text}</NavLink>
                <p className="text-sm text-gray-500">{q.user?.username || "Anonymous"} • {new Date(q.createdAt).toLocaleDateString()} • {q.answers.length} መልሶች  • {q.likes?.length} መውደዶች</p>
              </div>
            ))
          )}
        </main>
      </div>
  </div>
  );
};

export default Questions;
