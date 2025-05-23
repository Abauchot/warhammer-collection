import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'

export default function CreateFaction() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nom: '',
    description: '',
    couleurs: '',
    lore: ''
  })
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/factions',
        {
          data: {
            name: form.nom,
            description: form.description,
            lore: form.lore,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setSuccess('Faction créée avec succès !')  // afficher le message
      navigate('/', { replace: true })
      setForm({ nom: '', description: '', lore: '' })
    } catch (error) {
      console.error('Erreur :', error.response?.data || error.message)
    }
  }

  return (
    <div className="h-screen w-full bg-stone-900 text-stone-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-stone-800 border-2 border-amber-600 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-4 text-amber-400 text-center">
          Ajouter une faction
        </h2>
        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-200">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom"
            required
            className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent h-24 resize-none"
          />
          <textarea
            name="lore"
            value={form.lore}
            onChange={handleChange}
            placeholder="Lore / Histoire"
            className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent h-32 resize-none"
          />
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-amber-100 font-semibold py-3 px-6 border border-amber-500 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
          >
            Ajouter
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-stone-400">Retour à l’accueil ?</p>
          <Link to="/" className="mt-2 inline-block text-amber-500 hover:text-amber-400">
            Retour
          </Link>
        </div>
      </div>
    </div>
  )
}
