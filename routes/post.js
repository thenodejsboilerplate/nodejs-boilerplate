"use strict";
const express = require('express'),
      router = express.Router(),
      auth = require('../middlewares/auth'),
      post = require('../controllers/post');

router.get('/make', auth.isLoggedIn, post.makeArticle);
router.post('/post', auth.isLoggedIn, post.postArticle);
router.get('/search', post.getSearch);
// router.get('/modify/:post_id', post.getModify);
// router.post('/modify/:post_id', post.postModify);
// router.post('/delete/:post_id', post.delete);
router.get('/:user_id',post.getPersonalPosts);
router.get('/show/:title', post.showPost);
router.get('/edit/:post_id', auth.isLoggedIn, post.getPostEdit);
router.post('/edit/:post_id', auth.isLoggedIn, post.editPost);
router.get('/delete/:post_id', auth.isLoggedIn, post.deletePost);
router.post('/comment', auth.isLoggedIn,post.comment );
router.get('/tag/:tag_id', post.getTagsPost);
module.exports = router;
