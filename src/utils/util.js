// computerScience -> Computer Science
export const camelToSpace = (topic) => {
  let transformedTopic = topic;
  let upperIndex = transformedTopic.search(/[A-Z]/);

  while (upperIndex > -1) {
    const prefix = transformedTopic.substring(0, upperIndex);
    let upper = transformedTopic.charAt(upperIndex);
    const suffix = transformedTopic.slice(upperIndex + 1);

    upper = ` ${upper.toLowerCase()}`;

    transformedTopic = `${prefix}${upper}${suffix}`;

    upperIndex = transformedTopic.search(/[A-Z]/);
  }

  transformedTopic = transformedTopic
    .split(' ')
    .map((text) => text.charAt(0).toUpperCase() + text.slice(1))
    .join(' ');

  return transformedTopic;
};

// Computer Science -> computerScience
export const toCamel = (word, separator) => {
  let newWord = word.split(separator);

  newWord = newWord
    .map((word, i) => {
      if (i > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else if (i === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1);
      }
      return word;
    })
    .join('');

  return newWord;
};

// computerScience -> computer-science
export const camelToDash = (word) => {
  return camelToSpace(word).toLowerCase().split(' ').join('-');
};
