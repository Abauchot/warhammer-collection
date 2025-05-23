import { useState, useEffect } from 'react'
import axios from '../api/axios'

export default function CreateArmy() {
  const [form, setForm] = useState({
    name: '',
    points_value: '',
    game_format: '',
    figurines: []
  })

  const [figurinesDispo, setFigurinesDispo] = useState([])

  useEffect(() => {
    const fetchFigurines = async () => {
      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user'))

        console.log('Token:', token)
        console.log('User:', user)

        if (!user || !user.id) {
          console.error('User ID is missing or invalid')
          return
        }

        const res = await axios.get(
          `/figurines?filters[users_permissions_user][id][$eq]=${user.id}&populate=faction`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        console.log('Response from /figurines:', res.data)

        const data = res.data.data || []

        const normalized = data.map(f => {
          return {
            id: f.id,
            name: f.name || f.nom || 'Nom indisponible',
            faction: f.faction?.name || 'Faction inconnue'
          }
        })

        console.log('Normalized figurines:', normalized)
        setFigurinesDispo(normalized)

      } catch (err) {
        console.error('Erreur chargement figurines :', err.response?.data || err.message)
      }
    }

    fetchFigurines()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleFigurineToggle = (id) => {
    setForm((prev) => ({
      ...prev,
      figurines: prev.figurines.includes(id)
        ? prev.figurines.filter((f) => f !== id)
        : [...prev.figurines, id]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const payload = {
        data: {
          name: form.name,
          points_value: parseInt(form.points_value),
          game_format: form.game_format,
          figurines: form.figurines
        }
      }
      console.log('Payload for /armies:', payload)

      await axios.post('/armies', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      alert('Armée créée avec succès !')
      setForm({
        name: '',
        points_value: '',
        game_format: '',
        figurines: []
      })
    } catch (err) {
      console.error('Erreur création armée :', err.response?.data || err.message)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded shadow text-white">
      <h2 className="text-2xl font-bold mb-4">Créer une armée</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom de l’armée"
          className="border p-2 rounded text-black"
          required
        />

        <input
          name="points_value"
          type="number"
          value={form.points_value}
          onChange={handleChange}
          placeholder="Total de points"
          className="border p-2 rounded text-black"
          required
        />

        <select
          name="game_format"
          value={form.game_format}
          onChange={handleChange}
          className="border p-2 rounded text-black"
          required
        >
          <option value="">Format de jeu</option>
          <option value="kill team">Kill Team</option>
          <option value="points value">Points Value</option>
        </select>

        <div>
          <p className="font-semibold mb-2">Sélectionner des figurines :</p>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto text-white">
            {figurinesDispo.map(f => (
              <label key={f.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.figurines.includes(f.id)}
                    onChange={() => handleFigurineToggle(f.id)}
                  />
                  <span className="font-medium">{f.name}</span>
                </div>
                <span className="italic text-gray-400">{f.faction}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-700">
          Créer
        </button>
      </form>
    </div>
  )
}
