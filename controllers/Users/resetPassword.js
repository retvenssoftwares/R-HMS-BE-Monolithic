require("dotenv").config();
const crypto = require("crypto");
const hotelEmployee = require("../../models/Users/hotelOwnerRegister");
const nodeMailer = require("nodemailer");
const randomString = require("randomstring");
const apiname = require('../../models/Users/apiHittingArray')

async function sendResetLinkToMail(fullName, email, link) {
  try {
    console.log(fullName, email, link);
    const transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.email,
        pass: process.env.password,
      },
    });

    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: "For Reset Password",
      html:
        "<p> Hii  " +
        fullName +
        " , Please copy the link  and <a href = 'http://localhost:5000/reset?link=" +
        link +
        "'> to reset your password </a>",
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("mail has been sent");
      }
    });
  } catch (err) {
    res.status(400).send({ success: false, msg: err.message });
  }
}

exports.forgetpassword = async (req, res) => {
  try {
    const email = req.body.email;

    const useremail = await hotelEmployee.findOne({ email: email });

    if (useremail) {
      const resetLink = randomString.generate();

      const data = await hotelEmployee.updateOne(
        { email: email },
        { $set: { link: resetLink } }
      );

      sendResetLinkToMail(useremail.fullName, useremail.email, resetLink);

      res.status(200).send({
        success: true,
        msg: "pls check your email to reset the password",
      });
    } else {
      res.status(400).json({message: "email not found"});
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({message: "something incorrect"});
  }
};

exports.resetPassword = async (req, res) => {
 

  const link = req.query.link;

  const linkData = await hotelEmployee.findOne({ link: link });

  if (linkData) {
    const password = req.body.password;
    const conformPassword = req.body.conformPassword;

    const key = process.env.key;
    const iv = process.env.iv;


    if(password === conformPassword){
      function encrypt(text) {
        const cipher = crypto.createCipheriv(
          "aes-256-cbc",
          Buffer.from(key, "hex"),
          Buffer.from(iv)
        );
        let encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
      }
  
      const newpassword = encrypt(password);
  
      // Assuming linkData.password is an array
      if (Array.isArray(linkData.password) && linkData.password.length > 0) {
        // Update the first element's password property
        linkData.password[0].password = newpassword;

        // await apiname.updateOne(
        //   { userId: linkData.userId },
        //   {
        //     $push: {
        //       apiArray: {
        //         $each: [
        //           {
        //             apiname: "ResetPassword",
        //             role : linkData.role,
        //             deviceType : req.body.deviceType,
        //             ipaddress : req.body.ipaddress,
        //             timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    
        //           }
        //         ],
        //         $position: 0
        //       }
        //     }
        //   }
        // );
        
        linkData.link = "";
        await linkData.save();
       
        return res.status(200).send("Password updated successfully");
      } else {
        return res.status(400).send("Invalid password data");
      }
    }else{
      return res.status(400).send("Passwords do not match")
    }
    
  } else {
    return res.status(400).send("link is expired");
  }
};
