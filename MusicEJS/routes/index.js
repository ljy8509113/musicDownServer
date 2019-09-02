var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

 var url = 'https://www.melon.com/chart/';
var title = new Array();
var artist = new Array();
var rank = 100;
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'test' });
});

request(url, function(error, response, html){
	var $ = cheerio.load(html);
	
// 곡명 파싱
    for (var i = 0; i < rank; i++) {
      $('.ellipsis.rank01 > span > a').each(function(){
        var title_info = $(this);
        var title_info_text = title_info.text();
        title[i] = title_info_text;
        i++;
      })
    }
 
    // 아티스트명 파싱
    for (var i = 0; i < rank; i++) {
      $('.checkEllipsis').each(function(){
        var artist_info = $(this);
        var artist_info_text = artist_info.text();
        artist[i] = artist_info_text;
        i++;
      })
    }

	for (var i = 0; i < rank; i++) {
      console.log((i+1)+ "위" + " " + title[i] + " - " + artist[i]);
    }
    
});


module.exports = router;
