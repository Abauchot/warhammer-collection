// @ts-nocheck
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Gérez votre Collection',
      description: 'Cataloguez vos figurines Warhammer 40,000 et suivez votre progression.',
    },
    {
      title: 'Organisez par Faction',
      description: 'Classez vos figurines par faction et armée pour une meilleure organisation.',
    },
    {
      title: 'Suivez votre Progression',
      description: 'Gardez une trace de vos figurines peintes et de celles en attente.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("/hero-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 8,
          mb: 6,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          Warhammer 40K Collection
        </Typography>
        <Typography variant="h5" component="h2" sx={{ mb: 4 }}>
          Pour la gloire de l'Empereur et au-delà
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
          sx={{ mr: 2 }}
        >
          Commencer
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/login')}
        >
          Se Connecter
        </Button>
      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid key={index} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 2 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom color="primary">
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h4" component="h3" gutterBottom>
          Prêt à rejoindre la bataille ?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Créez votre compte et commencez à gérer votre collection dès aujourd'hui.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/register')}
        >
          Créer un compte
        </Button>
      </Box>
    </Box>
  );
};

export default Home; 