import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
} from '@mui/material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        About India’s Most Popular IT Service Provider Company
      </Typography>

      <Typography variant="body1" paragraph>
        With thousands of satisfied customers, Venture Consultancy Services has been a prominent Software Development Company, operating independently since 2015. Our journey began in Lucknow, often referred to as the City of Nawabs, where Venture Consultancy Services originated.
      </Typography>

      <Typography variant="body1" paragraph>
        At Venture Consulting Services, we are more than just a Software Development Company – we are your technology partners. Our commitment to excellence, innovation, and client satisfaction has propelled us to become one of the fastest-growing Software Development Companies.
      </Typography>

      <Typography variant="h6" gutterBottom>
        Our Services
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Application Development</Typography>
            <Typography variant="body2" color="text.secondary">
              Custom software solutions tailored to your business needs.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">IT Consulting</Typography>
            <Typography variant="body2" color="text.secondary">
              Expert advice to navigate the complex technology landscape.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Mobile App Development</Typography>
            <Typography variant="body2" color="text.secondary">
              Innovative mobile solutions for a connected world.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Blockchain Technology</Typography>
            <Typography variant="body2" color="text.secondary">
              Secure and transparent solutions powered by blockchain.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Cryptocurrency Exchange</Typography>
            <Typography variant="body2" color="text.secondary">
              Safe and efficient platforms for trading cryptocurrencies.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">CRM Software</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage customer relationships with our robust CRM solutions.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Cloud-Based Solutions</Typography>
            <Typography variant="body2" color="text.secondary">
              Scalable and secure cloud solutions for your business.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Full Stack Development</Typography>
            <Typography variant="body2" color="text.secondary">
              End-to-end development for web applications.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="body1" paragraph sx={{ marginTop: 4 }}>
        What sets us apart is not just our longevity in the industry but the high standards of performance we maintain. With a dedicated team of heroes supporting our server uptime, Venture Consultancy Services ensures that your online presence remains robust and reliable.
      </Typography>

      <Typography variant="body1" paragraph>
        Join us on a journey where innovation meets expertise. Experience the difference with Venture Consultancy Services where technology transforms possibilities into realities.
      </Typography>

    </Container>
  );
};

export default About;
