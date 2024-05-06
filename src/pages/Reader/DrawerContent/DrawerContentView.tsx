import { MouseEventHandler, ReactElement, useEffect, useMemo, useRef, useState } from "react"
import { useRecoilState } from "recoil"
import { selectedSummaryIndexState } from "../states"
import { ProgressInfo } from "../types"
import CharacterNavigatorIcon from '../../../assets/character_navigator_icon.png'

const DrawerContentView = ({
  closeDrawer,
  summaryWithHighlightedCharacter,
  progressInfo,
  completedPercentage
}: {
  closeDrawer: MouseEventHandler
  summaryWithHighlightedCharacter: ReactElement
  progressInfo: ProgressInfo
  completedPercentage: number
}) => {
  
  const [selectedSummaryIndex, setSelectedSummaryIndex] = useRecoilState(selectedSummaryIndexState)
  const bars = useMemo(() => Array.from({ length: progressInfo.totalCharacterSummaries }, (_, index) => index), [progressInfo])
  const barStyle = useMemo(() => ({
    backgroundColor: '#e3e3e3',
    height: '1.5vw',
    margin: '0 0.5vw',  
    width: `${Math.floor(100 / progressInfo.totalCharacterSummaries)}%`
  }), [progressInfo])

  const highlightedBarStyle = {  
    ...barStyle,
    backgroundColor: '#cd95ff'
  }

  const transparentHighlighedBarStyle = {
    ...highlightedBarStyle,
    opacity: '50%'
  }

  function viewNthSummary(index: number) {
    if(index < progressInfo.unlockedCharacterSummaries) {
      setSelectedSummaryIndex(index)
    }
  }

  const contentRef = useRef<HTMLDivElement>(null);  
  const [maxHeight, setMaxHeight] = useState('none'); 
  const [minHeight, setMinHeight] = useState('none'); 

  const transitionStyle = {  
    transition: 'all 0.5s ease-out',  
    maxHeight: maxHeight,
    minHeight: minHeight,
  };  

  useEffect(() => { 
    const summaryEl = document.getElementById("character-summary")

    if (contentRef.current && summaryEl) {
      const summaryHeight = summaryEl.offsetHeight
      const lineHeight = parseInt(summaryEl.style.lineHeight)
      const lineCount = summaryHeight / lineHeight
      const lineCountForOverflow = 9
      const amplifier = 2.5

      if(lineCount <= lineCountForOverflow) {
        setMaxHeight(lineCount * amplifier + "vh")
        setMinHeight(lineCount * amplifier + "vh")
      } else {
        setMaxHeight(lineCountForOverflow * amplifier + "vh")
        setMinHeight(lineCountForOverflow * amplifier + "vh")
      }
    }  
  }, [summaryWithHighlightedCharacter]);

  return(
    <div className='character-navigator-copy'>
      <span onClick={closeDrawer} style={{fontSize: '5vw', display: 'flex', justifyContent: 'flex-end'}}>
        &#10005;
      </span>
      <p style={{fontWeight: 'bold', marginTop: 0}}><img style={{height: '1.35vh', marginLeft: '4.3vw'}} src={CharacterNavigatorIcon}/>&nbsp; Character Navigator</p>
      <div ref={contentRef} style={transitionStyle}>
        {summaryWithHighlightedCharacter}
      </div>
      <div style={{margin: '8vw 4vw 0 4vw'}}>
        <div style={{ display: 'flex', width: '100%' }}>
          {bars.map((_, index) => (  
            <div 
              key={index}
              style={
                index < progressInfo.unlockedCharacterSummaries || (index === 0 && progressInfo.unlockedCharacterSummaries === 0) ? 
                index !== selectedSummaryIndex ? 
                transparentHighlighedBarStyle : highlightedBarStyle : barStyle
              } 
              onMouseOver={() => viewNthSummary(index)}
            />
          ))}
        </div>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '1vh', marginBottom: '3vh'}}>
        Summary based on {completedPercentage}% of story
      </div>
    </div>
  )
}

export default DrawerContentView