import './Component.css';

import React, { useState, useEffect } from 'react';

import { Auth } from '../types';
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';

interface Props {
    auth: Auth;
    onLoggedOut: () => void;
}
interface Profile {
  username?: string ,
  email?: string ,
  userId?: number 
}

export const Profile = ({ auth, onLoggedOut }: Props) => {
    
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState<Profile>()
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const { accessToken, userId } = auth;
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
    
          setProfile(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          window.alert('Error fetching user profile');
        }
      };
    
      fetchData();
    }, [auth]);

    const handleSubmit = async (event: any) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
    
      const updatedProfile: any = {
        username: data.get('username'),
        email: data.get('email'),
        userId: auth.userId,
      };
    
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/users`,
          updatedProfile,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        setProfile(updatedProfile);
        handleClose();
      } catch (error) {
        console.error('Error updating user:', error);

      }
    };
    return (
      <>
      <button
          style={{
            background: "transparent",
            border: "1px #ffff solid",
            marginRight: "20px",
          }}
          onClick={handleOpen}
        >
          <span style={{ color: "#fff" }}>Account info</span>
        </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} className="modalContainer">
            <TextField
              margin="normal"
              fullWidth
              name="username"
              label="Username"
              type="text"
              id="username"
              defaultValue={profile ? profile.username : 'Write your username'}
              />
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              defaultValue={profile ? profile.email : 'Write your email'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
            >
              Save
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{mt: 2, bgcolor:'red'}}
              onClick={onLoggedOut}
            >
              Logout
            </Button>
          </Box>
      </Modal>
      </>
    );
};
