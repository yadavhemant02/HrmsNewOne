import React, { useState } from "react";
import { Button, Box, Typography, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FileUploadPreview = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*, application/pdf"
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span">
          Upload File
        </Button>
      </label>

      {file && (
        <Box mt={2}>
          <Typography variant="subtitle1">Selected File: {file.name}</Typography>

          <Button variant="outlined" onClick={handleOpen} sx={{ mt: 2 }}>
            View File
          </Button>

          <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
              Preview
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              {file.type.startsWith("image/") ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "auto" }}
                />
              ) : file.type === "application/pdf" ? (
                <iframe
                  src={preview}
                  title="PDF Preview"
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                ></iframe>
              ) : (
                <Typography>No preview available</Typography>
              )}
            </DialogContent>
          </Dialog>
        </Box>
      )}
    </Box>
  );
};

export default FileUploadPreview;
