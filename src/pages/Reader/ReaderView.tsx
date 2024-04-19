import React, {useState, useEffect } from 'react'
import { ReactReader } from 'react-reader'
import type { Contents, Rendition } from 'epubjs'
import './Reader.css'


export const ReaderView = () => {
    const [location, setLocation] = useState<string | number>(0)
    const [rendition, setRendition] = useState<Rendition | undefined>(undefined)
    
    document.addEventListener("click", ()=>{
      // document.querySelector(".character")?.classList.add("highlighted-character")
      const test = document.querySelector(".character")
      console.log(test)
    })

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
          doc.addEventListener("click", () => {
            const characterElement = doc.querySelector(".character");
            if (characterElement) {
              characterElement.classList.add("highlighted-character");
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
      </div>
    )
  }

export default ReaderView