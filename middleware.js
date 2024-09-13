const fs = require("fs");

function loginMiddleware(req, res, next){
    const email = req.body.email;
    const password = req.body.password.toString();
    if(validateEmail(email) && password.length > 8){
        next();
    }
    else{
        res.status(404).json({msg : "Enter proper details"});
    }

}



function authenticationMiddleware(req, res, next){
    const token = req.headers.token;
    const allUserDataJson = fs.readFileSync("./loginData.json");
    const allUserData = JSON.parse(allUserDataJson);
    const findToken = allUserData.find(user => user.token == token);
    if (!findToken){
        res.status(404).json({msg : "Token not found"})
    }
    else {
        next();
    }
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };



  module.exports = {loginMiddleware, authenticationMiddleware}