// @ts-nocheck
import React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Armies = () => {
  const navigate = useNavigate();
  const [armies, setArmies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArmy, setEditingArmy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    points_value: '',
    game_format: 'points value',
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchArmies = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/armies?populate=*', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de la récupération des armées');
      }

      // Traiter toutes les armées sans filtrage
      const processedArmies = data.data.map(army => {
        // Extraire les données soit de la racine, soit des attributs
        const armyData = army.attributes || army;
        return {
          id: army.id,
          documentId: armyData.documentId,
          name: armyData.name,
          points_value: armyData.points_value,
          game_format: armyData.game_format,
          users_permissions_user: armyData.users_permissions_user
        };
      });

      setArmies(processedArmies);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArmies();
  }, [token, user.id]);

  const handleEdit = (army) => {
    if (!army || !army.documentId) {
      setError('Données de l\'armée invalides');
      return;
    }
    setEditingArmy(army);
    setFormData({
      name: army.name || '',
      points_value: army.points_value || '',
      game_format: army.game_format || 'points value',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (army) => {
    if (!army || !army.documentId) {
      setError('DocumentID d\'armée invalide');
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette armée ?')) {
      try {
        const response = await fetch(`http://localhost:1337/api/armies/${army.documentId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 204) {
          await fetchArmies();
        } else {
          const data = await response.json();
          throw new Error(data.error?.message || 'Erreur lors de la suppression de l\'armée');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingArmy
        ? `http://localhost:1337/api/armies/${editingArmy.documentId}`
        : 'http://localhost:1337/api/armies';
      const method = editingArmy ? 'PUT' : 'POST';
      const requestData = {
        data: {
          name: formData.name,
          points_value: parseInt(formData.points_value) || 0,
          game_format: formData.game_format,
        }
      };
      if (!editingArmy) {
        requestData.data.users_permissions_user = { connect: [user.id] };
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Erreur lors de la sauvegarde de l\'armée');
      }
      setOpenDialog(false);
      setEditingArmy(null);
      setFormData({ name: '', points_value: '', game_format: 'points value' });
      await fetchArmies();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Mes Armées
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingArmy(null);
              setFormData({ name: '', points_value: '', game_format: 'points value' });
              setOpenDialog(true);
            }}
          >
            Nouvelle Armée
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {armies.map((army) => (
            <Grid 
              key={army.documentId}
              container
              spacing={2}
              direction="column"
              style={{ 
                flex: '0 0 auto',
                width: {
                  xs: '100%',
                  sm: '50%',
                  md: '33.333%'
                },
                padding: '16px'
              }}
            >
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {army.name || 'Sans nom'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Format: {army.game_format || 'Non spécifié'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Points: {army.points_value || 0}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton 
                    onClick={() => handleEdit(army)}
                    disabled={!army.documentId}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(army)}
                    disabled={!army.documentId}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingArmy ? 'Modifier l\'armée' : 'Créer une nouvelle armée'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nom"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Points"
                name="points_value"
                type="number"
                value={formData.points_value}
                onChange={(e) => setFormData({ ...formData, points_value: e.target.value })}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Format de jeu</InputLabel>
                <Select
                  name="game_format"
                  value={formData.game_format}
                  onChange={(e) => setFormData({ ...formData, game_format: e.target.value })}
                  required
                >
                  <MenuItem value="kill team">Kill Team</MenuItem>
                  <MenuItem value="points value">Points Value</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingArmy ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Armies; 