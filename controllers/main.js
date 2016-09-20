"use strict";
const fortuneLib = require('../lib/fortune.js'),
      Post = require('../models/Post'),
	  User = require('../models/User'),
      postProxy = require('../db_proxy/post'),
      userProxy = require('../db_proxy/user');

module.exports = {

         home(req,res){
            //console.log(mailService.sendToGroup(['frank25184@icloud.com','ddd@dd.com','djfd@sdf.com'],'subject','this is body'));
            
            //判断是否是第一页，并把请求的页数转换成 number 类型
                const page = req.query.p ? parseInt(req.query.p,10) : 1;
                let loginedUser;

                //查询并返回第 page 页的 10 篇文章
                postProxy.getTen(null, page, (err, posts, count)=> {
                    if (err) {
                    console.log('some error with getting the 10 posts:'+ err);
                    //next(err);
                    posts = [];
                    } 
                    // if(req.user){
                    //     loginedUser = req.user.processUser(req.user);
                    // }
                    //userProxy.getUserById(user_id, theuser=>{
                    console.log(posts);
                    
                    res.render('home/home', {
                            title: 'home page',
                            user: req.user ? req.user.processUser(req.user) : req.user,
                            //postUser: req.user ? (req.user._id == user_id ? loginedUser : theuser) : theuser,
                            posts: posts,
                            page: page,
                            isFirstPage: (page - 1) == 0,
                            isLastPage: ((page - 1) * 10 + posts.length) == count,
                            messages: {
                                error: req.flash('error'),
                                success: req.flash('success'),
                                info: req.flash('info'),
                            }, // get the user out of session and pass to template
                    }); 


                });	 
                

        },

        about(req,res){
                    res.render('home/about',{

                        pageTestScript: '/js/page-test/tests-about.js',//know which test file to be used in this route
                        messages: {
                            error: req.flash('error'),
                            success: req.flash('success'),
                            info: req.flash('info'),
                        },		        
                        user: req.user ? req.user.processUser(req.user) : req.user,
                    });
        },





};

