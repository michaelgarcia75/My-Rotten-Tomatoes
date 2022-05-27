// import styles from "../styles/profile.module.css";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import qs from 'qs';
import bcrypt from 'bcryptjs';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '../src/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';


export default function Profile({ user, setUser }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const router = useRouter();
  const editedUser = JSON.parse(JSON.stringify(user))

    useEffect(() =>  {
        setUsername(user.username)
        setEmail(user.email)
    }, [user])

  const  handleSubmit = async (e) =>{
    e.preventDefault(); 
    if (password === passwordConfirmation && password != ""){
    const form = {
        'username': username,
        'email': email,
        'password': bcrypt.hashSync(password, 10),
    };
    const options = {
        method: 'PUT',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(form),
        url: 'http://localhost:3001/users/' + user._id,
    };
    try {
        const res = await axios(options);
        console.log(res);
        if (res.status !== parseInt('200')) {
        } else {
            editedUser.username = username,
            editedUser.email = email,
            localStorage.setItem('user', JSON.stringify(editedUser));
            setUser(editedUser);
            router.push('/profile')
        }
    } catch (error) {
        console.log(error);
    }} else alert("Password & Password Confirmation doesn't match OR is Empty")
        
}


  return (
    // <form className={styles.form}>
    //   <span>Username :</span>
    //   <input value={username} onChange={e => setUsername(e.target.value)} type="text" ></input>
    //   <span>Email :</span>
    //   <input value={email} onChange={e => setEmail(e.target.value)} type="email" ></input>
    //   <span>Password :</span>
    //   <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="*******"></input>
    //   {/* <span>Confirm Password :</span>
    //   <input type="password" placeholder="*******"></input> */}
    //   <button onClick={e => handleSubmit(e)}>Submit</button>
    // </form>
    <Container component="main" maxWidth="xs">
    <Box
        sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>

        </Avatar>
        <Typography component="h1" variant="h5">
            Edit User
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username} onChange={e => setUsername(e.target.value)} type='text'
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email} onChange={e => setEmail(e.target.value)} type="email"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)} 
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="passwordConfirm"
                label="Password Confirmation"
                type="password"
                id="passwordConfirm"
                autoComplete="current-password"
                value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} 
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={e => handleSubmit(e)}
            >
                SUBMIT
            </Button>
            <Grid container>
                <Grid item xs>
                    <Link href="/profile" variant="body2">
                        Changed you mind ? Click to return pussy
                    </Link>
                </Grid>
            </Grid>
        </Box>
    </Box>
</Container>
    
  );
}
