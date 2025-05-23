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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Collection = () => {
  const [figurines, setFigurines] = useState([]);
  const [factions, setFactions] = useState([]);
  const [armies, setArmies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newFigurine, setNewFigurine] = useState({
    name: '',
    notes: '',
    type: '',
    statut: 'à peindre',
    faction: '',
    army: '',
    image: null,
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [figurinesRes, factionsRes, armiesRes] = await Promise.all([
          fetch('http://localhost:1337/api/figurines', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:1337/api/factions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:1337/api/armies', {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const [figurinesData, factionsData, armiesData] = await Promise.all([
          figurinesRes.json(),
          factionsRes.json(),
          armiesRes.json()
        ]);

        console.log('Figurines data:', figurinesData);
        console.log('Factions data:', factionsData);
        console.log('Armies data:', armiesData);

        if (!figurinesRes.ok || !factionsRes.ok || !armiesRes.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        setFigurines(figurinesData.data || []);
        setFactions(factionsData.data || []);
        setArmies(armiesData.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Une erreur est survenue lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewFigurine({
      name: '',
      notes: '',
      type: '',
      statut: 'à peindre',
      faction: '',
      army: '',
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFigurine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewFigurine((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      const figurineData = {
        name: newFigurine.name,
        notes: newFigurine.notes,
        type: newFigurine.type,
        statut: newFigurine.statut,
      };

      // Ajouter la faction seulement si elle est sélectionnée
      if (newFigurine.faction) {
        figurineData.faction = {
          connect: [newFigurine.faction]
        };
      }

      // Ajouter l'armée seulement si elle est sélectionnée
      if (newFigurine.army) {
        figurineData.armies = {
          connect: [newFigurine.army]
        };
      }

      // Ajouter l'utilisateur
      if (user && user.id) {
        figurineData.users_permissions_user = {
          connect: [user.id]
        };
      }

      // Si une image est sélectionnée, on l'upload d'abord
      if (newFigurine.image) {
        try {
          const formData = new FormData();
          formData.append('files', newFigurine.image);

          const imageResponse = await fetch('http://localhost:1337/api/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            if (imageData[0]?.id) {
              figurineData.photo = {
                connect: [imageData[0].id]
              };
            }
          }
        } catch (imageError) {
          console.warn('Erreur lors de l\'upload de l\'image, continuation sans image');
        }
      }

      // Envelopper les données dans l'objet data attendu par Strapi
      const data = {
        data: figurineData
      };

      console.log('Structure complète des données envoyées:', JSON.stringify(data, null, 2));

      const response = await fetch('http://localhost:1337/api/figurines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      console.log('Response complète de Strapi:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Erreur lors de la création de la figurine');
      }

      handleCloseDialog();
      window.location.reload();
    } catch (error) {
      console.error('Error adding figurine:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'ajout de la figurine');
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/create-faction')}
          >
            Nouvelle Faction
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/create-army')}
          >
            Nouvelle Armée
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Ajouter une figurine
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {figurines.map((figurine) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={figurine.id}>
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
              {figurine.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:1337${figurine.image.url}`}
                  alt={figurine.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {figurine.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Type: {figurine.type}
                </Typography>
                <Typography variant="body2" color="primary">
                  Statut: {figurine.statut}
                </Typography>
                {figurine.faction && (
                  <Typography variant="body2" color="primary">
                    Faction: {figurine.faction}
                  </Typography>
                )}
                {figurine.army && (
                  <Typography variant="body2" color="primary">
                    Armée: {figurine.army}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une nouvelle figurine</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom"
              name="name"
              value={newFigurine.name}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={newFigurine.notes}
              onChange={handleInputChange}
              multiline
              rows={4}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={newFigurine.type || ''}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="héro">Héro</MenuItem>
                <MenuItem value="infanterie">Infanterie</MenuItem>
                <MenuItem value="véhicule">Véhicule</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut"
                value={newFigurine.statut || ''}
                onChange={handleInputChange}
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
                value={newFigurine.faction || ''}
                onChange={handleInputChange}
              >
                {factions.map((faction) => (
                  <MenuItem key={faction.id} value={faction.id}>
                    {faction.attributes?.name || faction.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Armée</InputLabel>
              <Select
                name="army"
                value={newFigurine.army || ''}
                onChange={handleInputChange}
              >
                {armies.map((army) => (
                  <MenuItem key={army.id} value={army.id}>
                    {army.attributes?.name || army.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Ajouter une image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Collection; 