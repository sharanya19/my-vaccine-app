import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from "@mui/material";
import api from '@/utils/axios'; // Adjust the path if necessary
import { API_PATH } from '@/utils/appRoutes'; // Adjust the path if necessary
import { useRouter } from 'next/router';
import { setToken } from '@/utils/auth';

interface LoginResponse {
    access: string;
    refresh: string;
}


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();


    const handleLogin = () => {
        // Handle login logic here
        console.log("username:", username);
        console.log("Password:", password);
        api.post<LoginResponse>(API_PATH.LOGIN, { username, password })
        .then((response) => {
            console.log('API RESPONSE', response);
            setToken(response.data.access)
        })
        .then(() => {
            // Redirect to home page after successful login
            router.push('/');
        })
    };

    return (
        <Container maxWidth="sm">
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight="100vh"
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={handleLogin}
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}