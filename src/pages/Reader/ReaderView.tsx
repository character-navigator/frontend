import { MouseEventHandler } from "react";
import Drawer from "@mui/material/Drawer";
import { ReactReader } from "react-reader";
import type { Rendition } from "epubjs";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DrawerContent from "./DrawerContent/DrawerContent";
import { ReactSetter } from "./types";
import "./Reader.css";

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
  return (
    <div className="wrapper" style={{ height: "100vh" }}>
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

