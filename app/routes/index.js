'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var googleImages = require('google-images');
var User = require('../models/users');
var savedSearch = require('../models/savedSearches')
var bodyParser = require('body-parser');

const CSE_ID = '015945500812735874842:cpb5dbxlcg0';
const API_KEY = 'AIzaSyAcw73Xc7pZJIGHhCoqmXsUmrbH3fZZh7E';

let client = googleImages(CSE_ID, API_KEY);



module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var clickHandler = new ClickHandler();
// app.use(bodyParser.json({extended:false}));
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/:search')
		.get(function(req,res){
			res.sendFile(path+'/public/helloWorld.html');
		})
		.post(function(req,res){
			var newSearch = new savedSearch();
			newSearch.term=req.body.searchTerm;
			newSearch.when=new Date();
			newSearch.save();
			
			res.send(newSearch);	
		});
		
	app.route('/latest/imagesearch')
		.get(function(req,res){
			savedSearch.find({},function(err,searches){
				if(err) throw err;
				res.render(path+'/public/recentSearches.ejs',{registeredSearches:searches});
			})
		});

	app.route('/login')
		.get(function (req, res) {
			savedSearch.find({},function(err,searches){
				if(err) throw err;
				res.sendFile(path + '/public/login.html');
			})
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);

	function testSearch(req,res,next){
		client.search('lol cats')
    		.then(function (images) {
    			console.log("google image results: "+JSON.stringify(images));
        /*
        [{
            "url": "http://steveangello.com/boss.jpg",
            "type": "image/jpeg",
            "width": 1024,
            "height": 768,
            "size": 102451,
            "thumbnail": {
                "url": "http://steveangello.com/thumbnail.jpg",
                "width": 512,
                "height": 512
            }
        }]
         */
         next();
    	});
	}
	
	
	
	
};
