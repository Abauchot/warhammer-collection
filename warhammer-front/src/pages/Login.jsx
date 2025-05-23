import { useState } from 'react'
import axios from '../api/axios.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()    // <— hook pour la redirection

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/local', { identifier, password })
      const { jwt, user } = res.data
      localStorage.setItem('token', jwt)
      localStorage.setItem('user', JSON.stringify(user))
      console.log('✅ connecté en tant que', user)  // debug
      navigate('/', { replace: true })              // <— redirection vers la home
    } catch (err) {
      setError('Identifiants invalides')
    }
  }

  return (
    <div className="h-screen w-full bg-stone-900 text-stone-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-stone-800 border-2 border-amber-600 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-4 text-amber-400 text-center">Enter the Armoury</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Identifier (Email or Username)"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type="password"
              placeholder="Your Secret Code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-6 border border-slate-500 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 mt-2"
          >
            Access Armoury
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-stone-400">New to the battlefield?</p>
          <Link to="/register" className="mt-2 inline-block text-amber-500 hover:text-amber-400">
            Enlist as a New Recruit
          </Link>
        </div>
      </div>
      
      <footer className="mt-8 text-center">
        <p className="text-xs text-stone-500">
          For the Emperor! Or, you know, for Chaos. Your choice.
        </p>
      </footer>
    </div>
  )
}
