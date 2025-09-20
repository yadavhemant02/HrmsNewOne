import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { Button, Card, CardContent, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import image1 from './../assets/2.jpg'; // Import your image
import image3 from './../assets/3.png'; // Import your image
import image4 from './../assets/6.jpg'; // Import your image

function Home() {
    const navigate = useNavigate();
    const login = () => {
        navigate("/login-page");
    };

    return (
        <div>
            <CssBaseline />
            <AppBar position="fixed" sx={{ backgroundColor: 'white' }}>
                <Toolbar>
                    <Typography sx={{ color: 'black', ml: 1, width: { xs: '70px', sm: '90px' } }} variant="h5" noWrap>
                        ONE<i sx={{ color: 'blue' }}>sol</i>
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ p: 2, flexGrow: 1, mr: 2 }}>
                        <Button sx={{ display: { xs: 'none', sm: 'block' } }}>home</Button>
                        <Button sx={{ display: { xs: 'none', sm: 'block' } }}>create</Button>
                        <Button sx={{ display: { xs: 'none', sm: 'block' } }}>about</Button>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" sx={{ display: { xs: 'none', sm: 'block' } }}>home</Button>
                        <Button variant="outlined" size='large' onClick={login}>Sign in</Button>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    mt: { xs: 7, sm: 8 },
                    minHeight: '100vh',
                    backgroundImage: `url(${image1})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: { xs: 'cover', sm: '80%' },
                    backgroundAttachment: 'fixed',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ width: '100%', height: '700px', position: 'relative' }}>
                    <Card sx={{
                        boxShadow: 'none',
                        border: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        position: 'absolute',
                        top: { xs: '10%', sm: '20%' },
                        left: { xs: '5%', sm: '10%' },
                        p: 1
                    }}>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: { xs: '24px', sm: '35px' }, color: '#8298af' }}>
                            Welcome To ONEsol !
                        </Typography>
                        <Typography sx={{ fontFamily: 'sans-serif', fontSize: { xs: '24px', sm: '35px' }, color: '#ccaaaa' }}>
                            Many Problems, One Solution
                        </Typography>
                        <Box sx={{ m: 1, p: 1, textAlign: 'center' }}>
                            <Button variant="outlined" size='large' sx={{ m: 1 }}>GO to Monitor</Button>
                            <Button variant="outlined" size='large'>Go To dashboard</Button>
                        </Box>
                    </Card>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative' }}>
                    <Card sx={{
                        boxShadow: 'none',
                        overflow: 'hidden',
                        borderRadius: 2,
                        width: { xs: '100%', sm: '500px' },
                        m: { xs: '10px', sm: '40px' }
                    }}>
                        <img
                            src={image3}
                            alt="Sample"
                            style={{
                                width: '100%',
                                height: 'auto',
                                transition: 'transform 0.3s ease-in-out',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        />
                    </Card>

                    <Card
                        sx={{
                            boxShadow: 'none',
                            width: { xs: '100%', sm: '850px' },
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 2,
                            m: { xs: '10px', sm: '40px' }
                        }}
                    >
                        <CardContent>
                            <Typography variant='h4'>
                                Multiple Problems, One Solution
                                <Typography variant='body1' sx={{ fontSize: '20px', color: 'gray', mt: 2, border: '1px solid gray', borderRadius: '10px', p: 2 }}>
                                    We create high-quality, responsive websites tailored to your business needs. From initial design concepts to final implementation, our team ensures your website is not only visually appealing but also user-friendly and optimized for search engines.
                                </Typography>
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ width: '100%', height: '400px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant='h6' align='center' sx={{ p: 2 }}>
                        {/* Add any content if needed */}
                    </Typography>
                </Box>

                <Card sx={{ position: 'relative', width: '100%', height: '700px', boxShadow: 'none' }}>
                    <img
                        src={image4}
                        alt="Sample"
                        style={{
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.3s ease-in-out',
                            objectFit: 'cover',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                    />

                    {/* Overlay content */}
                    <Box sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '30%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        textAlign: 'center',
                        p: 2,
                        backgroundColor: '#d8afa5',
                        borderRadius: '10px',
                    }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Your Title Here
                        </Typography>
                        <Typography variant="body1">
                            Your content goes here. This can be a description, a call to action, or anything you'd like.
                        </Typography>
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '35%',
                        transform: 'translate(-50%, -50%)',
                        color: '#ba5b75',
                        p: 2,
                        borderRadius: '10px',
                    }}>
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Hello Hemant !
                        </Typography>
                        <Typography variant="body1">
                            Your content goes here. This can be a description, a call to action, or anything you'd like.
                        </Typography>
                    </Box>
                </Card>

                <Box sx={{ width: '100%', height: '400px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant='h6' align='center' sx={{ p: 2 }}>
                        {/* Add any content if needed */}
                    </Typography>
                </Box>

                <Box
                    component="footer"
                    sx={{
                        width: '100%',
                        p: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        bottom: 0,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#333' }}>
                        © 2024 ONEsol. All rights reserved.
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                        Footer content goes here. Links, copyright, etc.
                    </Typography>
                </Box>

                <Box sx={{ width: '100%', height: '50px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <Typography variant='h6' align='center' sx={{ p: 2 }}>
                        {/* Add any content if needed */}
                    </Typography>
                </Box>

                <Card
                    sx={{
                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        boxShadow: 'none',
                        p: 2,
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="div" sx={{ color: 'white' }}>
                            Blurred Transparent Card
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                            This is a card with a red, semi-transparent background and a blur effect.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
}

export default Home;
