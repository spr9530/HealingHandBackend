const UserInfo = require("../Model/userInfoSchema")
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;


const checkUser = async (req, res) => {
    try {
        const { userName, password } = req.body

        // Check if username and password are provided
        if (!userName || !password) {
            return res.status(400).json({ error: 'Please provide both username and password' });
        }

        // Authentication logic
        if (userName === process.env.USERNAME && password === process.env.PASSWORD) {

            const payload = {
                username: userName,
            };

             // Generate JWT token
            const token = jwt.sign(payload, secretKey, { expiresIn: '30m' });
            
            // Send token as JSON response
            return res.status(200).json( token );
        } else {

             // Incorrect username or password
            return res.status(401).json({ error: 'Authentication failed: Incorrect username or password' });
        }
    } catch (error) {

        // Handle unexpected errors
        console.error('Error in checkUser function:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const addUserInfo = async (req, res, next) => {
    try {
        const { userName, phone, problem, message } = req.body

        const currentDate = new Date();

        // Get current date and format it
        const date = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const formattedDate = `${date}-${month}-${year}`;

        // Create new UserInfo document
        const userInfo = new UserInfo({
            userName,
            phone,
            problem,
            message,
            time: formattedDate,
        })

        // Save UserInfo document to the database
        const data = await userInfo.save()

        next()

    } catch (error) {
        // Handle errors
        console.error('Error in addUserInfo middleware:', error);
        return res.status(500).json({ error: 'Info not stored, internal server error' });
    }
}

const getAllUser = async (req, res) => {
    try {
        const userInfo = await UserInfo.find();
        res.status(200).json(userInfo); // Return user info as JSON response
    } catch (error) {
        console.error('Error in getAllUser:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return internal server error in JSON format
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id

        const userInfo = await UserInfo.find({ _id: id });// Using findById to directly search by ID

        if (!userInfo) {
            return res.status(404).json({ error: 'User not found' }); // Handle case where user ID is not found
        }

        res.status(200).json(userInfo); // Return user info as JSON response
    } catch (error) {
        console.error('Error in getUser:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return internal server error in JSON format
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserInfo.findOneAndDelete({ _id: id })

        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Handle case where user ID is not found
        }

        res.status(200).json({ message: 'User deleted successfully' }); // Return success message

    } catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return internal server error in JSON format
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body

        // Set { new: true } to return the updated document
        const updates = await UserInfo.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
        
        if (!updates) {
            return res.status(404).json({ error: 'User not found' }); // Handle case where user ID is not found
        }

        res.status(200).json({ message: 'User updated successfully', user: updates }); // Return success message and updated user

    } catch (error) {
        console.error('Error in updateUser:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return internal server error in JSON format
    }
}



module.exports = { checkUser, addUserInfo, getUser, getAllUser, deleteUser, updateUser }