import { useMemo } from "react"
import { useRecoilValue } from "recoil"
import { progressInfoState, summaryWithHighlightedCharacterState, selectedSummaryIndexState } from "../states"
import DrawerContentView from "./DrawerContentView"

const DrawerContent = ({
  closeDrawer
}: {
  closeDrawer: any
}) => {
  const completed = useRecoilValue(selectedSummaryIndexState) + 1
  
  const progressInfo = useRecoilValue(progressInfoState)
  const summaryWithHighlightedCharacter = useRecoilValue(summaryWithHighlightedCharacterState)
  const completedPercentage = useMemo(() => Math.floor(100 * (completed / progressInfo.totalCharacterSummaries)), [completed])

  return <DrawerContentView 
            closeDrawer={closeDrawer}
            progressInfo={progressInfo}
            completedPercentage={completedPercentage}
            summaryWithHighlightedCharacter={summaryWithHighlightedCharacter}
          />
}

export default DrawerContent