import data from "./data/data.json";

// Constants
const NA_LEVEL = 999;
const outputTextElement: HTMLElement = document.querySelector("#outputText");
const inputTextElement: HTMLElement = document.querySelector("#inputText");

// Make an array of numbers 0 to n-1
const linspace = (n: number): number[] => [...Array(n).keys()];

// Make an array of numbers from `from` to `to`
const linspace_from_to = (from: number, to: number): number[] => {
  return linspace(to - from).map((x) => x + from);
};

const get_tocfl_level = (word: string): number => {
  const word_length: number = word.length;
  const level = data[word_length.toString()][word];
  if (typeof level === "undefined") {
    return NA_LEVEL;
  } else {
    return level;
  }
};

const get_ngram_levels = (
  s: string,
  max_n: number
): { word: string; positions: number[]; level: number }[] => {
  const s_length = s.length;
  const output = [];
  for (let i = 0; i < s_length; i++) {
    for (let j = 0; j < max_n; j++) {
      if (i + j >= s_length) {
        break;
      } else {
        const word = s.substr(i, j + 1);
        const word_positions = linspace_from_to(i, i + j + 1);
        output.push({
          word: word,
          positions: word_positions,
          level: get_tocfl_level(word),
        });
      }
    }
  }
  return output;
};

const ngram_levels_to_position_levels = (
  s: string,
  max_n: number
): { character: string; position: number; level: number }[] => {
  const ngrams: { word: string; positions: number[]; level: number }[] = get_ngram_levels(
    s,
    max_n
  );
  return [...s]
    .map((character, i) => {
      return ngrams.reduce(
        (accumulator, ngram) => {
          if (ngram["positions"].includes(i)) {
            const ngram_level = ngram["level"];
            if (ngram_level < accumulator["level"]) {
              return {
                character: accumulator["character"],
                position: accumulator["position"],
                level: ngram_level,
              };
            } else {
              return accumulator;
            }
          } else {
            return accumulator;
          }
        },
        { character: character, position: i, level: NA_LEVEL }
      );
    })
    .map((character_level) => {
      if (character_level["level"] === NA_LEVEL) {
        return {
          character: character_level["character"],
          position: character_level["position"],
          level: 0,
        };
      } else {
        return character_level;
      }
    });
};

const remove_all_children = (element: HTMLElement): void => {
  while (element.firstChild) {
    element.firstChild.remove();
  }
};

const make_textarea_fit_content = (event: Event): void => {
  const element: HTMLElement = event.target as HTMLElement;
  element.style.height = "";
  element.style.height = element.scrollHeight + "px";
};

const get_event_value = (event: Event): string => {
  return (event.target as any).value;
};

const main = (event: Event): void => {
  make_textarea_fit_content(event);

  const inputText: string = get_event_value(event);

  // For each of the various word lengths, get their level
  const position_levels = ngram_levels_to_position_levels(inputText, 4);

  console.log(position_levels);

  remove_all_children(outputTextElement);
  position_levels.forEach((character_level_info) => {
    console.log;

    const wordElement = document.createElement("span");
    wordElement.className = "level" + character_level_info["level"].toString();
    wordElement.appendChild(document.createTextNode(character_level_info["character"]));
    outputTextElement.appendChild(wordElement);
  });
};

inputTextElement.addEventListener("input", (event) => {
  main(event);
});
