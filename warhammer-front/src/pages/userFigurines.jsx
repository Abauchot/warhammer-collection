// @ts-nocheck
import React from 'react'
import { useEffect, useState } from 'react'
import axios from '../apiServices/axios'
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function UserFigurines() {
  const [figurines, setFigurines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingFigurine, setEditingFigurine] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    statut: '',
    date_achat: '',
    notes: ''
  })

  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const fetchFigurines = async () => {
    try {
      if (!user || !user.id) {
        console.error('Utilisateur non identifié')
        return
      }

      const res = await axios.get('/figurines?populate=*', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const userFigurines = res.data.data.filter(
        (f) => f.users_permissions_user?.id === user.id
      )

      setFigurines(userFigurines)
    } catch (err) {
      console.error('Erreur récupération figurines:', err.response?.data || err.message)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFigurines()
  }, [])

  const handleEdit = (figurine) => {
    if (!figurine || !figurine.documentId) {
      setError('Données de la figurine invalides')
      return
    }

    setEditingFigurine(figurine)
    setFormData({
      name: figurine.name || '',
      type: figurine.type || '',
      statut: figurine.statut || '',
      date_achat: figurine.date_achat || '',
      notes: figurine.notes || ''
    })
    setOpenDialog(true)
  }

  const handleDelete = async (figurine) => {
    if (!figurine || !figurine.documentId) {
      console.error('DocumentID de figurine invalide:', figurine)
      setError('DocumentID de figurine invalide')
      return
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette figurine ?')) {
      try {
        const response = await axios.delete(`/figurines/${figurine.documentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (response.status === 204) {
          setFigurines(prev => prev.filter(f => f.documentId !== figurine.documentId))
          await fetchFigurines()
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        setError(error.message)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingFigurine
        ? `/figurines/${editingFigurine.documentId}`
        : '/figurines'
      
      const method = editingFigurine ? 'put' : 'post'

      const requestData = {
        data: {
          name: formData.name,
          type: formData.type,
          statut: formData.statut,
          date_achat: formData.date_achat,
          notes: formData.notes,
          users_permissions_user: {
            connect: [user.id]
          }
        }
      }

      const response = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: requestData
      })

      setOpenDialog(false)
      setEditingFigurine(null)
      setFormData({
        name: '',
        type: '',
        statut: '',
        date_achat: '',
        notes: ''
      })

      if (editingFigurine) {
        setFigurines(prev => 
          prev.map(f => 
            f.documentId === editingFigurine.documentId 
              ? { ...f, ...response.data.data }
              : f
          )
        )
      } else {
        setFigurines(prev => [...prev, response.data.data])
      }

      await fetchFigurines()
    } catch (error) {
      console.error('Erreur détaillée:', error)
      setError(error.response?.data?.error?.message || error.message)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Mes Figurines
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingFigurine(null)
              setFormData({
                name: '',
                type: '',
                statut: '',
                date_achat: '',
                notes: ''
              })
              setOpenDialog(true)
            }}
          >
            Nouvelle Figurine
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {figurines.map((figurine) => (
            <Grid 
              key={figurine.documentId}
              size={{ xs: 12, sm: 6, md: 4 }}
            >
              <Card>
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
                    Date d'achat: {figurine.date_achat || '—'}
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
              <TextField
                fullWidth
                label="Date d'achat"
                name="date_achat"
                type="date"
                value={formData.date_achat}
                onChange={(e) => setFormData({ ...formData, date_achat: e.target.value })}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
    </Container>
  )
}
