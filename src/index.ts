import data from "./data/data.json";

// Constants
const outputTextElement: HTMLElement = document.querySelector("#outputText");
const inputTextElement: HTMLElement = document.querySelector("#inputText");

const split_words = (s: string): string[] => {
  return s.split("");
};

const get_tocfl_level = (word: string): number => {
  const word_length: number = word.length;
  const level = data[word_length.toString()][word];
  if (typeof level === "undefined") {
    return 0;
  } else {
    return level;
  }
};

const remove_all_children = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
};

const get_event_value = (event: Event): string => {
  return (event.target as any).value;
};

const main = (event: Event): void => {
  const inputText: string = get_event_value(event);

  const wordArray = split_words(inputText);
  const tocflLevelArray = wordArray.map(get_tocfl_level);

  remove_all_children(outputTextElement);

  for (let i = 0; i < wordArray.length; i++) {
    const wordElement = document.createElement("span");
    wordElement.className = "level" + tocflLevelArray[i].toString();
    wordElement.appendChild(document.createTextNode(wordArray[i]));
    outputTextElement.appendChild(wordElement);
  }
};

inputTextElement.addEventListener("input", (event) => {
  main(event);
});
