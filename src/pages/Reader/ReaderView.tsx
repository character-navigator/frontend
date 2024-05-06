import { MouseEventHandler } from "react";
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
import { ReactSetter } from "./types";
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
    scale: "100%",
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
  openDrawer,
  openDialog,
  character,
  percentUntilFirstSummary,
  setLocation,
  setRendition,
  closeDrawer,
  closeDialog,
}: {
  bookTitle: string | undefined;
  location: string | number;
  openDrawer: boolean;
  openDialog: boolean;
  character: string;
  percentUntilFirstSummary: number;
  setLocation: ReactSetter;
  setRendition: ReactSetter;
  closeDrawer: MouseEventHandler;
  closeDialog: MouseEventHandler;
}) => {
  
  const backLocation = useLocation();
  function getBackPath(){
    return backLocation.pathname === '/' + {bookTitle} ? backLocation.pathname : '/book-selector';
  }
  return (
    <div className="wrapper" style={{ height: "100vh" }}>
      <Link to={getBackPath()}>
      <RxCross1 style={{ position: "absolute", top: "1.7vh", right: "1.7vh", zIndex: 9999, fontSize: "1.45em", color:"black" }}/>
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
            You must read at least {percentUntilFirstSummary}% to unlock the
            first summary of this character.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Drawer anchor="bottom" open={openDrawer} onClose={closeDrawer}>
        <DrawerContent closeDrawer={closeDrawer} />
      </Drawer>
    </div>
  );
};

export default ReaderView;