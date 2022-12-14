//download.js
const fs = require("fs");
const mkdirp = require("mkdirp");
const {
  loadSpreadsheet,
  localesPath,
  ns,
  lngs,
  sheetId,
  sheetIdByNs,
  columnKeyToHeader,
  NOT_AVAILABLE_CELL,
} = require("./index");
const nsList = Object.keys(sheetIdByNs);
//스프레드시트 -> json
async function fetchTranslationsFromSheetToJson(doc, ns) {
  const sheet = doc.sheetsById[sheetIdByNs[ns]];
  if (!sheet) {
    return {};
  }

  const lngsMap = {};
  const rows = await sheet.getRows();

  rows.forEach((row) => {
    const key = row[columnKeyToHeader.key];
    lngs.forEach((lng) => {
      const translation = row[columnKeyToHeader[lng]];
      // NOT_AVAILABLE_CELL("_N/A") means no related language
      if (translation === NOT_AVAILABLE_CELL) {
        return;
      }

      if (!lngsMap[lng]) {
        lngsMap[lng] = {};
      }

      lngsMap[lng][key] = translation || ""; // prevent to remove undefined value like ({"key": undefined})
    });
  });

  return lngsMap;
}

//디렉토리 설정
function checkAndMakeLocaleDir(dirPath, subDirs) {
  return new Promise((resolve) => {
    subDirs.forEach((subDir, index) => {
      console.log(`${dirPath}/${subDir}`);
      // mkdirp(`${dirPath}/${subDir}`, function (err) {
      //   if (err) {
      //     throw err;
      //   }

      //   if (index === subDirs.length - 1) {
      //     resolve();
      //   }
      // });
      // mkdirp(`../public/locales/${subDir}`, function (err) {
      //   if (err) {
      //     throw err;
      //   }

      //   if (index === subDirs.length - 1) {
      //     resolve();
      //   }
      // });
      mkdirp.sync(`${dirPath}/${subDir}`);
      if (index === subDirs.length - 1) {
        resolve();
      }
    });
  });
}

//json 파일 업데이트
async function updateJsonFromSheet() {
  console.log(localesPath);
  await checkAndMakeLocaleDir(localesPath, lngs);

  const doc = await loadSpreadsheet();
  nsList.forEach(async (ns) => {
    const lngsMap = await fetchTranslationsFromSheetToJson(doc, ns);

    fs.readdir(localesPath, (error, lngs) => {
      if (error) {
        throw error;
      }

      lngs.forEach((lng) => {
        const localeJsonFilePath = `${localesPath}/${lng}/${ns}.json`;

        const jsonString = JSON.stringify(lngsMap[lng], null, 2);

        fs.writeFile(localeJsonFilePath, jsonString, "utf8", (err) => {
          if (err) {
            throw err;
          }
        });
      });
    });
  });
}

updateJsonFromSheet();
