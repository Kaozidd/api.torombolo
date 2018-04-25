const Router = require('express').Router
const Quote = require('../models/Quote')

const apiRouter = Router()

const request = require('superagent')

function getQuotes(req, res) {
  Quote
    .query()
    .then(function(data) {
      res.json(data)
    })
}

function getOneQuote(req, res) {
  const quoteId = parseInt(req.params.quoteId)

  Quote
    .query()
    .findById(quoteId)
    .then(function(quote) {
      res.json(quote).status(200)
    })
    .catch(function(e) {
      res.json({
        error: e
      }).status(500)
    })
}

function createNewQuote(req, res) {

  Quote
    .query()
    .insert(req.body)
    .then(function(newQuote) {
      res.json(newQuote).status(200)
    })
    .catch(function(e) {
      res.json({
        error: e
      }).status(500)
    })
}

function updateQuote(req, res) {
  const quoteId = parseInt(req.params.quoteId)
  const newData = req.body

  Quote
    .query()
    .updateAndFetchById(quoteId, newData)
    .then(function(quoteUpdated) {
      res.json(quoteUpdated).status(200)
    })
    .catch(function(e) {
      res.json({
        error: e
      }).status(500)
    })
}

function deleteQuote(req, res) {
  const quoteId = parseInt(req.params.quoteId)

  Quote
    .query()
    .deleteById(quoteId)
    .then(function(rowsDeleted) {
      res.json({
        quotesDeleted: rowsDeleted
      }).status(200)
    })
    .catch(function(e) {
      res.json({
        error: e
      }).status(500)
    })
}

function getDegrees(req, res) {
  const query = req.query.q
  const queryFormatted = query.split(' ').join('+')

  request
    .get(`http://search.sep.gob.mx/solr/cedulasCore/select?fl=%2A%2Cscore&q=${queryFormatted}&start=0&rows=100&facet=true&indent=on&wt=json`)
    .then(function(data) {
      res.json({
        content: data.body.response
      }).status(200)
    })
    .catch((e) => res.json({ error: e }))
}

apiRouter
  .get('/cedulas', getDegrees)

apiRouter
  .get('/quotes', getQuotes)
  .get('/quotes/:quoteId', getOneQuote)
  .post('/quotes', createNewQuote)
  .put('/quotes/:quoteId', updateQuote)
  .delete('/quotes/:quoteId', deleteQuote)

module.exports = apiRouter
