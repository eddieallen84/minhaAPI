const express = require("express");
const router = express.Router();
const users = require("../users");
const fs = require("fs");

//ROTAS GET
router.get("/", (req, res) => {
  res.send("REQUISIÇÃO OK");
});

router.get("/users", (req, res) => {
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

//CADASTRAR NOVO USUÁRIO SEM PASSA O ID

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

  const filePath = "./users.js";

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

// ROTA POST - Cadastrar usuário com o ID especificado e inseri-lo na posição correta
router.post("/users/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  const userId = parseInt(id); // Convertendo o id para número

  // Verifica se o ID já está em uso
  const userExists = users.find((user) => user.id == userId);
  if (userExists) {
    return res.status(400).send("ID já está em uso, escolha outro.");
  }

  // Verifica se os campos obrigatórios foram fornecidos
  if (!nome || !email || !senha) {
    return res
      .status(400)
      .send("Todos os campos são obrigatórios: nome, email e senha.");
  }

  // Cria o novo usuário com o ID fornecido na rota
  const newUser = {
    id: userId, // Usa o ID especificado na rota
    nome,
    email,
    senha,
  };

  // Encontrar a posição correta para inserir o usuário e manter a ordem
  let inserted = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id > userId) {
      users.splice(i, 0, newUser); // Insere o novo usuário antes do próximo maior ID
      inserted = true;
      break;
    }
  }

  // Se o novo ID for maior que todos os IDs existentes, adiciona ao final
  if (!inserted) {
    users.push(newUser);
  }

  // Reordena o array de usuários em ordem crescente de IDs
  users.sort((a, b) => a.id - b.id);

  const filePath = "./users.js";

  // Escreve o arquivo com o array de usuários já ordenado
  fs.writeFile(
    filePath,
    `let users = ${JSON.stringify(users, null, 2)};\n\nmodule.exports = users;`,
    (err) => {
      if (err) {
        return res.status(500).send("Erro ao salvar o usuário.");
      }
      res.status(201).send(`Usuário com ID ${userId} adicionado com sucesso!`);
    }
  );
});



// ROTAS PUT - Atualizar um usuário
router.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  const userIndex = users.findIndex((user) => user.id == id);
  if (userIndex === -1) {
    return res.status(404).send("Usuário não encontrado");
  }

  // Atualiza os dados do usuário
  if (nome) users[userIndex].nome = nome;
  if (email) users[userIndex].email = email;
  if (senha) users[userIndex].senha = senha;

  const filePath = "./users.js";

  fs.writeFile(
    filePath,
    `let users = ${JSON.stringify(users, null, 2)};\n\nmodule.exports = users;`,
    (err) => {
      if (err) {
        return res.status(500).send("Erro ao atualizar o usuário.");
      }
      res.status(200).send(`Usuário com ID ${id} atualizado com sucesso!`);
    }
  );
});

//ROTAS DELETE - Excluir um usuário
router.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const userIndex = users.findIndex((user) => user.id == id);
  if (userIndex === -1) {
    return res.status(404).send("Usuário não encontrado");
  }

  users.splice(userIndex, 1); // Remove o usuário do array

  const filePath = "./users.js";

  fs.writeFile(
    filePath,
    `let users = ${JSON.stringify(users, null, 2)};\n\nmodule.exports = users;`,
    (err) => {
      if (err) {
        return res.status(500).send("Erro ao excluir o usuário.");
      }
      res.status(200).send(`Usuário com ID ${id} excluído com sucesso!`);
    }
  );
});

module.exports = router;
