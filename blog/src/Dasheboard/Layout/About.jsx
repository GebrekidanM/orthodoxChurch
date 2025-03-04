import React, { useState } from "react";
import Textarea from "../../components/Textarea";
import api from "../../utilities/axiosConfig";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";

const About = () => {
    const [content, setContent] = useState("");
    const [error,setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError("Content cannot be empty!");
            return;
        }

        try {
            await api.post("/layout/about", { content });
            navigate('/mainadmin?page=layout')
            setContent("");

        } catch (error) {
            setError(error);
        }
    };

    return (
        <div className="w-full flex justify-center mt-10">
            <Card>
                <p className="text-center font-bold text-2xl">Update About</p>
                {error && <p className="text-red-600">{error}</p>}
                <form onSubmit={handleSubmit} className="w-full p-6">
                    <Textarea content={content} setContent={setContent} />
                    <input
                        type="submit"
                        value="Submit"
                        className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 cursor-pointer transition"
                    />
                </form>
            </Card>
            
        </div>
    );
};

export default About;
