const { request, response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// Criar a conta
/*
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
app.post('/account', (request, response) => {
  const { cpf, name } = request.body;

  const cpfExisted = customers.some(customer => customer.cpf === cpf);

  if (cpfExisted) {
    return response.status(400).json({ error: 'Cpf já utilizado' });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });
  return response.status(201).send();
});

app.get('/statement', (request, response) => {
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);
  if (!customer) {
    return response.status(400).json({ error: 'Conta não existente' });
  }

  return response.json(customer.statement);
});

app.listen(3333);
