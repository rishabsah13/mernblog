const { hashPassword, comparePassword } = require("../helpers/authHelper")
const userModel = require("../models/userModel")
const JWT = require("jsonwebtoken")

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //validation
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "name is required",
            });
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "email is required",
            });
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "password is required and 6 character long",
            });
        }
        //exisiting user
        const exisitingUser = await userModel.findOne({ email });
        if (exisitingUser) {
            return res.status(500).send({
                success: false,
                message: "User Already Register With This EMail",
            });
        }
        //hashed pasword
        const hashedPassword = await hashPassword(password);

        //save user
        const user = await userModel({
            name,
            email,
            password: hashedPassword,
        }).save();

        return res.status(201).send({
            success: true,
            message: "Registeration Successfull please login",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Register API",
            error,
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Email Or Password",
            });
        }
        // find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found",
            });
        }
        //match password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(500).send({
                success: false,
                message: "Invalid usrname or password",
            });
        }
        //TOKEN JWT
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })


        // undeinfed password
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "login successfully",
            token,
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in login api",
            error,
        });
    }
};


//update user

const updateUserController = async (req, res) => {
    try {

        const { name, password, email } = req.body
        const user = await userModel.findOne({email})
//password
if(password && password.length<6){
    return res.status(400).send({
        success:false,
        message:"Password is required and should be 6 character long"

    })
}
const hashedPassword = password? await hashPassword(password):undefined
//updated user
const updatedUser = await userModel.findOneAndUpdate({email},{
    name:name||user.name,
    password:password||user.password
},{new:true})
res.status(200).send({
    success:true,
    message:"Profile updated please login",
    updatedUser
})

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: "false",
            message: "Error in User Update API",
            error
        })

    }
}

module.exports = { registerController, loginController, updateUserController }