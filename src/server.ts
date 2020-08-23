import express from 'express';
import routes from './routes/routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// rota é cada endereço da aplicação
// recurso vem logo apos a "/"
// metodos Get, Post, Delete, Put(Update)


// Corpo (Request Body), dados para criação ou alteração de registro
// Route Params: Indentificar qual recurso quer alterar ex: users/:id
// Query Params: Paginação, ordenação filtos


app.use(routes);


app.listen(3333);



