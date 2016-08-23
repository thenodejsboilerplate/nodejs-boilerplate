"use strict";
module.exports = {
		getAll: function(req,content,cb){
				Attraction.find({approved:true}, function(err,attractions){
					if(err){
						return cb({error: 'Internal error'});
					}
					cb(null, attractions.map(
						function(a){
							return {
								name:a.name,
								description:a.description,
								location:a.location,

							};
						}));
				});
	    },

		putOne:  function(req,content,cb){
					let a = new Attraction({
						name:req.body.name,
						description:req.body.description,
						location:{lat:req.body.lat,lng:req.body.lng},
						history:{
							event:'created',
							email:req.body.email,
							date:new Date(),
						},
						approved:false,
					});
					a.save(function (err,a) {
						if(err){
							return cb({err:'Unable to add attraction.'});
							cb(null, {id: a._id});
						}
					});
	   },

	   getOne: function(req,content,cb){
					Attraction.findById(req.params.id, function(err,a){
						if(err){cb({err:'Unable to retrieve attraction.'})}
						cb(null,{
							name:attraction.name,
							description: attraction.description,
							location:attraction.location,
						});
					});

	   },






};





