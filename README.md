<h1 align="center">🔭 Node.js API - TypeORM usage example</h1>

[![CI for Node.js Backend](https://github.com/leogiraldimg/nodejs-typeorm-example/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/leogiraldimg/nodejs-typeorm-example/actions/workflows/ci.yaml)

<p align="center">Projeto de exemplo para implementação de persistência de dados em uma API Node.js utilizando o ORM TypeORM.</p>

<p align="center">
    <a href="#funcionalidades">Funcionalidades</a> •
    <a href="#pre-requisitos">Pré-requisitos</a> •
    <a href="#subindo-aplicacao">Subindo a aplicação</a> •
    <a href="#tecnologias-utilizadas">Tecnologias utilizadas</a>
</p>

<h3 id="funcionalidades">Funcionalidades</h3>

-   [x] Cadastro de tarefas
-   [x] Alteração de tarefas
-   [x] Consulta de tarefas
-   [x] Deleção de tarefas

<h3 id="pre-requisitos">Pré-requisitos</h3>

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en), [Docker](https://www.docker.com/) e [Docker compose](https://docs.docker.com/compose/)

<h3 id="subindo-aplicacao">Subindo a aplicação</h3>

```bash
# Clone este repositório
$ git clone https://github.com/leogiraldimg/nodejs-typeorm-example.git

# Acesse o diretório do projeto clonado
$ cd nodejs-typeorm-example

# Suba o container do banco de dados
$ docker compose up -d

# Execute as migrações do banco de dados
$ npm run migration:dev

# Suba a aplicação
$ npm start
```

<h3 id="tecnologias-utilizadas">Tecnologias utilizadas</h3>

As seguintes ferramentas foram usadas na construção do projeto:

-   [Node.js](https://nodejs.org/en)
-   [Docker](https://www.docker.com/)
-   [TypeORM](https://typeorm.io/)
