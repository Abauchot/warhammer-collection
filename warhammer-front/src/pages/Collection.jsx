// @ts-nocheck
import React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  CardActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const Collection = () => {
  const [figurines, setFigurines] = useState([]);
  const [factions, setFactions] = useState([]);
  const [armies, setArmies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFigurine, setEditingFigurine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    type: '',
    statut: 'à peindre',
    faction: '',
    armies: [],
    image: null,
  });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [figurinesRes, factionsRes, armiesRes] = await Promise.all([
        fetch('http://localhost:1337/api/figurines?populate=*', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:1337/api/factions?populate=*', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:1337/api/armies?populate=*', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const [figurinesData, factionsData, armiesData] = await Promise.all([
        figurinesRes.json(),
        factionsRes.json(),
        armiesRes.json()
      ]);

      if (!figurinesRes.ok || !factionsRes.ok || !armiesRes.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      // Filtrer les figurines pour n'afficher que celles de l'utilisateur connecté
      const userFigurines = figurinesData.data.filter(
        figurine => figurine.users_permissions_user?.id === user.id
      );

      // Filtrer les armées pour n'afficher que celles de l'utilisateur connecté
      const userArmies = armiesData.data.filter(
        army => army.users_permissions_user?.id === user.id
      );

      setFigurines(userFigurines);
      setFactions(factionsData.data || []);
      setArmies(userArmies);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user.id]);

  const handleEdit = (figurine) => {
    if (!figurine || !figurine.documentId) {
      setError('Données de la figurine invalides');
      return;
    }
    
    setEditingFigurine(figurine);
    setFormData({
      name: figurine.name || '',
      notes: figurine.notes || '',
      type: figurine.type || '',
      statut: figurine.statut || 'à peindre',
      faction: figurine.faction?.documentId || '',
      armies: figurine.armies?.map(army => army.documentId) || [],
      image: null,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (figurine) => {
    if (!figurine || !figurine.documentId) {
      setError('DocumentID de figurine invalide');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette figurine ?')) {
      try {
        const response = await fetch(`http://localhost:1337/api/figurines/${figurine.documentId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 204) {
          setFigurines(prev => prev.filter(f => f.documentId !== figurine.documentId));
          await fetchData();
        } else {
          const data = await response.json();
          throw new Error(data.error?.message || 'Erreur lors de la suppression de la figurine');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingFigurine
        ? `http://localhost:1337/api/figurines/${editingFigurine.documentId}`
        : 'http://localhost:1337/api/figurines';
      
      const method = editingFigurine ? 'PUT' : 'POST';

      const figurineData = {
        name: formData.name,
        notes: formData.notes,
        type: formData.type,
        statut: formData.statut,
      };

      // Ajouter la faction seulement si elle est sélectionnée
      if (formData.faction) {
        const selectedFaction = factions.find(f => f.documentId === formData.faction);
        if (selectedFaction) {
          figurineData.faction = editingFigurine
            ? { set: [selectedFaction.documentId] }
            : { connect: [selectedFaction.documentId] };
        }
      } else if (editingFigurine) {
        figurineData.faction = { set: [] };
      }

      // Gérer les armées
      if (formData.armies && formData.armies.length > 0) {
        const selectedArmies = formData.armies
          .map(armyId => armies.find(a => a.documentId === armyId))
          .filter(Boolean)
          .map(army => army.documentId);

        if (selectedArmies.length > 0) {
          figurineData.armies = editingFigurine
            ? { set: selectedArmies }
            : { connect: selectedArmies };
        }
      } else if (editingFigurine) {
        figurineData.armies = { set: [] };
      }

      // Ajouter l'utilisateur seulement lors de la création
      if (!editingFigurine && user && user.id) {
        figurineData.users_permissions_user = {
          connect: [user.id]
        };
      }

      // Si une image est sélectionnée, on l'upload d'abord
      if (formData.image) {
        try {
          const formDataImg = new FormData();
          formDataImg.append('files', formData.image);

          const imageResponse = await fetch('http://localhost:1337/api/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataImg
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            if (imageData[0]?.id) {
              figurineData.photo = editingFigurine
                ? { set: [imageData[0].id] }
                : { connect: [imageData[0].id] };
            }
          }
        } catch (imageError) {
          console.warn('Erreur lors de l\'upload de l\'image, continuation sans image');
        }
      }

      const requestData = {
        data: figurineData
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
        throw new Error(responseData.error?.message || `Erreur lors de la ${editingFigurine ? 'modification' : 'création'} de la figurine`);
      }

      setOpenDialog(false);
      setEditingFigurine(null);
      setFormData({
        name: '',
        notes: '',
        type: '',
        statut: 'à peindre',
        faction: '',
        armies: [],
        image: null,
      });

      await fetchData();
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

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" color="primary">
          Ma Collection
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingFigurine(null);
            setFormData({
              name: '',
              notes: '',
              type: '',
              statut: 'à peindre',
              faction: '',
              armies: [],
              image: null,
            });
            setOpenDialog(true);
          }}
        >
          Nouvelle Figurine
        </Button>
      </Box>

      <Grid container spacing={3}>
        {figurines.map((figurine) => (
          <Grid 
            key={figurine.documentId}
            item
            xs={12} sm={6} md={4}
          >
            <Card>
              {figurine.photo && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:1337${figurine.photo.url}`}
                  alt={figurine.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {figurine.name || 'Sans nom'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {figurine.type || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Statut: {figurine.statut || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Faction: {figurine.faction?.name || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Armées: {figurine.armies?.map(army => army.name).join(', ') || '—'}
                </Typography>
                {figurine.notes && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Notes: {figurine.notes}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton 
                  onClick={() => handleEdit(figurine)}
                  disabled={!figurine}
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  onClick={() => handleDelete(figurine)}
                  disabled={!figurine}
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
          {editingFigurine ? 'Modifier la figurine' : 'Créer une nouvelle figurine'}
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <MenuItem value="infanterie">Infanterie</MenuItem>
                <MenuItem value="véhicule">Véhicule</MenuItem>
                <MenuItem value="monstre">Monstre</MenuItem>
                <MenuItem value="héro">Héro</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut"
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                required
              >
                <MenuItem value="à peindre">À peindre</MenuItem>
                <MenuItem value="en cours">En cours</MenuItem>
                <MenuItem value="terminé">Terminé</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Faction</InputLabel>
              <Select
                name="faction"
                value={formData.faction}
                onChange={(e) => setFormData({ ...formData, faction: e.target.value })}
              >
                <MenuItem value="">Aucune</MenuItem>
                {factions.map((faction) => (
                  <MenuItem key={faction.documentId} value={faction.documentId}>
                    {faction.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Armées</InputLabel>
              <Select
                name="armies"
                multiple
                value={formData.armies || []}
                onChange={(e) => setFormData({ ...formData, armies: e.target.value })}
              >
                {armies.map((army) => (
                  <MenuItem key={army.documentId} value={army.documentId}>
                    {army.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
              fullWidth
              type="file"
              onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingFigurine ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Collection; 