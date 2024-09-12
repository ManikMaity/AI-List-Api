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

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  module.exports = {loginMiddleware}