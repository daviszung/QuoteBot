import express from 'express';
import { controller } from './controllers.js';

export const apiRouter = express.Router();


apiRouter.post('/add', controller.add, (req, res) => {
  res.status(200).send()
})

apiRouter.post('/remove', controller.remove, (req, res) => {
  res.status(200).send(res.locals.didRemove)
})

apiRouter.post('/random', controller.random, (req, res) => {
  res.status(200).send(res.locals.randomQuote)
})

apiRouter.post('/list', controller.list, (req, res) => {
  res.status(200).send(res.locals.list)
})