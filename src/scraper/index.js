const axios = require("axios")
const cheerio = require("cheerio");
const fs = require('fs');
const path = require('path');


const MATHEMATICS = {},
  ENGLISH = {},
  PHYSICS = {},
  CHEMISTRY = {};

const imagesDir = path.resolve(__dirname, '..', 'images');

async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message);
  }
}


const fetchQuestions = async (subject = "mathematics", type = "jamb", year = 2025) => {
  const no_of_pages = subject === "english" ? 12 : 8;
  const outArr = [];
  
  const fetchNExtract = async () => {
    for (var i = 1; i <= no_of_pages; i++) {
      const url = `https://myschool.ng/classroom/${subject}?exam_type=${type}&exam_year=${year}&topic=&page=${i}`
      
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
          "Referer": "https://myschool.ng/",
          "Accept": "application/json, text/plain, */*",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      
      const data = await response.data;
      
      const $ = cheerio.load(data);
      const items = $('.question-item');
      
      items.each((i, el) => {
        const p = $(el).find('p');
        const li = $(el).find('li');
        const img = $(el).find('img');
        const question = p.eq(0).text();
        
        const options = li.map((idx, liEl) => {
          const rawText = $(liEl).text();
          return rawText.slice(15).trim();
        }).get(); // plain array of strings
        
        const src = img.eq(0).attr('src');
        let fileName = ""
        // Download images
        if (src) {
          fileName = `${subject}_${year}_${i}.png`;
          const filepath = path.join(imagesDir, fileName);
          downloadImage(src, filepath);
        }
        
        outArr.push(src ? { src: fileName, question, options } : { question, options });
      });
    }
  }
  
  await fetchNExtract();
  return outArr;
}

// .question-item p, li

(async () => {
  const q_a = await fetchQuestions();
  console.log(q_a)
})();
