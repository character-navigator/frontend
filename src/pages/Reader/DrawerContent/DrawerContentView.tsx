import { MouseEventHandler, ReactElement, useMemo } from "react"
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

  return(
    <div className='character-navigator-copy'>
      <span onClick={closeDrawer} style={{fontSize: '4vw', display: 'flex', justifyContent: 'flex-end'}}>
        &#10005;
      </span>
      <p style={{fontWeight: 'bold', marginTop: 0}}><img style={{height: '1.35vh', marginLeft: '4.3vw'}} src={CharacterNavigatorIcon}/>&nbsp; Character Navigator</p>
      <p id="character-summary">
      </p>
      {summaryWithHighlightedCharacter}
      <div style={{margin: '8vw 4vw 0 4vw'}}>
        <div style={{ display: 'flex', width: '100%' }}>
          {bars.map((_, index) => (  
            <div key={index} style={index < progressInfo.unlockedCharacterSummaries ? highlightedBarStyle : barStyle} /> // Render each div with the specified style  
          ))}
        </div>
      </div>
      <div style={{width: '100%', textAlign: 'center', marginTop: '1vh'}}>
        Summary based on {completedPercentage}% of story
      </div>
    </div>
  )
}

export default DrawerContentView