const fs = require("fs");
const download = require("image-downloader");

function makeFormatedData(dataPath) {
  const dataJson = fs.readFileSync(dataPath);
  const data = JSON.parse(dataJson);
  const datas = data?.table?.rows;
  const formatedData = datas.map((data) => {
    const tempObj = {};
    tempObj.name = data?.cells["Name-"]?.value;
    tempObj.image = data?.cells["Image-"]?.value;
    tempObj.url = data?.cells["URL-"]?.value;
    tempObj.description = data?.cells["Description-"]?.value;
    tempObj.category = data?.cells["Category-"]?.value;
    tempObj.tags = data?.cells["Hashtag-"]?.value.split(" ");
    tempObj.price = data?.cells["Price-"].value;
    return tempObj;
  });
  return formatedData;
}

function fileToData(directory) {
  let allData = [];
  const allFile = fs.readdirSync("./rawData");
  allFile.forEach((file) => {
    const fileData = makeFormatedData(`./rawData/${file}`);
    allData = [...allData, ...fileData];
  });
  fs.writeFileSync("./AIData.json", JSON.stringify(allData, null, 3));
}

const AIDataJson = fs.readFileSync("./AIData.json");
const AIData = JSON.parse(AIDataJson);
// console.log(AIData);


async function urlToImage(allData) {
  for (let i = 0; i < allData.length; i++) {
    const data = allData[i];
    const dest = `../../images/${generateImageName(data?.name)}.${getImageExtension(data?.image)}` || `../../images/image${i}.jpg`;
    const url = makeTheImageValid(data?.image);
    console.log(url);

    if (!url) {
      console.log(`No image URL found for ${data?.name}`);
      continue; // Skip to the next image if no valid URL
    }

    const options = {
      url,
      dest,
    };

    try {
      const { filename } = await download.image(options); // Wait for the download to finish
      console.log("Saved to", filename);
    } catch (err) {
      console.error(`Error downloading ${data?.name}:`, err);
    }
  }
}



function generateImageName(name) {
  return name.split(" ").join("").toLowerCase();
}

function getImageExtension(url) {
  let urlArr = url.split(".");
  let extention = urlArr[urlArr.length - 1] || "jpg";
  if (extention.length > 6) extention = "jpg";
  return extention;
}

function makeTheImageValid (url) {
    let urlArr = url.split(".");
    if (urlArr[urlArr.length - 1].length < 6){
        return url;
    }
    else {
        return `${url}.jpg`;
    }
}


function nameImamgeToImageUrl(name, image){
  const imagename = generateImageName(name);
  const extention = getImageExtension(image);
  return imagename+"."+extention;
}

// console.log(generateImageName("Manik Maity"));
// urlToImage(AIData);

// console.log(imagesData.length, AIData.length)

const imagesData = fs.readdirSync("./images");
function makeImageUrlToLoacalImage(datas){
  const formatedData = datas.map(data => {
    const found = imagesData.findIndex(image => image == nameImamgeToImageUrl(data.name, data.image));
    if (found == -1){
      data.image = `./images/defaultImage.png`;
    }  
    else {
      data.image = `./images/${imagesData[found]}`
    }
    return data;
  } )
  fs.writeFileSync("./formatedData.json", JSON.stringify(formatedData, null, 3));
}

makeImageUrlToLoacalImage(AIData);