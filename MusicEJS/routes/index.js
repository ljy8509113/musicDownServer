var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

var Youtube = require('youtube-node');
var youtube = new Youtube();

var url = 'https://www.melon.com/chart/';
var rank = 100;
var arrayRank = new Array();
class MusicRank {
  constructor(rank, title, artist) {
        this.rank = rank;
        this.title = title;
        this.artist = artist;
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'test' });
});

request(url, function(error, response, html){
	var $ = cheerio.load(html);
	var title = new Array();
  var artist = new Array();
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
      var info = new MusicRank(i+1, title[i], artist[i]);
      console.log("info : " + info.title);
      arrayRank[i] = info;
      i++;
    }

    search(arrayRank)

    console.log("arrayRank : " + arrayRank.length);
    
});

function search(array){

}

module.exports = router;
