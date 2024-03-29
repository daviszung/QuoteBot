import express from "express";

import { apiRouter } from './api.js'

const app = express();
const PORT = 3000;

app.use(express.json())

app.use('/api', apiRouter);

app.use((req, res) => res.status(404).send('Error 404'));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});