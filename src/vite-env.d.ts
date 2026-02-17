3. Ajuste o src/App.tsx
O TypeScript está reclamando que você está chamando componentes (como Sidebar e Header) sem passar as informações obrigatórias para eles (como o profile ou role).

Substitua o conteúdo do seu src/App.tsx por esta versão "ajustada" para passar no build:
