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
  var limit = 5;
  youtube.setKey('AIzaSyAcali7jOIfHyqcsf5YJHHM6c3He4_52lI'); // API 키 입력
  //// 검색 옵션 시작
  youtube.addParam('order', 'rating'); // 평점 순으로 정렬
  youtube.addParam('type', 'video');   // 타입 지정
  // youtube.addParam('videoLicense', 'creativeCommon'); // 크리에이티브 커먼즈 아이템만 불러옴
  //// 검색 옵션 끝
  var word = "";
  for (var i=0; i < array.length; i++){
    var info = array[i];
    console.log("array : " + array.length);
    word = info.title + " " + info.artist;
    console.log("word : " + word);
    youtube.search(word, limit, function (err, result) { // 검색 실행
        if (err) { console.log(err); return; } // 에러일 경우 에러공지하고 빠져나감

        console.log(JSON.stringify(result, null, 2)); // 받아온 전체 리스트 출력

        var items = result["items"]; // 결과 중 items 항목만 가져옴
        for (var i in items) { 
            var it = items[i];
            var title = it["snippet"]["title"];
            var video_id = it["id"]["videoId"];
            var url = "https://www.youtube.com/watch?v=" + video_id;
            console.log("제목 : " + title);
            console.log("URL : " + url);
            console.log("-----------");
        }
    });
  }
}

module.exports = router;
