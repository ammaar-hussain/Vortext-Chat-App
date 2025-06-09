const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req,res,next) =>{   //exporting the register function so that it can be used in other files
try {
    const {username, email,password} = req.body;
    const usernameCheck = await User.findOne({username});
    if(usernameCheck)
        return res.json({msg : "Username already used", status : false});  //This sends a JSON response to the client with a message (msg) that the username is already used, and a status flag set 
                                                                           //to false to indicate the registration failed. return ensures that no further code is executed once this response is sent.


    const emailCheck = await User.findOne({email});
    if(emailCheck)
        return res.json({msg : "Email already used", status : false});


    const hashedPassword = await bcrypt.hash(password,10); //If the username and email are available, the function hashes the user's password using bcrypt 
                                                           //(with a salt factor of 10) to securely store the password in the database.


    const user = await User.create({                        //create a user object to store all the details to be sent back to client
        email,username,password:hashedPassword,
    });
    delete user.password;                                 //since password is senstivie we delete it even though it is in hashed form.

    return res.json({status : true,user});                //A JSON response is sent back with the user object (excluding the password) and a status: true flag indicating the registration was successful.
} catch (ex) {
    next(ex);
}

};


module.exports.login = async (req,res,next) =>{   
    try {
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user)
            return res.json({msg : "Incorrect username or password", status : false}); 
                                                                               
        const isPasswordValid  = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.json({msg : "Incorrect username or password", status : false});
        }
        delete user.password;
    
        return res.json({status : true,user});               
    } catch (ex) {
        next(ex);
    }
    
    };

    module.exports.setAvatar = async(req,res,next) =>{
        try{
            const userId = req.params.id;
            const avatarImage = req.body.image;
            const userData = await User.findByIdAndUpdate(userId,{
                isAvatarImageSet : true,
                avatarImage,
            },
            {new:true});
            return res.json({isSet : userData.isAvatarImageSet, image : userData.avatarImage});
        }
        catch(ex){
            next(ex)
        }
    };


    module.exports.getAllUsers = async(req,res,next) =>{
        try{
            const users = await User.find({_id:{$ne:req.params.id}}).select([
                "email", "username", "avatarImage", "_id",
            ]);
            return res.json(users);
        }catch(ex){
            next(ex);
        }
    }
