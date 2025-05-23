import { useEffect, useState } from 'react'
import axios from '../api/axios'

export default function UserFigurines() {
  const [figurines, setFigurines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMesFigurines = async () => {
      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user'))

        if (!user || !user.id) {
          console.error('Utilisateur non identifié')
          return
        }

        const res = await axios.get('/figurines?populate=*', {
          headers: { Authorization: `Bearer ${token}` }
        })

        const all = res.data.data

        const filtered = all.filter(
          (f) =>
            f.users_permissions_user &&
            f.users_permissions_user.id === user.id
        )

        const cleaned = filtered.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          statut: f.statut,
          faction: f.faction?.name || '—',
          date_achat: f.date_achat || '—',
          notes: f.notes || ''
        }))

        setFigurines(cleaned)
      } catch (err) {
        console.error('Erreur récupération figurines :', err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMesFigurines()
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold mb-6 text-amber-400 text-center">Mes figurines</h2>
      {loading ? (
        <p className="text-center text-stone-300">Chargement en cours...</p>
      ) : figurines.length === 0 ? (
        <p className="italic text-gray-500 text-center">Aucune figurine trouvée.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {figurines.map(f => (
            <li key={f.id} className="border border-stone-600 bg-stone-800 p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-lg text-amber-400 mb-2">{f.name}</h3>
              <p className="text-stone-300"><strong>Type :</strong> {f.type}</p>
              <p className="text-stone-300"><strong>Statut :</strong> {f.statut}</p>
              <p className="text-stone-300"><strong>Faction :</strong> {f.faction}</p>
              <p className="text-stone-300"><strong>Achetée le :</strong> {f.date_achat}</p>
              {f.notes && (
                <p className="text-stone-400 mt-2 italic"><strong>Notes :</strong> {f.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
