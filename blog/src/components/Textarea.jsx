import React from "react";
import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }], // Headings (H1, H2, normal text)
    ["bold", "italic", "underline", "strike"], // Text styling
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
    [{ indent: "-1" }, { indent: "+1" }], // Indentation
    [{ align: [] }], // Text alignment
    ["blockquote", "code-block"], // Blockquote and Code block
    ["link", "image", "video"], // Media options
    ["clean"], // Remove formatting
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "script",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];

const Textarea = ({ content, setContent }) => {
    const quillEditor = useMemo(() => {
      return (
        <ReactQuill
          className="w-full bg-white"
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
        />
      );
    }, [content]);
  
    return (
      <div>
        <label className="block font-medium">Content:</label>
        {quillEditor}
      </div>
    );
};

export default Textarea;
