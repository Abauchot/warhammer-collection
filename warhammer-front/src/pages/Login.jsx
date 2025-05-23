import { useState } from 'react'
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.jwt) {
        localStorage.setItem('token', data.jwt)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/collection')
      } else {
        setError('Identifiants invalides')
      }
    } catch (err) {
      setError('Une erreur est survenue')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.main',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Connexion
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Mot de passe"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mb: 2 }}
          >
            Se connecter
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Pas encore de compte ?{' '}
            <Link
              to="/register"
              style={{
                color: '#d4af37',
                textDecoration: 'none',
              }}
            >
              Créer un compte
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  )
}

export default Login
