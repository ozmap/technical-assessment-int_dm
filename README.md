# technical-assessment-int_dm

# Desafio Técnico - Feito por Marcelo Abbadia

## 🚀 Tecnologias Utilizadas

- Node.js: Versão Latest.
- Banco de Dados: MongoDB versão Latest.
- ORM: Mongoose / Typegoose.
- Linguagem: Typescript.
- Formatação e Linting: Eslint + Prettier.
- Comunicação com MongoDB: Docker Compose.

## 🔍 Funcionalidades Criadas

### Usuários

- Criado o CRUD completo para usuários;
- O usuário tem nome, email, endereço e coordenadas;
- Ao criar o usuário ele pode fornecer endereço ou coordenadas. Haverá erro caso forneça ambos ou nenhum;
- Estou usando o serviço de geolocalização da lib node-geocoder com o provider da Google para resolver as conversões de endereços ↔ coordenadas;
- Para a criação e/ou atualização de usuários, foi implementado um middleware para converter endereço em coordenadas e vice-versa.

### Regiões

- Criado o CRUD completo para regiões.
- Cada região tem um nome, coordenadas e um usuário que será o dono da região (owner).
- Além de ser possível listar todas as regiões criadas, pesquisar por ID, foi implementando dois tipos de listagens:
    - As regiões tendo um ponto específico;
    - As regiões a uma certa distância de um ponto, com opção de filtrar regiões não pertencentes ao usuário que fez a requisição.

## 🛡️ Observações

- Proteção contra exclusão de usuário sem ter resolvido a situação da sua região antes: Seja excluíndo a sua região ou transferido para outro proprietário;
- Restrição na criação de região sem usuário proprietário (owner).

## 📝 Swagger

O Swagger foi utilizado para documentação da API, na versão 3.0.0. Consulte-o através do  `/api-docs` para detalhes.


## 🚀 Iniciando o Projeto

1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. docker-compose up -d
4. npm run dev
  
## 📃 Testes

Foram realizados testes manuais com as rotas e endpoints criados em formato de vídeos curtos e catalogados.
Demais tipos de testes automatizados não foram realizados por falta de conhecimento "NO MOMENTO".

https://drive.google.com/drive/folders/1iZL2R1ATY1SGRO96xhOBxbe8rK0sUgq8?usp=drive_link


## :tada: Agradecimentos

Quero expressar minha profunda gratidão pela oportunidade de participar deste desafio técnico.
Independentemente do resultado, estou genuinamente agradecido por ter enfrentado esse desafio que não apenas testou minhas habilidades, mas também me permitiu crescer profissionalmente. Agradeço sinceramente, estou ansioso para continuar aprendendo e contribuindo da melhor forma possível. Obrigado! 🚀✨
