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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const Factions = () => {
  const navigate = useNavigate();
  const [factions, setFactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFaction, setEditingFaction] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    lore: '',
  });

  const token = localStorage.getItem('token');

  const fetchFactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:1337/api/factions?populate=*', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erreur lors de la récupération des factions');
      }

      // Utiliser directement les données de l'API
      setFactions(data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des factions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFactions();
  }, [token]);

  const handleEdit = (faction) => {
    if (!faction) {
      setError('Impossible de modifier cette faction : données invalides');
      return;
    }
    
    setEditingFaction(faction);
    setFormData({
      name: faction.name || '',
      description: faction.description || '',
      lore: faction.lore || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (faction) => {
    if (!faction || !faction.documentId) {
      console.error('DocumentID de faction invalide:', faction);
      setError('DocumentID de faction invalide');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette faction ?')) {
      try {

        const response = await fetch(`http://localhost:1337/api/factions/${faction.documentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 204) {

          setFactions(prevFactions => prevFactions.filter(f => f.documentId !== faction.documentId));
          await fetchFactions();
        } else {
          const data = await response.json();
          throw new Error(data.error?.message || 'Erreur lors de la suppression de la faction');
        }
        
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFaction
        ? `http://localhost:1337/api/factions/${editingFaction.documentId}`
        : 'http://localhost:1337/api/factions';
      
      const method = editingFaction ? 'PUT' : 'POST';

      const requestData = {
        data: {
          name: formData.name,
          description: formData.description || '',
          lore: formData.lore || ''
        }
      };
      
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
        throw new Error(responseData.error?.message || `Erreur lors de la ${editingFaction ? 'modification' : 'création'} de la faction`);
      }

      setOpenDialog(false);
      setEditingFaction(null);
      setFormData({ name: '', description: '', lore: '' });
      
      // Mettre à jour la liste des factions
      if (editingFaction) {
        // Pour une modification, mettre à jour la faction dans la liste
        setFactions(prevFactions => 
          prevFactions.map(faction => 
            faction.documentId === editingFaction.documentId 
              ? { ...faction, ...responseData.data }
              : faction
          )
        );
      } else {
        // Pour une création, ajouter la nouvelle faction à la liste
        setFactions(prevFactions => [...prevFactions, responseData.data]);
      }

      // Recharger les données pour s'assurer de la synchronisation
      await fetchFactions();
    } catch (error) {
      console.error('Erreur détaillée:', error);
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
            Factions
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingFaction(null);
              setFormData({ name: '', description: '', lore: '' });
              setOpenDialog(true);
            }}
          >
            Nouvelle Faction
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {factions.map((faction) => (
            <Grid 
              key={faction.documentId}
              size={{ xs: 12, sm: 6, md: 4 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {faction.name || 'Sans nom'}
                  </Typography>
                  {faction.description && (
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {faction.description}
                    </Typography>
                  )}
                  {faction.lore && (
                    <Typography variant="body2" color="text.secondary">
                      {faction.lore}
                    </Typography>
                  )}
                  {faction.figurines?.length > 0 && (
                    <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                      Figurines: {faction.figurines.length}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton 
                    onClick={() => handleEdit(faction)}
                    disabled={!faction}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(faction)}
                    disabled={!faction}
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
            {editingFaction ? 'Modifier la faction' : 'Créer une nouvelle faction'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nom"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                margin="normal"
                error={!formData.name}
                helperText={!formData.name ? 'Le nom est requis' : ''}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Histoire (Lore)"
                name="lore"
                value={formData.lore}
                onChange={(e) => setFormData({ ...formData, lore: e.target.value })}
                multiline
                rows={5}
                margin="normal"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={!formData.name}
            >
              {editingFaction ? 'Modifier' : 'Créer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Factions; 