import { MouseEventHandler, MutableRefObject } from "react";
import Drawer from "@mui/material/Drawer";
import { ReactReader, ReactReaderStyle, IReactReaderStyle } from "react-reader";
import type { Rendition } from "epubjs";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DrawerContent from "./DrawerContent/DrawerContent";
import { ProgressInfo, ReactSetter } from "./types";
import { RxCross1 } from "react-icons/rx";
import { useLocation, Link } from 'react-router-dom';
import "./Reader.css";

const myReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    scale: '55%',
    color: "black",
  },
  tocAreaButton: {
    ...ReactReaderStyle.tocAreaButton,
    color: "black",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    scale: "80%",
    background: "black"
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    scale: "100%",
    background: "#f2f2f2",
    color: "black"
  },
}

export const ReaderView = ({
  bookTitle,
  location,
  drawerIsVisible,
  dialogIsVisible,
  acknowledgedSpoilers,
  character,
  progressInfo,
  percentUntilFirstSummary,
  setLocation,
  setRendition,
  closeDrawer,
  closeDialog,
  getAndSetSummaries
}: {
  bookTitle: string | undefined;
  location: string | number;
  drawerIsVisible: boolean;
  dialogIsVisible: boolean;
  acknowledgedSpoilers: MutableRefObject<boolean>;
  character: string;
  progressInfo: ProgressInfo;
  percentUntilFirstSummary: number;
  setLocation: ReactSetter;
  setRendition: ReactSetter;
  closeDrawer: MouseEventHandler;
  closeDialog: MouseEventHandler;
  getAndSetSummaries: Function;
}) => {
  
  const backLocation = useLocation()
  const dialogButtonStyle = {
    width: '50%',
    boxShadow: '0 -0.3px 0 0.3px black',
    margin: 0,
    height: '5vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'hafferBold'
}

  function getBackPath(){
    return backLocation.pathname === '/' + {bookTitle} ? backLocation.pathname : '/book-selector';
  }

  function acknowledgeSpoilers(e: any) {
    getAndSetSummaries(character, progressInfo)
    acknowledgedSpoilers.current = true
    closeDialog(e)
  }

  return (
    <div className="wrapper" style={{ height: "100vh" }}>
      <Link to={getBackPath()}>
        <RxCross1 style={{ position: "absolute", top: "1.7vh", right: "1.7vh", zIndex: 9999, fontSize: "1.23em", color:"black" }}/>
      </Link>
      <ReactReader
        url={"http://localhost:5025/api/download-epub/" + bookTitle}
        location={location}
        epubInitOptions={{
          openAs: "epub",
        }}
        locationChanged={(epubcfi: string) => setLocation(epubcfi)}
        getRendition={(_rendition: Rendition) => {
          setRendition(_rendition);
        }}
        readerStyles={myReaderTheme}
      />
      
      <Dialog
        open={dialogIsVisible}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <span style={{fontSize: '16px', fontFamily: "'HafferBold', sans-serif"}}>Spoiler Warning!</span>
          <span onClick={closeDialog} style={{fontSize: '5vw'}}>
            &#10005;
          </span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The first summary of {character} is based on <span style={{color: '#cd95ff', fontFamily: "'HafferMedium', sans-serif"}}>{percentUntilFirstSummary}%</span> of the book and might contain spoilers.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{padding: 0, justifyContent: 'space-evenly'}}>
          
        <div style={dialogButtonStyle} onClick={acknowledgeSpoilers}>
          Show
        </div>
        <div style={dialogButtonStyle} onClick={closeDialog}>
          Close
        </div>
        </DialogActions>
      </Dialog>
      <Drawer anchor="bottom" open={drawerIsVisible} onClose={closeDrawer}>
        <DrawerContent closeDrawer={closeDrawer} />
      </Drawer>
    </div>
  );
};

export default ReaderView;