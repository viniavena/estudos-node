const { request, response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

//Middleware
function verifyExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);
  if (!customer) {
    return response.status(400).json({ error: 'Conta não existente' });
  }
  request.customer = customer;

  return next();
}

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

  const id = uuidv4();
  customers.push({
    cpf,
    name,
    id: id,
    statement: [],
  });
  return response.status(201).json({
    message: 'Conta criada com sucesso',
    name: name,
    cpf: cpf,
    id: id,
  });
});

app.get('/statement', verifyExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

app.post('/deposit', verifyExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_date: new Date(),
    type: 'credit',
  };

  customer.statement.push(statementOperation);

  return response.status(201).send(customer.statement);
});

app.listen(3333);
