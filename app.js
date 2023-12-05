const { Sequelize, DataTypes } = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize("xyx", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
});

const Blog = sequelize.define("blog", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Comment = sequelize.define("comment", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Blog.hasMany(Comment);
Comment.belongsTo(Blog);

sequelize
  .sync()
  .then(() => console.log("Database is synced"))
  .catch((err) => console.error("Error syncing database:", err));

app.post("/createBlog", async (req, res) => {
  try {
    const { BlogContent, BlogAuthor, BlogTitle } = req.body;
    const newBlog = await Blog.create({
      title: BlogTitle,
      author: BlogAuthor,
      content: BlogContent,
    });
    res.json(newBlog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Internal error", detail: err.message });
  }
});

app.get("/getAllBlogs", async (req, res) => {
  try {
    const allBlogs = await Blog.findAll({
      include: Comment, // Include comments in the result
    });
    res.json(allBlogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Internal error", detail: err.message });
  }
});

app.post("/addComment/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content } = req.body;

    const blog = await Blog.findByPk(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const newComment = await Comment.create({ content :content});
    await blog.addComment(newComment);
    const allComments = await Comment.findAll({ where: { BlogId: blogId } });
    res.status(201).json(allComments);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Internal error", detail: err.message });
  }
});
app.get("/getAllComments", async (req, res) => {
  try {
    const allComments = await Comment.findAll();
    res.json(allComments);
  } catch (err) {
    console.error("error in fetching comments", err);
    res.status(500).json({ error: "internal error", detail: err.message });
  }
});
app.delete("/deleteComment/:commentId", async (req, res) => {
  try {
    const { commentId } = req.params;
     console.log(commentId,"this s is comment id")
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment", err);
    res.status(500).json({ error: "Internal error", detail: err.message });
  }
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
