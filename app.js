const express = require("express");
const app = express();
const port = 3000;
const Sequelize = require("sequelize");

const sequelize = new Sequelize("info", "root", "123456789", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

User.sync().then(() => {
  console.log("Database is synchronized");
});

const bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <form action="/submit" method="post">
      <label for="user">Name:</label>
      <input type="text" name="user" />
      <label for="email">Email:</label>
      <input type="email" name="email" />
      <label for="password">Password:</label>
      <input type="password" name="password" />
      <button type="submit">Send</button>
    </form>
  `);
});


app.post("/submit", async (req, res) => {
  const { user, email, password } = req.body;

  try {
    // Create a new user in the database
    const newUser = await User.create({
      name: user,
      email: email,
      password: password,
    });

    console.log("User created:", newUser.toJSON());
    res.send(`${user}, ${email}, ${password}`);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
