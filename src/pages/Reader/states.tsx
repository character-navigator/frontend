import { atom, selector } from "recoil";
import { ProgressInfo } from "./types";

export const characterState = atom({
  key: "character",
  default: ""
})

export const summaryState = atom({
  key: "summary",
  default: ""
})

export const progressInfoState = atom<ProgressInfo>({
  key: "progressInfoState",
  default: {
    unlockedCharacterSummaries: 1,
    totalCharacterSummaries: 1
  }
})

export const summaryWithHighlightedCharacterState = selector({
  key: "summaryWithHighlightedCharacterState",
  get: ({get}) => {
    const character = get(characterState)
    const summary = get(summaryState)
    const summaryStyle = {margin: '1vh 2vh'}
    const characterIndex = summary.indexOf(character)
    const summaryWithoutCharacter = summary.substring(characterIndex + character.length)

    return <p style={summaryStyle}><span className='character-name'>{ character }</span>{ summaryWithoutCharacter }</p>
  }
})