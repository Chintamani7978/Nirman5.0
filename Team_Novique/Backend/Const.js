const  chunkArray = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

const extractJSON = (text) => {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    return text.substring(first, last + 1);
}


module.exports = {
    chunkArray,
    extractJSON
}