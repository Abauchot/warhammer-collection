import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateArmy = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    points_value: '',
    game_format: 'points value',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const data = {
        data: {
          name: form.name,
          points_value: parseInt(form.points_value) || 0,
          game_format: form.game_format,
          users_permissions_user: {
            connect: [user.id]
          }
        }
      };

      console.log('Envoi des données:', JSON.stringify(data, null, 2));

      const response = await fetch('http://localhost:1337/api/armies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      console.log('Réponse:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Erreur lors de la création de l\'armée');
      }

      // Redirection vers la page des armées ou la collection
      navigate('/collection');
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Créer une nouvelle armée
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom de l'armée"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Points"
              name="points_value"
              type="number"
              value={form.points_value}
              onChange={handleChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Format de jeu</InputLabel>
              <Select
                name="game_format"
                value={form.game_format}
                onChange={handleChange}
                required
              >
                <MenuItem value="kill team">Kill Team</MenuItem>
                <MenuItem value="points value">Points Value</MenuItem>
              </Select>
            </FormControl>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Créer l'armée
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/collection')}
              >
                Annuler
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateArmy;
