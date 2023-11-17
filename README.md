# OZmap Challenge: Construindo a Geolocalização do Futuro

# Projeto Node.js com Typescript
Especificações Técnicas
Node.js: Versão 20 ou superior.
Banco de Dados: MongoDB 7+.
ORM: Mongoose / Typegoose.
Linguagem: Typescript.
Formatação e Linting: Eslint + Prettier.
Comunicação com MongoDB: Deve ser feita via container.


CRUD de Usuários
Cada usuário deve ter nome, email, endereço e coordenadas.
O usuário pode fornecer endereço ou coordenadas durante a criação.
Erro se fornecer ambos ou nenhum.
Atualização:

Atualização de endereço ou coordenadas deve seguir a mesma lógica.
CRUD de Regiões
Criação:

Cada região tem um nome, coordenadas e um usuário que será o dono da região.
Listagem:

Listar regiões contendo um ponto específico.
Filtragem por Distância:

Listar regiões a uma certa distância de um ponto.
Opção de filtrar regiões não pertencentes ao usuário que fez a requisição.
