# 🛒 Desafio OZmap

# 🎯Objetivo:

Desenvolver uma API RESTful robusta voltada para gerenciamento de usuários e localizações.

# 🖥️Tecnologias utilizadas:

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/mongooose-%234ea94b.svg?style=for-the-badge&logo=mongoose&logoColor=white)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/chai-974942?style=for-the-badge&logo=chai&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)

## 📋 Pré-requisitos:

- Docker versão 20.0.6
- Docker compose versão v2.23.0

# 🛠️ Como Utilizar:

1. Clone o repositório para sua máquina utilizando o comando:

   `git clone git@github.com:leonardocbrand/ozmap-challenge.git`

2. Troque para a branch **leonardo-brandao** utilizando o comando:

   `git checkout leonardo-brandao`

3. Entre na pasta do repositório e instale as dependências utilizando o comando:

   `npm install`

4. Crie um arquivo **.env** contendo as mesmas variáveis de ambiente presentes no arquivo **.env.example**, ou use os dados do exemplo abaixo:
<pre>
<code>DB_PORT=27017
API_PORT=3001 
MONGODB_URI=mongodb://db:27017/oz-tech-test?authSource=admin
GOOGLE_GEOCODING_REVERSE_URL=https://maps.googleapis.com/maps/api/geocode/json?latlng=
GOOGLE_GEOCODING_URL=https://maps.googleapis.com/maps/api/geocode/json?address=
GOOGLE_API_KEY=AIzaSyCOzyNvyVumnu8GmujVFfqr4WX2IUMdWVQ
</code></pre>

5. Abra um terminal na **raiz do repositório** e execute o comando <code>docker-compose up</code>;

6. Aguarde todos os contêineres ficarem de pé;

7. Para a visualização dos logs das requisições da API execute o comando:

<code>docker logs -f ozimap-api</code>

## 📷 Preview:

#### Documentação 1 (Swagger)

![alt text](./preview/swagger.png)

#### Documentação 2 (Swagger)

![alt text](./preview/swagger2.png)

#### Documentação 3 (Swagger)

![alt text](./preview/swagger3.png)

#### Cobertura de testes

![alt text](./preview/coverage.png)

## 💻 Aplicação:

# Usuários

- Implementar um CRUD completo para usuários.
- Garantir que cada usuário contenha informações essenciais, como nome, email, endereço e coordenadas.
- Na criação de um usuário, permitir que o mesmo forneça um endereço ou coordenadas, apresentando um erro caso ambos ou nenhum sejam fornecidos.
- Utilizar um serviço de geolocalização para resolver endereço ↔ coordenadas, assegurando consistência nas informações.
- Ao atualizar o endereço ou coordenadas de um usuário, seguir a mesma lógica, mantendo a integridade dos dados.

# Regiões

- Implementar um CRUD completo para regiões.
- Cada região deve possuir um nome, coordenadas e um usuário que será designado como proprietário da região.
- Possibilitar a listagem de regiões contendo um ponto específico.
- Permitir a listagem de regiões a uma certa distância de um ponto, oferecendo a opção de filtrar as regiões não pertencentes ao usuário que fez a requisição.

## Postman

Caso prefira realizar as requisições usando o Postman, na raíz do projeto há um arquivo chamado `postmanCollection.json` para importar as collections com todas as requisições.
