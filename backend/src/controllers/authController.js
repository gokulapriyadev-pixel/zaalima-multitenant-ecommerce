const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//signup
exports.signup = async (req, res) => {
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
        res.send("User already exist")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password : hashedPassword
    });
    res.send("Registered Successfully");
}


    //login
    exports.login = async (req, res) => {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            res.send("User not found");
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.send("Invalid Credential");
        }

        const token = jwt.sign(
            {id : user._id},
            "secretKey",
            {expiresIn : "1h"}
        );
        res.json(token);
    }
