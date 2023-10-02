let rowCounter = 0;
let inputCounter = 0;
const lenStrTrancate = 10;

// --------------------------------------------------------------
const tranDoc = 
{
  "name": "icao_doc_9303",
  "description": "ICAO DOC 9303 transliteration schema",
  "url": "https://iuliia.ru/icao-doc-9303/",
  "mapping": {
      "а": "a",
      "б": "b",
      "в": "v",
      "г": "g",
      "д": "d",
      "е": "e",
      "ё": "e",
      "ж": "zh",
      "з": "z",
      "и": "i",
      "й": "i",
      "к": "k",
      "л": "l",
      "м": "m",
      "н": "n",
      "о": "o",
      "п": "p",
      "р": "r",
      "с": "s",
      "т": "t",
      "у": "u",
      "ф": "f",
      "х": "kh",
      "ц": "ts",
      "ч": "ch",
      "ш": "sh",
      "щ": "shch",
      "ъ": "ie",
      "ы": "y",
      "ь": " ",
      "э": "e",
      "ю": "iu",
      "я": "ia"
  },
}

generateFirstRow();
document.querySelector('.formClass').querySelector('input').focus();


// --------------------------------------------------------------
const subForm = document.querySelector('.formClass');
subForm.addEventListener('submit', function(evt) {
  evt.preventDefault();
  
  let textVal = subForm.querySelector('input').value;
  if(textVal === ''){
    subForm.querySelector('input').focus();
    return;
  } 

  let wordList = document.querySelector('#voctab tbody');

  const newRowElem = document.createElement('tr');
  
  const newCol1Elem = document.createElement('td');
  newCol1Elem.innerHTML = `<b>${++rowCounter}</b>`;
  
  const newCol2Elem = document.createElement('td');
  newCol2Elem.setAttribute("data-tooltip", textVal);
  let newCyrVal = textVal;
  if (textVal.length > lenStrTrancate){
    newCyrVal = textVal.slice(0,7) + '...';
    newCol2Elem.addEventListener("mouseover", showTip);
    newCol2Elem.addEventListener("mouseout",  hideTip);
  }
  newCol2Elem.innerText = newCyrVal;
  
  const newCol3Elem = document.createElement('td');
  newCol3Elem.setAttribute("data-tooltip", translit(textVal));
  let newLatVal = translit(textVal);
  if (newLatVal.length > lenStrTrancate){
    newLatVal = newLatVal.slice(0,7) + '...';
    newCol3Elem.addEventListener("mouseover", showTip);
    newCol3Elem.addEventListener("mouseout",  hideTip);
  }
  newCol3Elem.innerText = newLatVal;

  const newCol4Elem = document.createElement('td');
  const newImgElem = document.createElement('img');
  newImgElem.setAttribute("src", "./icons/cross-small.svg");
  newCol4Elem.appendChild(newImgElem);
  newCol4Elem.addEventListener("click", delTableRow);
  
  document.querySelector('#voctab tbody').children[0].children[0].removeAttribute("style")
  document.querySelector('#voctab tbody').children[0].children[3].removeAttribute("style")
  
  newRowElem.appendChild(newCol1Elem);
  newRowElem.appendChild(newCol2Elem);
  newRowElem.appendChild(newCol3Elem);
  newRowElem.appendChild(newCol4Elem);
  
  wordList.appendChild(newRowElem);
  subForm.querySelector('input').value = '';
  subForm.querySelector('input').focus();

});


// --------------------------------------------------------------
const reset = document.querySelector('#butReset');
reset.addEventListener('click', function(evt) {

  if(document.querySelector('#voctab tbody').children.length === 1){
    document.querySelector('.formClass').querySelector('input').focus();
    return;
  }

  let new_tbody = document.createElement('tbody');
  let old_tbody = document.querySelector('#voctab tbody');
  document.querySelector('#voctab').replaceChild(new_tbody, old_tbody)
  rowCounter = 0;
  generateFirstRow();
  document.querySelector('.formClass').querySelector('input').focus();

});


// --------------------------------------------------------------
function generateFirstRow(){
  let wordList = document.querySelector('#voctab tbody');
  const newRowElem = document.createElement('tr');
  const newCol1Elem = document.createElement('td');
  newCol1Elem.innerHTML = `<b>${++rowCounter}</b>`;
  
  const newCol2Elem = document.createElement('td');
  newCol2Elem.innerText = 'Привет 👋';
  
  const newCol3Elem = document.createElement('td');
  newCol3Elem.innerText = 'Privet';

  const newCol4Elem = document.createElement('td');
  const newImgElem = document.createElement('img');
  newImgElem.setAttribute("src", "./icons/cross-small.svg");
  newCol4Elem.appendChild(newImgElem);
  
  newCol1Elem.setAttribute("style", "border-radius: 8px 0 0 8px;");
  newCol4Elem.setAttribute("style", "border-radius: 0 8px 8px 0;");
  
  newRowElem.appendChild(newCol1Elem);
  newRowElem.appendChild(newCol2Elem);
  newRowElem.appendChild(newCol3Elem);
  newRowElem.appendChild(newCol4Elem);
  
  wordList.appendChild(newRowElem);

}

// --------------------------------------------------------------
function translit(str){
  let res = '';
  
  for(let i = 0; i < str.length; i++){
    let currCh = tranDoc.mapping[str[i].toLowerCase()] || str[i];
    if(str[i].toUpperCase() === str[i]){
      currCh = currCh.toUpperCase();
    }

    res += currCh.trim();
  }

  return res;
}

// --------------------------------------------------------------
function showTip(event) {
  
  let target = event.target;
  let tooltipHtml = target.dataset.tooltip;
  if (!tooltipHtml) return;
  
  tooltipElem = document.createElement('div');
  tooltipElem.className = 'tooltip2';
  tooltipElem.innerText = tooltipHtml;
  document.body.appendChild(tooltipElem);
  
  let coords = target.getBoundingClientRect();
  
  let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 2;
  left = left - 36;
  if (left < 0) left = 0; 
  
  let top = coords.top - tooltipElem.offsetHeight;
  top = top + 8;
  if (top < 0) { 
    top = coords.top + target.offsetHeight;
  }
  
  tooltipElem.style.left = left + 'px';
  tooltipElem.style.top = top + 'px'; 
}


// --------------------------------------------------------------
function hideTip() {
  if (tooltipElem) {
    tooltipElem.remove();
    tooltipElem = null;
  };
}


// --------------------------------------------------------------
function delTableRow(event) {
  this.parentNode.parentNode.removeChild(this.parentNode);
  renumber();
  document.querySelector('.formClass').querySelector('input').focus();
  if (rowCounter === 1){
    document.querySelector('#voctab tbody').children[0].children[0].setAttribute("style", "border-radius: 8px 0 0 8px;");
    document.querySelector('#voctab tbody').children[0].children[3].setAttribute("style", "border-radius: 0 8px 8px 0;");
  }
}


// --------------------------------------------------------------
function renumber() {

  let tbody = document.querySelector('#voctab tbody');
  let objLength = tbody.children.length;
  
  for(let i = 0; i < objLength; i++){
    tbody.children[i].children[0].innerHTML = `<b>${i+1}</b>`
    rowCounter = i+1;
  }
  
}

