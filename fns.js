import {
  infoOverlay,
  socialLinks,
  infoIcon,
  synonymsDiv,
  wrapper,
  searchInput,
  infoText,
} from "./dom";

let audioFile;

export const getAudio = () => audioFile;

export const searchWord = async (input) => {
  try {
    const { data, word } = await fetchData(input);
    let { audio, ...others } = processData(data, word);
    audioFile = audio;
    return others;
  } catch (err) {
    console.log(err.message);
  }
};

export const searchSynonym = async (word) => {
  searchInput.value = word;
  const result = await searchWord(word);
  displayData(result);
};

export const fetchData = async (word) => {
  word = word.trim();
  if (word && word.length >= 2) {
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
      let resp = await fetch(url);
      let data = await resp.json();
      return { data, word };
    } catch (err) {
      alert(
        "Something went wrong. Could be you're not connected to the internet or you've entered a word that doesn't exist."
      );
    }
  } else {
    alert("Enter a valid word!");
  }
};

export const processData = (data, word) => {
  if (data.title) {
    // api returned error
    wrapper.classList.remove("active");
    infoText.innerHTML = `Cant't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
  } else {
    wrapper.classList.add("active");
    let meanings = data[0].meanings;
    let firstMeaning = meanings[0];
    let firstMeaningSynonyms = firstMeaning.synonyms;
    let firstMeaningExample = firstMeaning.definitions[0].example;
    let lastMeaning = meanings[meanings.length - 1];
    let lastMeaningSynonyms = lastMeaning.synonyms;
    let meaningToUse = firstMeaningExample ? firstMeaning : lastMeaning;
    let synonymsToUse =
      firstMeaningSynonyms.length > 0
        ? firstMeaningSynonyms
        : lastMeaningSynonyms;
    let phonetics = data[0].phonetics;
    let definitions = meaningToUse.definitions[0];

    phonetics = `${meaningToUse.partOfSpeech} ${
      phonetics[phonetics.length - 1].text
    }`;

    let audio = data[0].phonetics[0].audio;

    const processedData = {
      word: data[0].word,
      phonetics,
      definition: definitions.definition,
      example: definitions.example,
      synonyms: synonymsToUse,
      audio,
    };
    return processedData;
  }
};

export const displayData = ({
  word,
  phonetics,
  definition,
  example,
  synonyms,
}) => {
  document.querySelector(".word p").innerHTML = word;
  document.querySelector(".word span").innerHTML = phonetics;
  document.querySelector(".meaning span").innerHTML = definition;
  document.querySelector(".example span").innerHTML = example
    ? example
    : "no example to show...";

  if (synonyms.length === 0) {
    // hide synonyms div if there's no synonyms
    synonymsDiv.parentElement.style.display = "none";
  } else {
    // show synonyms (get 5 out of many)
    synonymsDiv.parentElement.style.display = "block";
    synonymsDiv.innerHTML = ""; // clear UI before adding

    for (let i = 0; i < 5; i++) {
      let synonym = synonyms[i];
      synonym = synonym ? synonym : "";

      let tag = `<span data-word=${synonym}>${synonym}</span`;
      synonymsDiv.insertAdjacentHTML("beforeend", tag);
    }

    // add click event to each synonym element
    const synSpans = document.querySelectorAll(".list span");
    synSpans.forEach((synSpan) => {
      synSpan.addEventListener("click", (e) => {
        let word = synSpan.dataset.word;
        searchSynonym(word);
      });
    });
  }
};

export const clearField = () => {
  searchInput.value = "";
  searchInput.focus();
  wrapper.classList.remove("active");
  infoText.style.color = "#999";
  infoText.innerHTML = `Type a word and press Enter to get the meaning, pronunciation, and synonyms of the word.`;
};

export const devInfo = () => {
  infoIcon.addEventListener("click", () => {
    if (infoOverlay.classList.contains("active")) {
      socialLinks.classList.remove("active");
      setTimeout(() => {
        infoOverlay.classList.remove("active");
      }, 400);
    } else {
      infoOverlay.classList.add("active");
      setTimeout(() => {
        socialLinks.classList.add("active");
      }, 300);
    }
  });

  infoOverlay.addEventListener("click", () => {
    if (infoOverlay.classList.contains("active")) {
      socialLinks.classList.remove("active");
      setTimeout(() => {
        infoOverlay.classList.remove("active");
      }, 400);
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      if (infoOverlay.classList.contains("active")) {
        socialLinks.classList.remove("active");
        setTimeout(() => {
          infoOverlay.classList.remove("active");
        }, 400);
      }
    }
  });
};
