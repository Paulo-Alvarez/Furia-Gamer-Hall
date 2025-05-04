# 🎮 Gamer Hall - FURIA

# Introdução

**Gamer Hall - FURIA** é uma aplicação interativa desenvolvida para os fãs da equipe de e-sports **FURIA**. A plataforma permite validar documentos, escanear perfis do X (Twitter) e fornecer links úteis relacionados ao perfil do usuário no mundo dos e-sports.
O objetivo principal é se utilizar da estratégia **Know Your Fan** para conhecer mais do fã da **FURIA** e aproximá-lo da marca.

![image](https://github.com/user-attachments/assets/cea40cdf-a956-48aa-b1ea-2d0778ca4eb8)


A tela inicial do Gamer Hall - FURIA foi projetada para oferecer uma experiência imersiva e intuitiva aos fãs de e-sports, com foco na estética gamer e na identidade visual da FURIA.
A interface é limpa, moderna e funcional, destacando elementos importantes para a interação do usuário e a conclusão do formulário.

O layout é centrado e organizado, com margens amplas para garantir que os elementos principais se destaquem.


# Como Utilizar

O usuário poderá interagir com o **Gamer Hall** ao concluir o seu formulário, provendo assim meios para que a **FURIA** entenda mais do seu fã. 
O número de requisições foi pensado para conter apenas o necessário, para não afastar o público.



Após concluir o envio, o usuário será levando para uma tela de Scanner, onde seus dados estarão sendo processados e verificados pelo código do Gamer Hall.
Nessa etapa é quando se verifica o documento do usuário, para ver se bate com o nome completo informado.

É aí também onde a conta do X informada é analisada para determinar se o usuário é um gamer mais assíduo ou se é alguém que está ainda dando os primeiros passos no universo gamer.

![image](https://github.com/user-attachments/assets/9ed0b565-9518-4ae7-b9fd-c56168c1cc87)

Após os dados serem processados, se tudo estiver nos conformes com a verificação do documento, o usuário é direcionado a uma tela de resultado que terá umm resultado diferente a depender do *nível gamer* que o usuário apresentar.

Essas funcionalidades foram implementadas para gerar identificação e proximidade com o público, buscando aproximar ainda mais o usuário da marca.

![image](https://github.com/user-attachments/assets/34ab93df-91b8-4b93-83ac-015f4168d645)
*Resultado para perfis gamers*

![image](https://github.com/user-attachments/assets/fa7e931f-90cd-4f3d-bfa0-1db733d9aa22)
*Resultado para perfis não-gamers*

![image](https://github.com/user-attachments/assets/fc6594fc-a193-4fee-91b5-cc2ee1fdaece)
*Resultado caso o nome não bata com o documento (retorna para o formulário)*


# Como Funciona

O backend do Gamer Hall foi desenvolvido em **Node.js**, utilizando o **framework Express** para gerenciar rotas, lidar com requisições HTTP e servir arquivos estáticos da aplicação.

O sistema tem como objetivo principal validar usuários através do envio de um documento com nome legível e de um link do perfil do Twitter. A verificação busca identificar se o nome no documento corresponde ao nome informado e se o perfil está relacionado ao universo dos e-sports.

A lógica central consiste em:

**Upload e OCR (Reconhecimento Óptico de Caracteres):**
Quando um usuário envia um arquivo de imagem com um documento, o servidor utiliza o **Tesseract.js** para extrair o texto contido na imagem. Em seguida, compara-se esse texto com o nome informado, utilizando a biblioteca string-similarity para avaliar o grau de correspondência, mesmo que haja pequenas variações na escrita.

**Verificação do X/Twitter com Puppeteer:**
A URL do X enviada é validada e acessada por meio do **Puppeteer**, que simula um navegador para capturar a bio do perfil. Essa bio é então analisada com base em uma vasta lista de palavras-chave associadas ao mundo dos games e e-sports, para verificar se o usuário realmente está inserido nesse universo.

**Armazenamento local:**
Todos os registros, contendo nome, link do Twitter, bio capturada, resultado da verificação e data de envio, são armazenados em um arquivo **dados.json**. O sistema verifica se o nome já existe no banco antes de inserir ou atualizar os dados.

**Rota principal (/upload):**
A principal interação acontece por meio de um endpoint **POST** que recebe os dados do formulário (nome, Twitter e documento). O backend responde com uma mensagem de sucesso ou erro, conforme o resultado da validação dos dados recebidos.

Esse conjunto de funcionalidades permite que o Gamer Hall identifique de forma semi-automática se o usuário é um gamer real envolvido com a comunidade de e-sports.

# Tecnologias Utilizadas

O desenvolvimento do Gamer Hall envolveu tecnologias robustas e integradas, com foco em automação, validação inteligente e hospedagem escalável:

**HTML, CSS e JavaScript:** Responsáveis por estruturar e dar interatividade à interface do usuário.

**Node.js:** Utilizado no backend para processar uploads, analisar documentos com OCR e buscar informações em tempo real de perfis no Twitter.

**Express:** Framework minimalista do Node.js, essencial para organizar rotas, lidar com requisições HTTP e servir o frontend de forma eficiente.

**Multer:** Middleware utilizado para lidar com upload de arquivos, permitindo o envio de imagens/documentos para validação.

**Tesseract.js:** Biblioteca de OCR que extrai texto de documentos enviados, facilitando a validação de nomes automaticamente.

**Puppeteer:** Ferramenta poderosa para automação de navegação em páginas web, usada para buscar informações públicas em perfis do X.

**string-similarity:** Utilizada para comparar o nome informado pelo usuário com o texto extraído do documento, validando a identidade com base em similaridade textual.

**Docker:** O projeto foi containerizado com Docker para garantir compatibilidade e facilitar a implantação.

**Render:** Plataforma de hospedagem escolhida para publicar o backend com facilidade, permitindo escalabilidade e integração com containers Docker.


# Considerações Finais

Ao se apoiar na estratégia **Know Your Fan**, o Gamer Hall oferece interações mais personalizadas e relevantes, reforçando o vínculo entre a marca e sua comunidade. 

A combinação de **tecnologia acessível, interação voltada à cultura gamer e conhecimento profundo do público** cria uma experiência mais imersiva, divertida e conectada com a **FURIA**.
