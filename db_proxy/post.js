"use strict";
const User    = require('../models/User'),
      Post = require('../models/Post'),
      Comment = require('../models/Comment'),
      userProxy = require('../db_proxy/user'),
      moment = require('moment');
//var utility = require('utility');                              


module.exports = {
        /**
         * 根据用户名列表查找用户列表
         * Callback:
         * - err, 数据库异常
         * - users, 用户列表
         * @param {Array} names 用户名列表
         * @param {Function} callback 回调函数
         */
        // exports.getPostsByUserId = function (user_id, callback) {
        //   if (user_id.length === 0) {
        //     return callback(null, []);
        //   }
        //   Post.find({ 'user_id': user_id }, callback);
        // };       
        /**
         * 根据用户名列表查找用户列表
         * Callback:
         * - 
         * - users, 用户列表
         * @param {Array} names 用户名列表
         * @param {Function} callback 回调函数
         */
        getPostsByUserId:  function(req,res,user_id,path){
            //const user_created_at = moment(req.user.local.created_at).format('MMMM Do YYYY, h:mm:ss a'),

                //判断是否是第一页，并把请求的页数转换成 number 类型
               const page = req.query.p ? parseInt(req.query.p) : 1,
                     outThis = this;
               let loginedUser;
               if(req.user){
                 loginedUser = req.user.processUser(req.user);
               }

               const p = new Promise(function(resolve,reject){
                    //查询并返回第 page 页的 10 篇文章  tag_id,title,user_id
                    outThis.getTen(user_id, page, (err, posts, count)=> {
                        if (err) {
                            console.log('some error with getting the 10 personal posts:'+ err);
                            //next(err);
                            reject(`some error with getting the 10 personal posts: ${err}`);
                            posts = [];
                        }else{
                            console.log('getPostsByUserId\'s getTen: '+ user_id +posts);
                            resolve(posts,count);                           

                        }
                   },undefined,undefined,'exit_user_id');

               });
               p.then(function(posts,count){
                    userProxy.getUserById(user_id, theuser=>{ 
                                
                            res.render(path, {
                                user: req.user ? req.user.processUser(req.user) : req.user,
                                isMyPosts: req.user ? (req.user._id == user_id ? true : false) : false,
                                postUser: req.user ? (req.user._id == user_id ? loginedUser : theuser) : theuser,
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
               })
               .catch(function(err){
                  console.log(err);
                  req.flash('error','Error finding the user!');
                  res.redirect('back');
               });
            
  
        },


        getPostByTitle:  (req,res,title,path)=>{

            if(!title){
                req.flash('error','title not existing or is null/undefined');
                res.redirect('back');
            }else{

                let loginedUser;
                if(req.user){
                    loginedUser = req.user.processUser(req.user);
                }

                const promis = new Promise(function(resolve,reject){
                    Post.findOne({'title': title}, (err,post)=>{
                            if(err){
                                    console.log('something wrong...');
                                    console.log(`we cannot find post title,error: ${err}`);
                                    reject(`we cannot find post title,error: ${err}`);						
                            }else if(post){
                            
                                
                                //setting view times
                                var conditions = { 'title': title },
                                    update = { $inc: { 'pv': 1 }};//increment
                                Post.findOneAndUpdate(conditions, update, function(err,post){
                                    if(err){
                                        console.log(`there is error when update the pv: ${err}`);
                                        return;
                                    }
                                });

                                resolve(post);

                        }else{
                                req.flash('error',`post is undefined or no post`);
                                res.redirect('back');	         
                        }

                    }); 
            }); 
            promis.then(function(post){
                let newPost = post.processPost(post);
                post.user(post.user_id,theuser=>{
                    post.comments(post._id, function(comments){
                            res.render(path, {
                                    user: req.user ? req.user.processUser(req.user) : req.user,
                                    postUser: req.user ? (req.user._id == post.user_id ? loginedUser : theuser) : theuser,
                                    post: newPost,
                                    comments: comments,
                                    //user_created_at: user_created_at,
                                    messages: {
                                        error: req.flash('error'),
                                        success: req.flash('success'),
                                        info: req.flash('info'),
                                    }, // get the user out of session and pass to template
                            });
                    });

                });
            })
            .catch(function(err){
                console.log(err);
                req.flash('error',`there is an error in find post for ${title}`);
                res.redirect('back');	
            });


        }
            
   },

        /**
         * get 10 posts per page
         * Callback:
         * - err, error
         * - posts, posts per page
         * @param {variable} name 
         * @param {Number} page :fetch from the url ..?p=..
         * @param {Function} callback
         */
        
        getTen:  function(name,page,callback, ...args){

                var query = {};
                if(name){
                    if(args[0]){         
                        query.tag_id = name;
                    }else if(args[1]){
                        query.title = name;
                    }else if(args[2]){
                        query.user_id = name;
                    }
                    console.log('query[name] is'+ Object.keys(query));
                }
                
                const promis = new Promise(function(resolve,reject){
                    //使用 count 返回特定查询的文档数 total    
                    Post.count(query, ( err, count)=>{
                        //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果
                        if (err) {
                                return callback(err);
                        }else{
                                console.log( `Number of posts: ${count} . query is ${query}` );
                                resolve(count);
                        }
                    
                    });  
                });
                promis.then(function(count){
                    Post.find(query).skip((page-1)*10).limit(10).sort({'created_at': -1}).exec((err,posts)=>{
                            if (err) {
                                reject(err);
                                
                            }
                            console.log('Posts inthe getTen function is: '+posts);
                            const modifiedPosts = posts.map(post=>{
                                return post.processPost(post);
                            });

                            console.log('modifiedPosts: '+modifiedPosts);
                            callback(null, modifiedPosts, count);//provide the params(caluated values),and what to do? you need to figure it out yourself

                                    
                    });
                })
                .catch(function(err){
                    return callback(err);
                });
                // Post.find(query,{
                //     skip: (page-10)*10,
                //     limit:10,
                //     sort:{
                //        'created_at':-1
                //     },
                // },function。。);  

        },

        // getPostsByTagId: fuction(tag_id,callback){
        //     Post.find({'tag_id': tag_id},function(err,posts){

                
        //     });
        // },



};                       
                   
