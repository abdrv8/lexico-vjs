import { clearField, devInfo, searchWord, displayData, getAudio } from "./fns";
import { searchInput, clearIcon, volumeIcon } from "./dom";

// search word
searchInput.addEventListener("keyup", async (e) => {
  if (e.key === "Enter" && e.target.value) {
    let word = e.target.value;
    const result = word && (await searchWord(word));
    result && displayData(result);
  }
});

// play audio pronunciation
volumeIcon.addEventListener("click", () => {
  let audio = new Audio(getAudio());
  audio.play();
});

// clear input field
clearIcon.addEventListener("click", clearField);

// show dev info
devInfo();
