function TypeUtil() {
}

TypeUtil.prototype.isInSearch = function(value, valueLength, searchOption) {
    let searchNames = (searchOption).split(/[ ,.]+/);
    let hasToken = false;
    searchNames.push(searchOption);
    for(let i = 0; i < searchNames.length; i++) {
      if(searchNames[i].toLowerCase().indexOf(value) > -1){
        hasToken = true;
      }
    }
    return hasToken;
};

TypeUtil.prototype.cleanResults = function(options, selected){
  let results = options;
  for(let i = 0; i < selected.length; i++){
    let idx = options.indexOf(selected[i]);
    if(idx > -1){
      results.splice(idx, 1);
    }
  }

  return results;
};

module.exports = TypeUtil;
