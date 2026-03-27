# Astroblog

Este projeto é um sistema de Publicação de noticiais.
## Tecnologias Utilizadas

### Back-end
- **Node.js**: Plataforma para execução de código JavaScript no servidor.
- **Express**: Framework web para o back-end.
- **MongoDB**: Banco de dados não relacional para armazenar informações persistentes.
- **Bcrypt**: Biblioteca usada para criptografar senhas de forma segura utilizando um hash de senhas.
- **JSON Web Tokens**:  É um padrão para autenticação e compartilhamento de informações. Baseado no formato JSON,

### Front-end
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Vite**: Ferramenta para desenvolvimento front-end, otimizada para performance.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (versão 18 ou superior)
- 

## Configuração do Banco de Dados
Crie um banco de dados MongoDB:
1. Crie um cluster no mongoDB e ultilize o link com a sua senha para conectar.

### 1. Configurar o Back-end

1. Navegue para o diretório do back-end:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` no diretório `backend` e adicione as seguintes variáveis de ambiente:
   ```env
    DATABASE_URL=""
    CLOUD_NAME=""
    API_KEY=""
    API_SECRET="" 
    JWT_SECRET=""   
     ```  
    
## Instruções para Execução

   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

### 2. Configurar o Front-end

1. Navegue para o diretório do front-end:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### 3. Testar a Aplicação

1. Acesse o front-end em seu navegador através de `http://localhost:5173`.
2. O back-end estará disponível em `http://localhost:3000`.


## Estrutura do Projeto

```
AstroBlog/
├── backend/       # Código do back-end
├── frontend/      # Código do front-end
└── README.md      # Documentação do projeto
```

## Contribuidores

- **Responsáveis pelo Front-end**:
  - [Thyago]()
  - [Anna Priscilla]()
    
- **Responsável pelo Back-end**:
  
  - [Maria Dalva](https://github.com/Mariadalva25)
  - 
## Considerações Finais

Se encontrar algum problema ou tiver dúvidas sobre o projeto, entre em contato com os responsáveis ou abra uma issue no repositório do projeto.
