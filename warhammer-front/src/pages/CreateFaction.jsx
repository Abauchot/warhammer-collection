import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
} from '@mui/material'

const CreateFaction = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    lore: '',
  })
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      
      const data = {
        data: {
          name: form.name,
          description: form.description,
          lore: form.lore,
        }
      }

      console.log('Envoi des données:', JSON.stringify(data, null, 2))

      const response = await fetch('http://localhost:1337/api/factions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()
      console.log('Réponse:', JSON.stringify(responseData, null, 2))

      if (!response.ok) {
        throw new Error(responseData.error?.message || 'Erreur lors de la création de la faction')
      }

      // Redirection vers la page des factions ou la collection
      navigate('/collection')
    } catch (error) {
      console.error('Erreur:', error)
      setError(error.message)
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Créer une nouvelle faction
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom de la faction"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Histoire (Lore)"
              name="lore"
              value={form.lore}
              onChange={handleChange}
              multiline
              rows={5}
              margin="normal"
            />

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
                Créer la faction
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
  )
}

export default CreateFaction
