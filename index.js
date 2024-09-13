const express = require("express");
const {v4 : uuidMake} = require("uuid")
const fs = require("fs");
const { loginMiddleware, authenticationMiddleware } = require("./middleware");
const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    msg: "working",
  });
});


// login
app.post("/login", loginMiddleware, (req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password.toString();
        const allDataJson = fs.readFileSync("./loginData.json");
        const allUserData  =  JSON.parse(allDataJson);
        const userExit = allUserData.findIndex(user => user.email == email);
        if (userExit !== -1){
          res.json({msg : "User already exit"});
        }
        else{
          allUserData.push({email, password});
          fs.writeFileSync("./loginData.json", JSON.stringify(allUserData, null, 3));
          res.json({
              msg : "Login successful, please sign in using this email & password"
          });
        }
      
    }
    catch(err){
        res.status(404).json({err});
    }

});


// sign in
app.post("/signin", (req, res) => {
  try{
    const email = req.body.email;
    const password = req.body.password.toString();
    const allDataJson = fs.readFileSync("./loginData.json");
    const allUserData  =  JSON.parse(allDataJson);
    const userExit = allUserData.find(user => user.email == email);
    if (userExit == -1){
      res.json({msg : "Please login first"});
    }
    else {
      const token = uuidMake();
      const updatedUserData = allUserData.map(user => {
        if (user.email == email && user.password == password){
          user.token = token;
        }
        return user;
      })
      fs.writeFileSync("./loginData.json", JSON.stringify(updatedUserData, null, 3));
      res.json({msg : token});
    }

  }
  catch(err){

  }
})

// get all ai data
app.get("/alldata", authenticationMiddleware, (req, res) => {
  try {
    const allAiDataJson = fs.readFileSync("./formatedData.json");
    const allAiData = JSON.parse(allAiDataJson);
    res.json(allAiData);
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});


//price filter
app.get("/filter", authenticationMiddleware, (req, res) => {
  try {
    const price = req.query.price;
    const allAiDataJson = fs.readFileSync("./formatedData.json");
    const allAiData = JSON.parse(allAiDataJson);
    const filteredList = allAiData.filter(
      (ai) => ai.price.toLowerCase() == price.toLowerCase()
    );
    res.json(filteredList);
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});


// perpage
app.get("/pages", authenticationMiddleware, (req, res) => {
  try {
    const pageNo = Number(req.query.pageno) || 1;
    const perPage = Number(req.query.perpage) || 30;
    if (pageNo < 1 || perPage < 1){
        res.status(404).json({msg : "Invalid Input for pages"})
    }
    const allAiDataJson = fs.readFileSync("./formatedData.json");
    const allAiData = JSON.parse(allAiDataJson);
    const totalPages = Math.ceil(allAiData.length / perPage);
    if (pageNo > totalPages) {
        res.status(404).json({msg : "No more pages"})
    }
    const startIndex = (pageNo - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentPageData = allAiData.slice(startIndex, endIndex);
    res.json({ currentPageData, totalPages });
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});


// search
app.get("/search", authenticationMiddleware, (req, res) => {
    try{
        const searchData = req.query.name;
        const allAiDataJson = fs.readFileSync("./formatedData.json");
        const allAiData = JSON.parse(allAiDataJson);
        const foundData = allAiData.find(ai => ai.name.toString().toLowerCase() == searchData.toLowerCase());
       if (searchData){
        res.json(foundData);
       }
       else {
        res.json([]);
       }
    }
    catch(err){
        res.status(404).json({ msg: err });
    }
 
});

// releted name search
app.get("/related", authenticationMiddleware, (req, res) => {
    try{
        const searchData = req.query.name.toLowerCase();
        const allAiDataJson = fs.readFileSync("./formatedData.json");
        const allAiData = JSON.parse(allAiDataJson);
        const relatedData = allAiData.filter(ai => ai.name.toLowerCase().includes(searchData));
        res.json(relatedData);
    }
    catch(err){
        res.status(404).json({ msg: err });

    }
})

app.listen(3000);
