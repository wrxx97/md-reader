import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface FooterProps {
  onPrev: () => void;
  onNext: () => void;
  currentChapter: number;
  totalChapters: number;
}

const Footer: React.FC<FooterProps> = ({
  onPrev,
  onNext,
  currentChapter,
  totalChapters,
}) => {
  return (
    <Box
      component="footer"
      sx={{
        height: "32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <IconButton onClick={onPrev} disabled={currentChapter <= 1}>
        <ArrowBackIosIcon />
      </IconButton>

      <Typography variant="body2" color="textSecondary">
        Chapter {currentChapter} of {totalChapters}
      </Typography>

      <IconButton onClick={onNext} disabled={currentChapter >= totalChapters}>
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default Footer;
