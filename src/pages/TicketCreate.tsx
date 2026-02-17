// 1. Adicione este estado dentro do componente TicketCreate
const [uploading, setUploading] = useState(false);
const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

// 2. Adicione esta função para lidar com o arquivo
async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
  try {
    setUploading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Faz o upload para o bucket 'attachments'
    const { error: uploadError, data } = await supabase.storage
      .from('attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Pega a URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath);

    setAttachmentUrl(publicUrl);
    alert('Imagem carregada com sucesso!');
  } catch (error: any) {
    alert('Erro no upload: ' + error.message);
  } finally {
    setUploading(false);
  }
}

// 3. No seu JSX (HTML), localize a área de "Anexar Imagens" e substitua por:
<div className="md:col-span-2 space-y-2 text-left">
  <label className="text-xs font-bold text-zinc-500 uppercase">Anexar Imagens</label>
  <div className="relative border-2 border-dashed border-zinc-800 rounded-2xl p-8 hover:border-blue-500/50 transition-colors text-center">
    <input 
      type="file" 
      accept="image/*"
      onChange={handleFileUpload}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      disabled={uploading}
    />
    <div className="flex flex-col items-center gap-2">
      <Upload className={`w-8 h-8 ${uploading ? 'animate-bounce text-blue-500' : 'text-zinc-500'}`} />
      <p className="text-sm text-zinc-400">
        {uploading ? 'Enviando arquivo...' : attachmentUrl ? '✅ Imagem anexada!' : 'Clique para fazer upload ou arraste arquivos'}
      </p>
      <p className="text-[10px] text-zinc-600 font-medium">PNG, JPG ou PDF até 10MB</p>
    </div>
  </div>
</div>
