const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName || !email || !password){
        res.status(400).json({error: 'Missing request data'});
        return;
    }

    const foundUser = await User.findOne({email});
    if(foundUser){
        res.status(400).json({error: 'User already registered'});
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if(!hashedPassword){
        res.status(500).json({error: 'Failed to hash password'});
        return;
    }

    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    const savedUser = await user.save();
    if(!savedUser){
        res.status(500).json({error: 'Failed to create new user'});
        return;
    }

    res.status(201).json({
        message: 'User created successfully',
        user: savedUser
    })
}

exports.signIn = (req, res) => {
    const user = req.user;
    if(!user){
        res.status(404).json({error: 'User not found'});
        return;
    }
    try{
        const token = jwt.sign({_id: user._id, email: user.email},  process.env.JWT_SECRET, {expiresIn: 86400});
        res.status(200).json({
            message: 'User logged in successfully',
            token,
            user
        })
    }catch(err){
        res.status(500).json({error: err.message});
    }
}


