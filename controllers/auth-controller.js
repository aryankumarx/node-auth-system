const bcrypt = require('bcryptjs'); 
const User = require('../models/User');
const jwt = require('jsonwebtoken');


//register controller
const registerUser  = async(req,res)=>{
   try{
      // collect info from the request body (from user)
      const {username, email, password, role} = req.body;   // extract data from user

      //check if the user is already exists or not in our db
      const checkExistsUser = await User.findOne({$or : [{username}, {email}]});

      if(checkExistsUser){
         return res.status(400).json({
            sucess: false,
            message: "Username is already exists. try with another username or email"
         })
      }

      // hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // create a new user and save in db
      const newUser = new User({
         username,
         email,
         password: hashedPassword, 
         role: role || 'user'
      })

      await newUser.save();
      
      if(newUser){
         res.status(201).json({
            sucess: true,
            message: 'New User is registered'
         })
      }else{
         res.status(400).json({
            sucess: false,
            message: 'Unable to register user. Try again!'
         })
      }

   }catch(e){
      // console.log(e);
      res.status(500).json({
         sucess: false,
         message: 'some error occured! Please try again later'
      })
   }
};


//login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!"
      });
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!"
      });
    }

    // 3. Create token AFTER verification
const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // 4. Response
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token
    });
    
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later"
    });
  }
};

// change Password Controller
const changePassword = async(req, res) => {
    try {
        const userId = req.user.userId; // middleware attaches to req.user
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error, please try again later"
        });
    }
}
module.exports = {registerUser, loginUser, changePassword};