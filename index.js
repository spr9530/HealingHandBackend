const express = require('express');
const connectDB = require('./Database/connectDB');
const { checkUser, addUserInfo, getAllUser, deleteUser, updateUser, getUser } = require('./Controller/userController');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { verifyUser } = require('./Middleware/authentication');


const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Connect to the database
connectDB();

app.post('/', checkUser)
app.post('/addUserInfo', addUserInfo, (req, res)=>{
    res.status(201).send('userInfo Added')
})


// Verify the token
app.get('/', (req, res)=>{
    res.send('hello')
})
app.post('/', checkUser); // Authenticate user
app.post('/addUserInfo', verifyUser, addUserInfo); // Add user info
app.get('/userInfo', verifyUser, getAllUser); // Get all user info
app.get('/getUser/:id', verifyUser, getUser); // Get user by ID
app.delete('/deleteUser/:id', verifyUser, deleteUser); // Delete user by ID
app.patch('/updateUser/:id', verifyUser, updateUser); // Update user by ID

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

const port = process.env.PORT || 9696; // Use port from environment variable or default to 3000

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
