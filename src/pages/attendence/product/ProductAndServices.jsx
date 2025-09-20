import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
} from '@mui/material';

const ProductAndServices = () => {
  const services = [
    {
      title: 'Service 1',
      description: 'Description of Service 1',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Service 2',
      description: 'Description of Service 2',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Service 3',
      description: 'Description of Service 3',
      image: 'https://via.placeholder.com/150',
    },
    {
      title: 'Service 4',
      description: 'Description of Service 4',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Our Products & Services
      </Typography>
      <Typography variant="subtitle1" align="center" paragraph>
        Welcome to CKD VCS. We offer a range of high-quality products and services tailored to meet your needs.
      </Typography>
      <Grid container spacing={4}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                alt={service.title}
                height="140"
                image={service.image}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </CardContent>
              <Button variant="contained" color="primary" fullWidth>
                Learn More
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductAndServices;
