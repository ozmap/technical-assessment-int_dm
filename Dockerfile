# Use uma imagem base do Node.js
FROM node:20

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install

# Copie todo o código fonte para o diretório de trabalho
COPY . .

# Exponha a porta em que sua aplicação será executada
EXPOSE 3003

# Comando para iniciar sua aplicação quando o contêiner for iniciado
CMD ["npm", "run", "dev"]
