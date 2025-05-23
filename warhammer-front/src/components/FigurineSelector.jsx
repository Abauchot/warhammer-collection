import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function FigurineSelector({ selected, onToggle }) {
  const [figurines, setFigurines] = useState([]);

  useEffect(() => {
    const fetchFigurines = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.id) {
          console.error('Utilisateur non identifié');
          return;
        }

        const res = await axios.get('/figurines', {
          params: {
            populate: ['faction', 'users_permissions_user'], 
            'filters[users_permissions_user][id][$eq]': user.id, 
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.data.map((f) => ({
          id: f.id,
          name: f.name || '—',
          faction: f.faction?.name || '—',
        }));

        setFigurines(filtered);
      } catch (err) {
        console.error('Erreur chargement figurines :', err.response?.data || err.message);
      }
    };

    fetchFigurines();
  }, []);

  return (
    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border p-2 rounded bg-gray-50">
      {figurines.length === 0 ? (
        <p className="text-sm italic text-gray-500">Aucune figurine disponible</p>
      ) : (
        figurines.map((f) => (
          <label key={f.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(f.id)}
                onChange={() => onToggle(f.id)}
              />
              <span className="font-medium">{f.name}</span>
            </div>
            <span className="italic text-gray-600">{f.faction}</span>
          </label>
        ))
      )}
    </div>
  );
}
