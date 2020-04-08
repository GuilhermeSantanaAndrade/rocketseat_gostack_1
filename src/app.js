const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * GET /repositories: Rota que lista todos os repositórios;
 */
app.get("/repositories", (req, res) => {
  res.status(200).json(repositories);
});

/**
 * POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o
 * link para o github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um
 * objeto no seguinte formato: { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...',
 * techs: ["Node.js", "..."], likes: 0 }; Certifique-se que o ID seja um UUID, e de sempre iniciar os
 * likes como 0.
 */
app.post("/repositories", (req, res) => {
  let { title, url, techs } = req.body;
  let guid = uuid();

  const repo = {
    id: guid,
    title: title,
    url: url,
    techs: techs,
    likes: 0,
  };
  repositories.push(repo);
  res.status(200).json(repo);
});

/**
 * PUT /repositories/:id: A rota deve alterar apenas o título, a url e as techs do repositório que
 * possua o id igual ao id presente nos parâmetros da rota;
 */
app.put("/repositories/:id", (req, res) => {
  let { title, url, techs, likes } = req.body || {};
  let { id } = req.params || {};

  if (!id) {
    res.status(400).json({ message: "O 'id' não é um uuid válido" });
    return;
  }

  if (likes) {
    res.status(400).json({ likes: 0 });
  }

  const idx = repositories.findIndex((item) => item.id === id);

  if (idx <= -1) {
    res.status(400).json({ message: "O 'id' não é foi encontrado" });
    return;
  }

  const repo = repositories[idx];
  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  repositories[idx] = repo;
  res.status(200).json(repo);
});

/**
 * DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
 */
app.delete("/repositories/:id", (req, res) => {
  let { id } = req.params;

  if (!isUuid) {
    res.status(401).json({ message: "O 'id' não é um uuid válido" });
    return;
  }

  const idx = repositories.findIndex((item) => item.id === id);

  if (idx <= -1) {
    res.status(400).json({ message: "O 'id' não é foi encontrado" });
    return;
  }

  repositories.splice(idx, 1);
  res.status(204).json();
});

/**
 * POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido
 * através do id presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
 */

app.post("/repositories/:id/like", (req, res) => {
  let { id } = req.params;

  if (!isUuid) {
    res.status(401).json({ message: "O 'id' não é um uuid válido" });
    return;
  }

  const idx = repositories.findIndex((item) => item.id === id);

  if (idx <= -1) {
    res.status(400).json({ message: "O 'id' não é foi encontrado" });
    return;
  }

  const repo = repositories[idx];
  repo.likes += 1;

  repositories[idx] = repo;
  res.status(200).json({ likes: repo.likes });
});

module.exports = app;
