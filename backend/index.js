require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { authenticateToken } = require("./utilities");
const User = require("./models/userSchema");
const Note = require("./models/noteSchema");
const Todo = require("./models/todoSchema");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(process.env.ATLAS_CONN);
}

app.use(
  cors({
    origin: "*",
  })
);
// cors middleware: Enables sharing resources across domains. origin: "*": Allows requests from any domain (public access). This is useful for development but not recommended for production (use specific domains like http://example.com).

app.get("/", (req, res) => {
  res.json({
    data: "hello",
  });
});

// User API
// Get user api
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({
    _id: user._id,
  });

  if (!isUser) {
    return res.sendStatus(401).json({
      // The backend should send an appropriate HTTP status code (such as 400 for a bad request) when an error occurs. Without the status code, the frontend may not recognize the response as an error and might not show the message properly.
      error: true,
      message: "User not found",
    });
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "User found successfully",
  });
});

// Create Account
app.post("/create-account", async (req, res) => {
  // console.log(req.body);
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please provide all details : fullName, email, password",
    });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    email,
    password: hash,
  });
  await user.save();

  // When a user signs up (creates an account), you generate a JWT after successfully storing their information in the database. Reason: You want to authenticate the user immediately after account creation and log them in automatically.
  const accessToken = jwt.sign({ user }, process.env.SECRET_KEY, {
    expiresIn: "36000m",
    // 36000m means 36,000 minutes.
    // 36000 minutes = 600 hours
    // 600 hours = 25 days (because 1 day = 24 hours)
  });
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
  // hoppscotch response : Thus using express.json() middleware helped here as we are sending json data(content type : application/json), which is why server is able to parse json data properly and send response.
  // {
  //     "error": false,
  //     "user": {
  //       "fullName": "Sukuna Ryomen",
  //       "email": "sukuna@gmail.com",
  //       "password": "Suk@99",
  //       "createdOn": "2024-11-26T17:31:09.763Z",
  //       "_id": "674607e1710873b6179e3f53",
  //       "__v": 0
  //     },
  //     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZ1bGxOYW1lIjoiU3VrdW5hIFJ5b21lbiIsImVtYWlsIjoic3VrdW5hQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiU3VrQDk5IiwiY3JlYXRlZE9uIjoiMjAyNC0xMS0yNlQxNzozMTowOS43NjNaIiwiX2lkIjoiNjc0NjA3ZTE3MTA4NzNiNjE3OWUzZjUzIiwiX192IjowfSwiaWF0IjoxNzMyNjQyNzg1LCJleHAiOjE3MzQ4MDI3ODV9.1gEsYKpw8L9Ka2-25nElVOFXMu7IqoskeCR1hLBvc6c",
  //     "message": "Registration Successful"
  // }S
});

// Login
app.post("/login", async (req, res) => {
  //Security: When you're sending sensitive data like passwords, POST is preferred because it ensures that the data is sent in the body of the request, which is more secure than sending it in the URL (which happens with GET requests).
  //Semantics: POST is designed for creating or submitting data (even if you're not adding data to the database, you're submitting data to check its validity). The login process is a form of data submission to the server.
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Please provide email and password",
    });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (!(await bcrypt.compare(password, userInfo.password))) {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  } else {
    const user = { user: userInfo };
    // const user = {
    //     user: {
    //       name: 'John',
    //       email: 'john@example.com'
    //     }
    // };
    // When a user logs in with their credentials (e.g., email and password), you validate their information and generate a new JWT.Reason: A new JWT is created to authenticate the user and maintain their session without requiring session storage (stateless).
    const accessToken = jwt.sign(user, process.env.SECRET_KEY, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
    // {
    //     "error": false,
    //     "message": "Login Successful",
    //     "email": "sukuna@gmail.com",
    //     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3NDYwN2UxNzEwODczYjYxNzllM2Y1MyIsImZ1bGxOYW1lIjoiU3VrdW5hIFJ5b21lbiIsImVtYWlsIjoic3VrdW5hQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiU3VrQDk5IiwiY3JlYXRlZE9uIjoiMjAyNC0xMS0yNlQxNzozMTowOS43NjNaIiwiX192IjowfSwiaWF0IjoxNzMyNjQ3MjQwLCJleHAiOjE3MzQ4MDcyNDB9.hjNPz01yujrB-60PH1sqKSTqHGJx6vrykwMIJxV_Vds"
    // }
  }
});

// note API
// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  // console.log(req.body);
  // console.log(req.user.user);
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Show all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  // console.log("req.user:", req.user);
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  // console.log(req.params);
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({
      error: true,
      message: "No changes provided",
    });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "No such note found",
      });
    }

    if (title) note.title = title;
    // If the if block contains only one statement, you can omit the curly braces. A return is only necessary if you need to send a value back from a function. In this case, we are simply updating changes in the database not returning anything.
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
      // ex. when u mess up the note id length
    });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    const nnote = await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      nnote,
      message: "Note deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Pin note
app.patch("/pin-note/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { user } = req.user;
  const { isPinned } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({
        error: true,
        message: "Note not found",
      });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Search note
app.get("/search-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// todo Api
// Create todo
app.post("/todo", authenticateToken, async (req, res) => {
  const { todo, expectedStartTime, expectedEndTime, markAsDone, priority } =
    req.body;
  const { user } = req.user;

  if (!todo || !expectedStartTime || !expectedEndTime || !priority) {
    return res.status(400).json({
      error: true,
      message:
        "Please provide all details : todo, expectedStartTime, expectedEndTime, priority",
    });
  }

  try {
    const newTodo = new Todo({
      todo,
      expectedStartTime,
      expectedEndTime,
      markAsDone,
      priority,
      userId: user._id,
    });
    await newTodo.save();

    return res.json({
      error: false,
      newTodo,
      message: "Todo added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Show all todos
app.get("/todo", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    // sorted according to order of insertion, first todo added will be first
    const todo = await Todo.find({ userId: user._id }).sort({
      dateOfCreation: 1,
      _id: 1,
    });
    return res.json({
      error: false,
      todo,
      message: "All todos retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Edit todo
app.put("/todo/:id", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { id } = req.params;
  const { todo, expectedStartTime, expectedEndTime, priority } = req.body;

  if (!todo && !expectedStartTime && !expectedEndTime && !priority) {
    return res.status(400).json({
      error: true,
      message: "No changes provided",
    });
  }

  try {
    const editTodo = await Todo.findOne({
      _id: id,
      userId: user._id,
    });

    if (!editTodo) {
      return res.status(404).json({
        error: true,
        message: "No such todo found",
      });
    }

    if (todo) editTodo.todo = todo;
    if (expectedStartTime) editTodo.expectedStartTime = expectedStartTime;
    if (expectedEndTime) editTodo.expectedEndTime = expectedEndTime;
    if (priority) editTodo.priority = priority;

    await editTodo.save();

    return res.json({
      error: false,
      editTodo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete todo
app.delete("/todo/:id", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { id } = req.params;

  try {
    const delTodo = await Todo.findOne({
      _id: id,
      userId: user._id,
    });

    if (!delTodo) {
      return res.status(404).json({
        error: true,
        message: "No such todo found",
      });
    }

    const dTodo = await Todo.deleteOne({
      _id: id,
      userId: user._id,
    });

    return res.json({
      error: false,
      dTodo,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Mark as done
app.patch("/todo/:id", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { id } = req.params;
  const { markAsDone } = req.body;

  try {

    const markTodo = await Todo.findOne({
      _id: id,
      userId: user._id,
    });

    if(!markTodo){
      return res.status(404).json({
        error: true,
        message: "No such todo found",
      });
    }

    markTodo.markAsDone = markAsDone;

    await markTodo.save();

    return res.json({
      error: false,
      markTodo,
      message: "Todo updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000, () => console.log("app listening to port 8000"));

module.exports = app;



