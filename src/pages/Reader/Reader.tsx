import {useState, useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { characterState, summaryState, progressInfoState } from './states'
import type { Contents, Rendition } from 'epubjs'
import ReaderView from './ReaderView'
import { Sentence, Summary, ProgressAndSidInfo } from './types'
import axios, { isUnsuccessfulResponse } from '../../config/api'

function Reader(){
    // React-Reader states
    const [location, setLocation] = useState<string | number>(0)
    const [rendition, setRendition] = useState<Rendition | undefined>(undefined)

    // Modal states
    const [openDrawer, setOpenDrawer] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    // Helpers
    const [sentencesMap, setSentencesMap] = useState<Sentence[]>([])
    const [sentenceOnPageAndInSentencesMap, setSentenceOnPageAndInSentencesMap] = useState<Sentence | undefined>({ sid: 1, text: "" })
    const sid = useRef<number | undefined>(sentenceOnPageAndInSentencesMap?.sid);
    const bookName = "animal-farm"
    let sentencesOnPage: string[] = [];

    // For dialog
    const [character, setCharacter] = useRecoilState(characterState)
    const [percentUntilFirstSummary, setPercentUntilFirstSummary] = useState(0)

    // Setters
    const setSummary = useSetRecoilState(summaryState)
    const setProgressInfo = useSetRecoilState(progressInfoState)

    // Functions
    function closeDialog() {
      setOpenDialog(false)
    }

    function closeDrawer() {
      setOpenDrawer(false)
    }

    function splitIntoSentences(text: string) {  
      return text.split(/(?<!\b(?:Mr|Mrs|Ms|Dr|Jr|Sr|vs)\.)(?<!\b\p{L}\.)(?<=\.|\?|!)\s+/gu)
    }

    function cleanUpSentence(text: string) {  
      return text.trim().replace(/\s+/g, ' ').replace(/\s+([.!?])/g, '$1')
    }

    // Side effects
    useEffect(() => {
      axios.get("sentences").then(response => {
        if(response.status !== 200) {
          throw "Could not fetch sentences."
        } else {
          setSentencesMap(response.data)
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
                axios.get(`progress-info/${bookName}/${targetElement.innerHTML}/${sid.current}`).then(response => {
                  if(isUnsuccessfulResponse(response)) {
                    throw "Could not fetch first sid" + response.status
                  } else {
                    const progressAndSidInfo: ProgressAndSidInfo = response.data
                    
                    if(sid.current && sid.current < progressAndSidInfo.sidOfFirstCharacterSummary) {
                      setCharacter(targetElement.innerHTML)
                      setPercentUntilFirstSummary(Math.floor(100 * (progressAndSidInfo.sidOfFirstCharacterSummary / progressAndSidInfo.totalSid)))
                      setOpenDialog(true)
                    } else {
                      axios.get(`${bookName}/${targetElement.innerHTML}/${sid.current}`).then(response => {
                        if(isUnsuccessfulResponse(response)) {
                          throw "Could not fetch summary"
                        } else {
                          const partialSummary: Summary = response.data;

                          setProgressInfo({unlockedCharacterSummaries: progressAndSidInfo.unlockedCharacterSummaries, totalCharacterSummaries: progressAndSidInfo.totalCharacterSummaries})
                          setSummary(partialSummary.summary)
                          setCharacter(targetElement.innerHTML)
                          setOpenDrawer(true)
                        }
                      })
                    }
                  }
                })
                
              }
            }
          });
        });
    
        rendition.display();
      }
    }, [rendition])
      
    return <ReaderView 
              location={location}
              openDrawer={openDrawer}
              openDialog={openDialog}
              character={character}
              percentUntilFirstSummary={percentUntilFirstSummary}
              setLocation={setLocation}
              setRendition={setRendition}
              closeDrawer={closeDrawer}
              closeDialog={closeDialog}
            />
}

export default Reader