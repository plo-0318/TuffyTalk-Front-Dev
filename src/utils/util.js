// computerScience -> Computer Science
export const transformTopicText = (topic) => {
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

//computer-science -> computerScience
export const transformParamTopicText = (topic) => {
  let transformedTopic = topic.split('-');

  transformedTopic = transformedTopic
    .map((topic, i) => {
      if (i > 0) {
        return topic.charAt(0).toUpperCase() + topic.slice(1);
      }
      return topic;
    })
    .join('');

  return transformedTopic;
};
