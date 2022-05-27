import styles from "../styles/profile.module.css";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';


export default function Profile({ user }) {
const router = useRouter()
  const handleSubmit = (e) =>{
    e.preventDefault();  
    router.push('/edituser')  
}
console.log()


    return (
      <div className={styles.container}>
        <h1>Username: {user.username} </h1>
        <h1>Mail: {user.email} </h1>
        <h1>Password: ****** </h1>
        <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={e => handleSubmit(e)}
            >
                EDIT
            </Button>
        
      </div>
    );
  }
