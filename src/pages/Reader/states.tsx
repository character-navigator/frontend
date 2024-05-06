import { atom, selector } from "recoil";
import { ProgressInfo, Summary } from "./types";
import { CSSProperties } from "react";

export const characterState = atom({
  key: "character",
  default: ""
})

export const selectedSummaryIndexState = atom({
  key: "selectedSummaryIndex",
  default: 0
})

export const summariesState = atom<Summary[]>({
  key: "summaries",
  default: []
})

export const progressInfoState = atom<ProgressInfo>({
  key: "progressInfo",
  default: {
    unlockedCharacterSummaries: 1,
    totalCharacterSummaries: 1
  }
})

const summaryState = selector({
  key: "summary",
  get: ({get}) => {
    const selectedSummaryIndex = get(selectedSummaryIndexState)
    const summaries = get(summariesState)
    return summaries[selectedSummaryIndex].summary
  }
})

export const summaryWithHighlightedCharacterState = selector({
  key: "summaryWithHighlightedCharacter",
  get: ({get}) => {
    const summary = get(summaryState)
    const character = get(characterState)
    const summaryStyle: CSSProperties = { margin: '1vh 2vh', lineHeight: '20px', maxHeight: '20vh', paddingRight: '2vw',  overflowY: 'auto' }
    const characterIndex = summary.indexOf(character)
    const summaryWithoutCharacter = summary.substring(characterIndex + character.length)

    return <p id="character-summary" style={summaryStyle}><span className='character-name'>{ character }</span>{ summaryWithoutCharacter }</p>
  }
})