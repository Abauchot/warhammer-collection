import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // Import ajouté
import axios from '../api/axios'

export default function CreateFigurine() {
    const [form, setForm] = useState({
        nom: '',
        type: '',
        statut: '',
        date_achat: '',
        notes: '',
        faction: '',
    })

    const [factions, setFactions] = useState([])
    const navigate = useNavigate() // Hook pour la navigation

    useEffect(() => {
        const fetchFactions = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await axios.get('/factions', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                const dataArray = res.data.data || [];
                
                const normalized = dataArray.map(item => ({
                    id: item.id,
                    name: item.name
                }));
                
                setFactions(normalized)
            } catch (error) {
                console.error('Erreur chargement factions :', error.response?.data || error.message)
            }
        }
        fetchFactions()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const user = JSON.parse(localStorage.getItem('user'))

            const payload = {
                data: {
                    name: form.nom,
                    type: form.type,
                    statut: form.statut,
                    date_achat: form.date_achat,
                    notes: form.notes,
                    faction: parseInt(form.faction),
                    users_permissions_user: {
                        connect: [user.id] 
                    }
                },
            }

            await axios.post('/figurines', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            alert('Figurine ajoutée !')
            setForm({
                nom: '',
                type: '',
                statut: '',
                date_achat: '',
                notes: '',
                faction: ''
            })

            navigate('/') // Redirection vers la page d'accueil
        } catch (error) {
            console.error('Erreur lors de l’envoi :', error.response?.data || error.message)
        }
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-4 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Ajouter une figurine</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom" className="border p-2 rounded" required />

                <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded" required>
                    <option value="">Type</option>
                    <option value="infanterie">Infanterie</option>
                    <option value="véhicule">Véhicule</option>
                    <option value="héro">Héros</option>
                </select>

                <select name="statut" value={form.statut} onChange={handleChange} className="border p-2 rounded" required>
                    <option value="">Statut</option>
                    <option value="à peindre">À peindre</option>
                    <option value="en cours">En cours</option>
                    <option value="terminé">Terminé</option>
                </select>

                <input name="date_achat" type="date" value={form.date_achat} onChange={handleChange} className="border p-2 rounded" />

                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="border p-2 rounded" />

                <select name="faction" value={form.faction} onChange={handleChange} className="border p-2 rounded" required>
                    <option value="">Sélectionner une faction ({factions.length} disponibles)</option>
                    {factions.length > 0 ? (
                        factions.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name || 'Nom manquant'}
                            </option>
                        ))
                    ) : (
                        <option disabled>Chargement...</option>
                    )}
                </select>

                <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-700">
                    Ajouter
                </button>
            </form>
        </div>
    )
}
