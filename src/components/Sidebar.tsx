// Substitua o item de estilo da NavLink para usar o verde da MPC
className={({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
    isActive 
      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
      : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
  }`
}
