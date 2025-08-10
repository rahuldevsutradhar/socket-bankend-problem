const express = require('express');
const { createServer } = require('node:http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = createServer(app);
const port = 8000;

// -------- Middlewares ----------
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST"],
  credentials: true
}));


const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend origin
    methods: ["GET", "POST"],
    credentials: true
  },
});

// ------- DB connect -------
mongoose.connect('mongodb+srv://rahul123:rahul123@cluster0.wczok1c.mongodb.net/rahul123?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB connected'))
  .catch((err) => console.log(err));





// ---------- Schema and Model ----------
const todoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true
  }
});

const todoModel = mongoose.model('todo', todoSchema);





// ---------- Route ----------
app.post('/addtodo', async (req, res) => {
  
    const { todo } = req.body
    await new todoModel({ todo }).save()

    const allTodo = await todoModel.find()

    io.emit('todo' , allTodo)
     


    res.status(200).send(allTodo);
})




server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
})
