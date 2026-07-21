const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try{
         //registration logic here
         const {name,email,password} = req.body;

         if (!name || !email || !password ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
         }

         const existingUser = await User.findOne({email});
         if(existingUser){
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
         }

         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password,salt);

         const user = new User({
            name,
            email,
            password: hashedPassword
         });

         await user.save();

         res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
         });
    }
    catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({
            success: false, 
            message: 'Server error' 
        });
    }
};

module.exports = {registerUser,};