const express = require("express");
const fs = require("fs");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "working",
  });
});

// get all ai data
app.get("/alldata", (req, res) => {
  try {
    const allAiDataJson = fs.readFileSync("./formatedData.json");
    const allAiData = JSON.parse(allAiDataJson);
    res.json(allAiData);
  } catch (err) {
    res.status(404).json({ msg: err });
  }
});

//price filter
app.get("/filter", (req, res) => {
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
app.get("/pages", (req, res) => {
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

app.listen(3000);
