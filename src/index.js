const arrayFlatten = require("array-flatten");

const SPACE = "SPACE";
const EOL_SURE_SPACE = "EOL_SURE_SPACE";
const LINE_BREAK = "LINE_BREAK";

exports = module.exports = { cloudVisionLines };

function cloudVisionLines(fullTextAnnotation) {
  const wordsObjects = buildWordObjectsFromSymbols(
    getWordsFromParagraphs(
      getParagraphsFromTextBlocks(getBlocksFromTextObj(fullTextAnnotation))
    )
  );

  const lines = buildLinesFromWordObjects(wordsObjects);

  return lines;
}

function getBlocksFromTextObj(fullTextAnnotation) {
  return arrayFlatten(fullTextAnnotation.pages.map(page => page.blocks));
}

function getParagraphsFromTextBlocks(blocks) {
  return arrayFlatten(blocks.map(block => block.paragraphs));
}

function getWordsFromParagraphs(paragraphs) {
  return arrayFlatten(paragraphs.map(element => element.words));
}

function isWord(detectedBreakType) {
  if (
    detectedBreakType === SPACE ||
    detectedBreakType === EOL_SURE_SPACE ||
    detectedBreakType === LINE_BREAK
  ) {
    return true;
  }

  return false;
}

function isLineBreak(detectedBreakType) {
  if (
    detectedBreakType === EOL_SURE_SPACE ||
    detectedBreakType === LINE_BREAK
  ) {
    return true;
  }

  return false;
}

function buildWordObjectsFromSymbols(words) {
  const wordsObj = words.map(elem => {
    return elem.symbols.map(symbol => {
      if (symbol.property.detectedBreak) {
        const word = isWord(symbol.property.detectedBreak.type);

        const hasLineBreak = isLineBreak(symbol.property.detectedBreak.type);

        return {
          text: symbol.text,
          coords: symbol.boundingBox.vertices,
          word,
          break: hasLineBreak
        };
      }
      return { text: symbol.text, coords: symbol.boundingBox.vertices };
    });
  });

  return wordsObj;
}

function getLineDimensionsAndCoords(arrayOfCoords) {
  const flatCoords = arrayFlatten(arrayOfCoords);
  const tl = flatCoords[0];
  const bl = flatCoords[3];
  const tr = flatCoords[5];
  const br = flatCoords[6];
  const w = Number(tr.x) - Number(tl.x);
  const h = Number(bl.y) - Number(tl.y);

  return { tl, tr, br, bl, w, h };
}

function buildLinesFromWordObjects(wordsObj) {
  let storage = [];
  let breakFlag = false;
  let line = "";
  let coords = [];

  wordsObj.forEach(letters => {
    letters.forEach((letter, i) => {
      line += letter.text;
      coords.push(letter.coords);
      if (letter.word) {
        line += " ";
      }

      if (letter.break) {
        breakFlag = true;
      }
    });

    if (breakFlag) {
      storage.push({
        text: line,
        coords: getLineDimensionsAndCoords([
          coords[0],
          coords[coords.length - 1]
        ])
      });
      breakFlag = false;
      line = "";
      coords = [];
    }
  });

  return storage;
}
