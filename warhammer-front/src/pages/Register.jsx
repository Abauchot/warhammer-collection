import { useState } from 'react'
import { register } from '../api/auth'
import { Link } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await register({ username, email, password })
      localStorage.setItem('token', data.jwt)
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess(true)
      // rediriger vers dashboard ou login
    } catch (err) {
      setError("Erreur lors de l'inscription")
    }
  }

  return (
    <div className="h-screen w-full bg-stone-900 text-stone-300 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-stone-800 border-2 border-red-800 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-4 text-red-400 text-center">Enlist New Recruit</h2>
        
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
        
        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded text-green-200">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Recruitment successful! Welcome to the ranks.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Battle Name (Username)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type="email"
              placeholder="Communication Channel (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="relative">
            <input
              type="password"
              placeholder="Security Clearance (Password)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-700 text-stone-200 border border-stone-600 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-red-800 hover:bg-red-700 text-red-100 font-semibold py-3 px-6 border border-red-600 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 mt-2"
          >
            Complete Enlistment
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-stone-400">Already a veteran?</p>
          <Link to="/login" className="mt-2 inline-block text-red-500 hover:text-red-400">
            Return to the Armoury
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
