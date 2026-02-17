// Adicione este useEffect para carregar contratos do cliente
const [contracts, setContracts] = useState<any[]>([]);

useEffect(() => {
  if (formData.client_id) {
    async function loadContracts() {
      const { data } = await supabase
        .from('contracts')
        .select('id, name')
        .eq('client_id', formData.client_id)
        .eq('status', 'active');
      if (data) setContracts(data);
    }
    loadContracts();
  }
}, [formData.client_id]);

// No seu JSX, adicione este campo ao lado de "Equipamento"
<div className="space-y-2 text-left">
  <label className="text-xs font-bold text-zinc-500 uppercase">Contrato Vinculado</label>
  <select 
    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-blue-500 disabled:opacity-50"
    disabled={!formData.client_id}
    value={formData.contract_id}
    onChange={(e) => setFormData({...formData, contract_id: e.target.value})}
  >
    <option value="">Selecione o Contrato</option>
    {contracts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
  </select>
</div>
