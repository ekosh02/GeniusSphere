import { strings } from "../languages/languages";

export const wordLocalization = (word, args = {}, type = false) => {
    if (typeof strings[word] !== 'undefined') {
      if (!type) {
        word = strings[word];
      }
    }
  
    for (let [arg, value] of Object.entries(args)) {
      let reg = new RegExp(`:${arg}`, 'gi');
      word = word?.replace(reg, value);
    }
    return word;
  };