import { CSSProperties, MouseEventHandler, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react"
import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil"
import { summariesState, selectedSummaryIndexState } from "../states"
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

  function viewSummary(index: number) {
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
    overflow: 'hidden',  
  };  

  useEffect(() => { 
    const summaryEl = document.getElementById("character-summary")

    if (contentRef.current && summaryEl) { 
      const summaryHeight = summaryEl.offsetHeight;
      const lineHeight = parseInt(summaryEl.style.lineHeight)
      const lines = summaryHeight / lineHeight

      if(lines <= 9) {
        setMaxHeight(lines * 2.5 + "vh")
        setMinHeight(lines * 2.5 + "vh")
      } else {
        setMaxHeight(9 * 2.5 + "vh")
        setMinHeight(9 * 2.5 + "vh")
      }

      // console.log("scrollHeight: " + contentRef.current!.scrollHeight + " < maxHeight: " + maxHeight.substring(0, maxHeight.length - 2) + " = " + (contentRef.current!.scrollHeight < Number(maxHeight.substring(0, maxHeight.length - 2)))) 
      // if(contentRef.current!.scrollHeight <= Number(maxHeight.substring(0, maxHeight.length - 2))) {
      //   console.log("test")
      //   setMaxHeight(`5vh`);  
      // } else {
      //   console.log("test2")
      //   setMaxHeight(`${contentRef.current!.scrollHeight}px`);  
      //   setMinHeight(`${contentRef.current!.scrollHeight}px`);
      //   setTimeout(() => setMinHeight(`15vh`), 200)
      //   setTimeout(() => setMinHeight(`15vh`), 200)
      // }
      
    }  
  }, [summaryWithHighlightedCharacter]); // This effect runs when `text` changes  

  useEffect(() => {
    setSelectedSummaryIndex(progressInfo.unlockedCharacterSummaries - 1);
  }, [])

  return(
    <div className='character-navigator-copy'>
      <span onClick={closeDrawer} style={{fontSize: '4vw', display: 'flex', justifyContent: 'flex-end'}}>
        &#10005;
      </span>
      <p style={{fontWeight: 'bold', marginTop: 0}}><img style={{height: '1.35vh', marginLeft: '4.3vw'}} src={CharacterNavigatorIcon}/>&nbsp; Character Navigator</p>
      <div ref={contentRef} style={transitionStyle} className="smooth-transition">
        {summaryWithHighlightedCharacter}
      </div>
      <div style={{margin: '8vw 4vw 0 4vw'}}>
        <div style={{ display: 'flex', width: '100%' }}>
          {bars.map((_, index) => (  
            <div 
              key={index}
              style={
                index < progressInfo.unlockedCharacterSummaries ? 
                index !== selectedSummaryIndex? 
                transparentHighlighedBarStyle : highlightedBarStyle : barStyle
              } 
              onMouseOver={() => viewSummary(index)}
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