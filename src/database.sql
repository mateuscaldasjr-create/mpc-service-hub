
-- ... (mantenha o SQL anterior)

-- COMANDO ADICIONAL PARA STORAGE
-- Certifique-se de criar o bucket 'attachments' no painel do Supabase Storage
-- e aplicar as políticas abaixo:

-- 1. Permitir que usuários autenticados façam upload
CREATE POLICY "Permitir upload para autenticados" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'attachments');

-- 2. Permitir que usuários vejam seus próprios anexos (ou staff veja todos)
CREATE POLICY "Permitir visualização de anexos" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'attachments');
