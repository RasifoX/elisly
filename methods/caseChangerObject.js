/*
  {
    aTestProperty: "data",
    looksLikeSweet: "emm",
    itIsYourID: 12
  }

  to

  {
    a_test_property: "data",
    looks_like_sweet: "emm",
    it_is_your_id: 12
  }
*/

module.exports = ((object) => {
  const keys = Object.keys(object);
  const keysLength = keys.length;
  const result = {};

  for(let i = 0; i < keysLength; i++) {
    const key = keys[i];
    let newKey = "";

    for(let a = 0; a < key.length; a++) {
      const letter = key[a];
      const firstA = a;

      if(letter.toUpperCase() === letter) {
        const slicedLength = key.length - a - 1;
        newKey += "_";
        newKey += letter.toLowerCase();

        for(let b = 0; b < slicedLength; b++) {
          const altLetter = key[firstA + b + 1];

          if(altLetter.toUpperCase() === altLetter) {
            newKey += altLetter.toLowerCase();
            a++;
          } else {
            break;
          }
        }
      } else {
        newKey += letter;
      }
    }

    if(key.toLowerCase() !== key) {
      result[newKey] = object[key];
    } else {
      result[newKey] = object[key];
    }
  }

  return result;
});