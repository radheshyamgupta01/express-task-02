// const handleCommentSubmit = async (blogId) => {
//   try {
//     // Assuming you have an API endpoint for adding comments
//     const response = await fetch(
//       `http://localhost:5000/addComment/${blogId}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ content: CommentData }),
//       }
//     );

//     if (response.ok) {
//       const newComment = await response.json();
//       console.log(newComment);
//       setComments((prevComments) => [...prevComments, newComment]);

//       console.log(Comments);
//       setCommentData("");
//     } else {
//       console.error("Failed to add comment");
//     }
//   } catch (error) {
//     console.error("Error adding comment:", error);
//   }
// };
import React, { useEffect, useState } from "react";

function BlogData({ allBlogs }) {
  // const [CommentData, setCommentData] = useState("");
  const [CommentData, setCommentData] = useState({});
  const [Comments, setComments] = useState([]);
  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:5000/getAllComments");

      if (response.ok) {
        const allComments = await response.json();
        setComments(allComments || []);
        console.log(Comments, "this is comments");
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    // Fetching all comments

    fetchComments();
  }, []);

  const handleCommentSubmit = async (blogId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/addComment/${blogId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: CommentData[blogId] || "" }),
        }
      );

      if (response.ok) {
        fetchComments();
        setCommentData((prevData) => ({ ...prevData, [blogId]: "" }));
        setCommentData(" ");
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/deleteComment/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // refreshing after comment deletaion
        fetchComments();
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-5 bg-sky-300 ">
      <div className="flex flex-col items-center">
        <h2 className="font-bold text-5xl mt-5 tracking-tight">Blog</h2>
      </div>
      <div
        className="grid-col-2 divide-y divide-neutral-200 max-w-xl mx-auto mt-8"
        style={{ width: "300px" }}
      >
        <div className="py-0  ">
          {allBlogs.map((item) => (
            <details
              key={item.id}
              className="group bg-gray-200  mb-1"
              style={{ width: "300px" }}
            >
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none pl-2">
                <span className="pl-2 text-bold"> {item.title}</span>
                <span className="transition group-open:rotate-180 pl-2">
                  <svg
                    fill="none"
                    height="24"
                    shape-rendering="geometricPrecision"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <p className="text-neutral-600 mt-3 text-orange-500 group-open:animate-fadeIn pl-2">
                Auther: {item.author}
              </p>
              <p className="text-neutral-600 mt-3 text-green-600 group-open:animate-fadeIn pl-2">
                Content: {item.content}
              </p>
              <label className="text-bold mt-6 pl-2">Add Comment</label>
              <hr></hr>
              {/* <input
                // value={CommentData}
                placeholder="enter comment here"
                onChange={(e) => setCommentData(e.target.value)}
                className="border"
              ></input> */}
              <input
                required
                value={CommentData[item.id] || ""}
                placeholder="enter comment here"
                onChange={(e) =>
                  setCommentData((prevData) => ({
                    ...prevData,
                    [item.id]: e.target.value,
                  }))
                }
                className="border"
              ></input>
              <button
                onClick={() => handleCommentSubmit(item.id)}
                className="mt-2 bg-blue-500 text-white rounded px-2 py-1"
              >
                Submit Comment
              </button>
              {/* <ul>
                {Comments.filter((comment) => comment.blogId === item.id).map(
                  (comment, index) => (
                    <li key={index}>
                      comment: {comment.content}{" "}
                      <button className="ml-2 border bg-red-800 text-white">
                        Delete
                      </button>
                    </li>
                  )
                )}
              </ul> */}
              {Comments.filter((comment) => comment.blogId === item.id).map(
                (comment, index) => (
                  <li key={index} className=" list-none pl-2">
                    Comment: {comment.content}
                    <button
                      className="ml-2 border bg-red-800 text-white"
                      onClick={() => handleCommentDelete(comment.id)}
                    >
                      Delete
                    </button>
                  </li>
                )
              )}
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogData;
