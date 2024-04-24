import React, {useState, useEffect, useMemo, useRef } from 'react'
import Drawer from '@mui/material/Drawer';
import { ReactReader } from 'react-reader'
import type { Contents, Rendition } from 'epubjs'
import CharacterNavigatorIcon from '../../assets/character_navigator_icon.png'
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './Reader.css'


export const ReaderView = () => {
    interface Sentence {
      sid: number
      text: string
    }

    interface Summary {
      endSid: number
      name: string
      summary: string
    }

    interface ProgressAndSidInfo {
      sidOfFirstCharacterSummary: number
      totalSid: number
      unlockedCharacterSummaries: number
      totalCharacterSummaries : number
    }

    const [location, setLocation] = useState<string | number>(0)
    const [rendition, setRendition] = useState<Rendition | undefined>(undefined)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [sentencesMap, setSentencesMap] = useState<Sentence[]>([])
    const [sentenceOnPageAndInSentencesMap, setSentenceOnPageAndInSentencesMap] = useState<Sentence | undefined>({ sid: 1, text: "" })
    const sid = useRef<number | undefined>(sentenceOnPageAndInSentencesMap?.sid);
    const [percentUntilFirstSummary, setPercentUntilFirstSummary] = useState(0)
    const [character, setCharacter] = useState("Jones")
    const [summary, setSummary] = useState("Mr. Jones is the owner of Animal Farm. He neglects the animals, spends most of his time drinking and reading the news " +
    "paper and not feeding them. He is taken by surprise by the animals when they fight back against him and his men, so much " +
    "so that he is thrown off the farm.")
    const [characterSummaryInfo, setCharacterSummaryInfo] = useState({
      unlockedCharacterSummaries: 1,
      totalCharacterSummaries: 1
    })
    const bars = useMemo(() => Array.from({ length: characterSummaryInfo.totalCharacterSummaries }, (_, index) => index), [characterSummaryInfo])
    const barStyle = useMemo(() => ({
      backgroundColor: '#e3e3e3',
      height: '1.5vw',
      margin: '0 0.5vw',  
      width: `${Math.floor(100 / characterSummaryInfo.totalCharacterSummaries)}%`
    }), [characterSummaryInfo])
    const completedPercentage = useMemo(() => Math.floor(100 * (characterSummaryInfo.unlockedCharacterSummaries / characterSummaryInfo.totalCharacterSummaries)), [characterSummaryInfo])
    const summaryWithHighlightedCharacter = useMemo<any>(() => renderSummaryWithHighlightedCharacter(character, summary), [summary])
    const bookName = "animal-farm"
    let sentencesOnPage: string[] = [];

    function renderSummaryWithHighlightedCharacter(characterName: string, summary: string) {
      const summaryStyle = {margin: '1vh 2vh'}
      const characterIndex = summary.indexOf(characterName)
      const summaryWithoutCharacter = summary.substring(characterIndex + characterName.length)

      return <p style={summaryStyle}><span className='character-name'>{ characterName }</span>{ summaryWithoutCharacter }</p>
    }

    function closeDialog() {
      setOpenDialog(false)
    }

    function splitIntoSentences(text: string) {  
      return text.split(/(?<!\b(?:Mr|Mrs|Ms|Dr|Jr|Sr|vs)\.)(?<!\b\p{L}\.)(?<=\.|\?|!)\s+/gu)
    }

    function cleanUpSentence(text: string) {  
      return text.trim().replace(/\s+/g, ' ').replace(/\s+([.!?])/g, '$1')
    }

    const highlightedBarStyle = {  
      ...barStyle,
      backgroundColor: '#cd95ff'
    }

    useEffect(() => {
      fetch("http://localhost:5025/sentences", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
      }).then(response => {
        if(response.status !== 200) {
          throw "Could not fetch sentences."
        } else {
          response.json().then((result: Sentence[]) => {
            setSentencesMap(result)
          })
        }
      })
    }, [])

    useEffect(() => {
      if(rendition){
          const updateSid = (cfiRange: string, contents: Contents) => {
            const {
              start,
              end
            } = rendition.location;
            
            if (start && end) {
              function updateSentencesOnPage() {
                const splitCfi = start.cfi.split('/')
                const baseCfi = splitCfi[0] + '/' + splitCfi[1] + '/' + splitCfi[2] + '/' + splitCfi[3]
                const startCfi = start.cfi.replace(baseCfi, '')
                const endCfi = end.cfi.replace(baseCfi, '')
                const rangeCfi = [baseCfi, startCfi, endCfi].join(',')
                const pageContent = rendition!.getRange(rangeCfi).toString()
                sentencesOnPage = splitIntoSentences(pageContent).map(sentence => cleanUpSentence(sentence))
              }
            
              function updateSentenceOnPageAndInSentencesMap() {
                const letterCountForGenericExclamationsAndPunctuation = 3
                const candidateSentence: Sentence | undefined = sentencesMap.find(sentence => 
                  sentencesOnPage.some(sentenceOnPage => sentence.text.includes(sentenceOnPage) && sentenceOnPage.length > letterCountForGenericExclamationsAndPunctuation))

                if(candidateSentence && candidateSentence.sid > (sentenceOnPageAndInSentencesMap as Sentence).sid) {
                  setSentenceOnPageAndInSentencesMap(candidateSentence)
                }
              }

              updateSentencesOnPage()
              updateSentenceOnPageAndInSentencesMap()
              sid.current = sentenceOnPageAndInSentencesMap?.sid
            }
          }

            rendition.on("locationChanged", updateSid)
            return () => {
                rendition?.off('locationChanged', updateSid)
            }
        }
    })


    useEffect(() => {
      if (rendition) {
        rendition.hooks.content.register((contents: any) => {
          const doc = contents.document;
          doc.addEventListener("click", (e: MouseEvent) => {
            const characterElements: Array<HTMLElement> = doc.querySelectorAll(".character")
            const targetElement = e.target as Element
            const highlightColor = 'rgb(205, 149, 255)'

            characterElements.forEach(el => {
              el.style['transition'] = 'background-color 0.5s'
            })

            if (!targetElement.classList.contains("character")) {
                characterElements.forEach(el => {
                  el.style['backgroundColor'] = el.style['backgroundColor'] == highlightColor ? '' : highlightColor
                })
            } else {
              if(targetElement.innerHTML === "Snowball" || targetElement.innerHTML === "Napoleon") {
                fetch(`http://localhost:5025/progress-info/${bookName}/${targetElement.innerHTML}/${sid.current}`).then(response => {
                  if(response.status !== 200) {
                    throw "Could not fetch first sid" + response.status
                  } else {
                    response.json().then((progressAndSidInfo: ProgressAndSidInfo) => {
                      if(sid.current && sid.current < progressAndSidInfo.sidOfFirstCharacterSummary) {
                        setCharacter(targetElement.innerHTML)
                        setPercentUntilFirstSummary(Math.floor(100 * (progressAndSidInfo.sidOfFirstCharacterSummary / progressAndSidInfo.totalSid)))
                        setOpenDialog(true)
                      } else {
                        fetch(`http://localhost:5025/${bookName}/${targetElement.innerHTML}/${sid.current}`).then(response => {
                          if(response.status !== 200) {
                            throw "Could not fetch summary"
                          } else {
                            response.json().then((partialSummary: Summary) => {
                              setCharacterSummaryInfo({unlockedCharacterSummaries: progressAndSidInfo.unlockedCharacterSummaries, totalCharacterSummaries: progressAndSidInfo.totalCharacterSummaries})
                              setSummary(partialSummary.summary)
                              setCharacter(targetElement.innerHTML)
                              setOpenDrawer(true)
                            })
                          }
                        })
                      }
                    })
                  }
                })
                
              }
            }
          });
        });
    
        rendition.display();
      }
    }, [rendition]);

    return (
      <div className="wrapper" style={{ height: '100vh' }}>
        <ReactReader
          url="http://localhost:5025/download-epub"
          location={location}
          epubInitOptions={{
            openAs: "epub"
          }}
          locationChanged={(epubcfi: string) => setLocation(epubcfi)}
          getRendition={(_rendition: Rendition) => {
            setRendition(_rendition)
          }}
        />
        <Dialog
          open={openDialog}
          onClose={closeDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {character}: Summary Not Unlocked
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You must read at least {percentUntilFirstSummary}% to unlock the first summary of this character.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
          </DialogActions>
        </Dialog>
        <Drawer
          anchor="bottom"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}>
            <div className='character-navigator-copy'>
              <span onClick={() => setOpenDrawer(false)} style={{fontSize: '4vw', display: 'flex', justifyContent: 'flex-end'}}>&#10005;</span>
              <p style={{fontWeight: 'bold', marginTop: 0}}><img style={{height: '1.35vh', marginLeft: '4.3vw'}} src={CharacterNavigatorIcon}/>&nbsp; Character Navigator</p>
              <p id="character-summary">
              </p>
              {summaryWithHighlightedCharacter}
              <div style={{margin: '8vw 4vw 0 4vw'}}>
                <div style={{ display: 'flex', width: '100%' }}>
                  {bars.map((_, index) => (  
                    <div key={index} style={index < characterSummaryInfo.unlockedCharacterSummaries ? highlightedBarStyle : barStyle} /> // Render each div with the specified style  
                  ))}
                </div>
              </div>
              <div style={{width: '100%', textAlign: 'center', marginTop: '1vh'}}>
                Summary based on {completedPercentage}% of story
              </div>
            </div>
            
          </Drawer>
      </div>
    )
  }

export default ReaderView