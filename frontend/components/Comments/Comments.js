import React, { useState } from 'react';
import Comment from './Comment';

const Comments = props => {
  return (
    <div>
      {props.comments.map((c) => <Comment comment={c} /> )}
    </div>
  )
};

export default Comments;