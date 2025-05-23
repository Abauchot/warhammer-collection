import './App.css'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="h-screen w-screen bg-stone-900 text-stone-300 flex flex-col justify-between p-4 selection:bg-amber-500 selection:text-stone-900">
      {/* Thematic Welcome Banner */}
      <header className="mt-8 p-6 bg-stone-800 border-2 border-amber-600 rounded-lg shadow-xl text-center w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 mb-3">
          Warhammer Collection Manager
        </h1>
        <p className="text-stone-400 text-sm sm:text-base">
          Forge your armies, catalogue your miniatures, and lead them to glory.
        </p>
      </header>

      {/* Navigation Buttons */}
      <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
        <Link to="/login" className="w-full sm:w-auto flex-grow">
          <button className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 font-semibold py-3 px-6 border border-slate-500 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
            Enter the Armoury (Login)
          </button>
        </Link>
        <Link to="/register" className="w-full sm:w-auto flex-grow">
          <button className="w-full bg-red-800 hover:bg-red-700 text-red-100 font-semibold py-3 px-6 border border-red-600 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
            Enlist New Recruit (Register)
          </button>
        </Link>
        <Link to="/ajouter-figurine" className="w-full sm:w-auto flex-grow">
          <button className="w-full bg-amber-600 hover:bg-amber-500 text-amber-100 font-semibold py-3 px-6 border border-amber-500 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
            Ajouter une figurine
          </button>
        </Link>
        <Link to="/ajouter-faction" className="w-full sm:w-auto flex-grow">
          <button className="w-full bg-amber-600 hover:bg-amber-500 text-amber-100 font-semibold py-3 px-6 border border-amber-500 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
            Ajouter une faction
          </button>
        </Link>
        <Link to="/ajouter-armee" className="w-full sm:w-auto flex-grow">
          <button className="w-full bg-green-600 hover:bg-green-500 text-green-100 font-semibold py-3 px-6 border border-green-500 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
            Ajouter une armée
          </button>
        </Link>

        <Link to="/mes-figurines" className="w-full sm:w-auto flex-grow">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-blue-100 font-semibold py-3 px-6 border border-blue-500 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Mes figurines
          </button>
        </Link>
      </nav>

      <footer className="mb-8 text-center">
        <p className="text-xs text-stone-500">
          For the Emperor! Or, you know, for Chaos. Your choice.
        </p>
      </footer>
    </div>
  )
}

export default App
