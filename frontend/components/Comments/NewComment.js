import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const NewComment = (props) => {
  const [newComment, setNewComment] = useState([""]);

  const handleChange = (e) => {
    setNewComment(e.target.value);
  };

  const sendComment = () => {
    props.sendComment(newComment);
    setNewComment("");
  };

  return (
    <div>
      <Box
        sx={{
          width: 500,
          maxWidth: "100%",
        }}
      >
        <TextField
          fullWidth
          value={newComment}
          onChange={(e) => handleChange(e)}
          label="Write your review"
          id="Commentaire"
        />
      </Box>
      <br></br>
      <Button variant="contained" onClick={sendComment} endIcon={<SendIcon />}>
        Send
      </Button>
    </div>
  );
};

export default NewComment;
