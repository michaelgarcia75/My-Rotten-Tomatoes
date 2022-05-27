import React, { useState } from "react";
import Typography from "@mui/material/Typography";

const Comment = (props) => {
  return (
    <div>
      <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
        {props.comment.username} on {props.comment.date} : {props.comment.comment}
      </Typography>
    </div>
  );
};

export default Comment;
