const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
 
//redirection vers page add
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

//redirection vers page edit +get article
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

//getOneArticleById
/*router.get('/:id', async (req, res) => {
  const article = await Article.findOne({ id: req.params.id })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})*/

//add Article
router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

// edit article
router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

// delete article
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

//save
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    try {
      article = await article.save()
      res.redirect(`/`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router