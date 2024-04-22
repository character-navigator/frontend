import React, {useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer';
import { ReactReader } from 'react-reader'
import type { Contents, Rendition } from 'epubjs'
import CharacterNavigatorIcon from '../../assets/character_navigator_icon.png'
import './Reader.css'


export const ReaderView = () => {
    const [location, setLocation] = useState<string | number>(0)
    const [rendition, setRendition] = useState<Rendition | undefined>(undefined)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [summaryWithHighlightedCharacter, setSummaryWithHighlightedCharacter] = useState<any>()

    const summary = "Mr. Jones is the owner of Animal Farm. He neglects the animals, spends most of his time drinking and reading the news " +
    "paper and not feeding them. He is taken by surprise by the animals when they fight back against him and his men, so much " +
    "so that he is thrown off the farm."

    function renderSummaryWithHighlightedCharacter(characterName: string, summary: string) {
      const characterIndex = summary.indexOf(characterName)
      const summaryWithoutCharacter = summary.substring(characterIndex + characterName.length)

      return <p style={{margin: '1vh 2vh'}}><span className='character-name'>{ characterName }</span>{ summaryWithoutCharacter }</p>
    }

    const count = 8
    const barWidth = Math.floor(100 / count)
    const bars = Array.from({ length: count }, (_, index) => index);
    const barStyle = {  
      backgroundColor: '#cd95ff',  
      height: '1.5vw',
      margin: '0 0.5vw',  
      width: `${barWidth}%`, // Divide 100% by the number of divs to get equal width  
    };  

    // useEffect(() => {
       
    //   if(rendition){
          
    //       const test = (cfiRange: string, contents: Contents) => {
    //             const {
    //                 start,
    //                 end
    //             } = rendition.location;
                

    //             if (start && end) {
                
    //                 const splitCfi = start.cfi.split('/');
    //                 const baseCfi = splitCfi[0] + '/' + splitCfi[1] + '/' + splitCfi[2] + '/' + splitCfi[3];
    //                 const startCfi = start.cfi.replace(baseCfi, '');
    //                 const endCfi = end.cfi.replace(baseCfi, '');
    //                 const rangeCfi = [baseCfi, startCfi, endCfi].join(',');
    //                 const pageContent = rendition.getRange(rangeCfi).toString()
                    
    //                 console.log(pageContent.includes("Snowball"))
    //             }
                
    //         }

    //         rendition.on("locationChanged", test)
    //         return () => {
    //             rendition?.off('locationChanged', test)
    //         }
    //     }
    // })


    useEffect(() => {
      if (rendition) {
        rendition.hooks.content.register((contents: any) => {
          const doc = contents.document;
          doc.addEventListener("click", (e: React.MouseEvent) => {
            const characterElement: Element = doc.querySelector(".character");
            const targetElement = e.target as Element;
            const highlightedCharacter = "highlighted-character"

            if (!targetElement.classList.contains("character")) {
              if (characterElement) {
                console.log(characterElement)
                if (characterElement.classList.contains(highlightedCharacter)) {
                  characterElement.classList.remove(highlightedCharacter)
                } else {
                  characterElement.classList.add(highlightedCharacter)
                }
              }
            } else {
              setSummaryWithHighlightedCharacter(
                renderSummaryWithHighlightedCharacter(targetElement.innerHTML, summary)
              )
              setOpenDrawer(true)
              console.log(targetElement.innerHTML)
              characterElement.classList.remove(highlightedCharacter)
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
                    <div key={index} style={barStyle} /> // Render each div with the specified style  
                  ))}
                </div>
              </div>
              <div style={{width: '100%', textAlign: 'center', marginTop: '1vh'}}>
                Summary based on {barWidth}%
              </div>
            </div>
            
          </Drawer>
      </div>
    )
  }

export default ReaderView