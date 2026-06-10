====================================================
  COMO USAR SEU PORTFÓLIO
====================================================

ESTRUTURA DE ARQUIVOS:
  index.html       → Página principal com galeria
  sobre.html       → Página sobre você
  contato.html     → Página de contato e redes sociais
  style.css        → Estilo visual (cores, fontes, layout)
  gallery.js       → Lógica da galeria e lista de imagens
  images/          → COLOQUE SUAS IMAGENS AQUI (crie a pasta)
  README.txt       → Este arquivo


----------------------------------------------------
  1. ADICIONAR IMAGENS NA GALERIA
----------------------------------------------------

a) Copie seus arquivos de imagem para a pasta "images/"
   Formatos aceitos: .jpg .jpeg .png .gif .webp

b) Abra o arquivo "gallery.js" em qualquer editor de texto
   (Bloco de Notas, VSCode, Notepad++ etc.)

c) Encontre a seção "const IMAGES = [" e adicione suas obras:

   const IMAGES = [
     {
       file: "images/minhaobra.jpg",   // nome do arquivo
       title: "Título da Obra",         // nome que aparece no hover
       category: "character",           // veja categorias abaixo
     },
     {
       file: "images/ilustracao2.png",
       title: "Segunda Obra",
       category: "ilustracao",
     },
   ];

CATEGORIAS DISPONÍVEIS:
   character   → Character Design
   ilustracao  → Ilustração
   fanart      → Fan Art

d) Salve o arquivo e abra index.html no navegador.
   As imagens vão aparecer automaticamente na galeria!


----------------------------------------------------
  2. PERSONALIZAR SEU NOME E REDES SOCIAIS
----------------------------------------------------

Abra cada arquivo HTML (index.html, sobre.html, contato.html)
e substitua os seguintes textos:

  "Seu Nome"         → Seu nome artístico
  "SEU_USUARIO"      → Seu @ em cada rede social
  "seuemail@email.com" → Seu e-mail de contato

Também edite a bio na página sobre.html.


----------------------------------------------------
  3. ADICIONAR SUA FOTO (página Sobre)
----------------------------------------------------

a) Coloque sua foto em: images/foto-perfil.jpg
b) Abra sobre.html no editor de texto
c) Procure pela linha com:
     <div class="sobre-img-placeholder">
   e logo abaixo encontre o bloco comentado:
     <!-- Descomente quando tiver a foto:
     <img src="images/foto-perfil.jpg" ...>
     -->
d) Remova os comentários (<!-- e -->) para ativar a imagem
e) Apague o bloco <div class="sobre-img-placeholder">...</div>


----------------------------------------------------
  4. MUDAR CORES DO SITE
----------------------------------------------------

Abra style.css e encontre a seção ":root {" no topo.
As principais cores estão lá:

  --accent:  #c9a96e   → cor dourada dos destaques
  --bg:      #0d0d0f   → fundo escuro principal
  --text:    #e8e4dc   → cor do texto principal

Troque os códigos de cor para personalizar.


----------------------------------------------------
  5. HOSPEDAR O SITE ONLINE (grátis)
----------------------------------------------------

Opção A — GitHub Pages (recomendado):
  1. Crie uma conta em github.com
  2. Crie um repositório com o nome: seunome.github.io
  3. Faça upload de todos os arquivos
  4. Seu site estará em: https://seunome.github.io

Opção B — Netlify:
  1. Acesse netlify.com e crie uma conta
  2. Arraste a pasta inteira do portfólio para o site
  3. Seu site fica online instantaneamente com um link

====================================================
