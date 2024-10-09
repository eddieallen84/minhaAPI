const express = require('express');
const router = express.Router();
const users = require('../users');
const fs = require('fs');

//ROTAS GET
router.get('/', (req, res) => {
  res.send("REQUISIÇÃO OK");
});

router.get('/users', (req, res) => {
  res.send(users);
});

router.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id == id);
  if (!user) {
    return res.status(404).send("Usuário não encontrado");
  }

  res.status(200).send(user);
});

//ROTAS POST

router.post("/users", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .send("Todos os campos são obrigatórios: nome, email e senha.");
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    nome,
    email,
    senha,
  };

  users.push(newUser);

  const filePath = "../users.js"; 
  
  fs.writeFile(
    filePath,
    `let users = ${JSON.stringify(users, null, 2)};\n\nmodule.exports = users;`,
    (err) => {
      if (err) {
        return res.status(500).send("Erro ao salvar o usuário.");
      }
      res.status(201).send(`Usuário ${nome} adicionado com sucesso!`);
    }
  );
});


module.exports = router;
