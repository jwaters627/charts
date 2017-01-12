import _ from 'lodash';
import d3 from 'd3';
import {textDir} from 'ch-ui-lib';

const getRootElementFontSize = () => {
    // Returns a number
    return parseFloat(
        // of the computed font-size, so in px
        getComputedStyle(
            // for the root <html> element
            document.documentElement
        )
        .fontSize
    );
}

// Convert Rem units to px
export function rem2px(value) {
  return value * getRootElementFontSize();
}

// Check if dom element has content which is overflown
export function checkOverflow(el) {
  const curOverflow = el.style.overflow;
  if ( !curOverflow || curOverflow === 'visible' )
     el.style.overflow = 'hidden';

  const isOverflowing = el.clientWidth < el.scrollWidth
     || el.clientHeight + 1 < el.scrollHeight;

  el.style.overflow = curOverflow;
  return isOverflowing;
}

export function formatSmartText(txt) {
  return txt.split('*')
         .map( (chunk, i) => i % 2 == 1 ? '<strong dir="'+textDir(chunk)+'">'+chunk+'</strong>' : chunk)
         .join('');
}

export function cleanObject(obj) {
  return _.pickBy(obj, f => !!f && (!Array.isArray(f) || !!f.length));
}

export function tryInt(str) {
  let attempt = parseInt(str);
  return isNaN(attempt) ? str : attempt;
}

const emoji = {
  '🍕': 'pizza',
  '🍎': 'red apple',
  '🍷': 'red wine',
  '🐔': 'wine',
  '🐙': 'octopus',
  '👍': 'thumbs up',
  '💔': 'broken heart',
  '🍺': 'beer',
  '🍸': 'cocktail',
  '🍔': 'hamburger',
  '⚽': 'soccer'
}

export function translateEmoji(str) {
  for (let em in emoji) {
    str = str.replace(em, emoji[em]);
  }
  return str;
}

export function sanitizeUrl(url){
  if(url.substring(0,5) != 'https' &&
    url.substring(0,4) == 'http'){
    return "https" + url.substring(4);
  }else {
    return url;
  }
}

function list2Array(list) {
  let arr = [];
  for (let i=0; i<list.length; i++) {
    arr.push(list[i]);
  }
  return arr;
}
