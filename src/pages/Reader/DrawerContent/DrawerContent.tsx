import { useMemo } from "react"
import { useRecoilValue } from "recoil"
import { progressInfoState, summaryWithHighlightedCharacterState } from "../states"
import DrawerContentView from "./DrawerContentView"

const DrawerContent = ({
  closeDrawer
}: {
  closeDrawer: any
}) => {
  const progressInfo = useRecoilValue(progressInfoState)
  const completedPercentage = useMemo(() => Math.floor(100 * (progressInfo.unlockedCharacterSummaries / progressInfo.totalCharacterSummaries)), [progressInfo])
  const summaryWithHighlightedCharacter = useRecoilValue(summaryWithHighlightedCharacterState)

  return <DrawerContentView 
            closeDrawer={closeDrawer}
            progressInfo={progressInfo}
            completedPercentage={completedPercentage}
            summaryWithHighlightedCharacter={summaryWithHighlightedCharacter}
          />
}

export default DrawerContent