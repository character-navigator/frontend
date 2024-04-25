import { Dispatch, SetStateAction } from 'react'

export interface Sentence {
  sid: number
  text: string
}

export interface Summary {
  endSid: number
  name: string
  summary: string
}

export interface ProgressInfo {
  unlockedCharacterSummaries: number
  totalCharacterSummaries: number
}

export interface ProgressAndSidInfo extends ProgressInfo {
  sidOfFirstCharacterSummary: number
  totalSid: number
}

export type ReactSetter = Dispatch<SetStateAction<any>>