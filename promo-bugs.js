var crawlerjs = require('crawler-js'),
    cheerio = require('cheerio'),
    fs = require("fs");
// selector: 'ol.discussionListItems li.discussionListItem div.main h3.title a.PreviewTooltip',

/* Search criteria:
- simple word (regard synonyms, regex, plural vs singular, accents)
- price
- store
 */

function normalizeString( headline ) {
    var lowerCaseHeadline = headline.toLowerCase();

    var chatToAccentVariationsMap 	= {
        a : /[\xE0-\xE6]/g,
        e : /[\xE8-\xEB]/g,
        i : /[\xEC-\xEF]/g,
        o : /[\xF2-\xF6]/g,
        u : /[\xF9-\xFC]/g,
        c : /\xE7/g,
        n : /\xF1/g
    };

    for ( var char in chatToAccentVariationsMap ) {
        var regex = chatToAccentVariationsMap[char];
        lowerCaseHeadline = lowerCaseHeadline.replace( regex, char );
    }

    return lowerCaseHeadline;
}

//
//var searchCriteria = {
//    words: ['RelógiO']
//}

var searchCriteria = JSON.parse(fs.readFileSync('./searchCriteria.json'));
//var searchCriteria = require('./searchCriteria.json');

function evaluateOffer(headline) {
    //console.log('Evaluating headline ' + headline);
    var lowerCaseHeadline = normalizeString(headline);

    var foundMatch = searchCriteria.words.some(
        function (word) {
            var normalizedWord = normalizeString(word);
            //return lowerCaseHeadline.search(new RegExp(word, "i")) > -1;
            return lowerCaseHeadline.search(normalizedWord) > -1;
        }
    );

    return foundMatch;
}

var worlds = {
    interval: 1000,
    getSample: 'http://www.promobugs.com.br/forums/promocoes.4/',
    get: 'http://www.promobugs.com.br/forums/promocoes.4/page-[numbers:1:1:1]',
    preview: 0,
    extractors: [
        {
            selector: 'ol.discussionListItems li.discussionListItem',
            callback: function(err, html, url, response){
                //console.log('Crawled url:');
                //console.log(url);
                //console.log(response); // If you need see more details about request
                if(!err){
                    //data = {};
                    ////data.world = html.children('a').eq(1).attr('href');
                    //data.url = html.attr('href');
                    //if(typeof data.url == 'undefined'){
                    //    delete data.url;
                    //}
                    //console.log(data);
                    //console.log(html);
                    $ = cheerio.load(html.html());

                    //console.log($('div.main').html());

                    var offerId = html.attr('id');

                    var previewToolTip = $('div.main h3.title a.PreviewTooltip');
                    var offerUrl = previewToolTip.attr('href');
                    var offerHeadline = previewToolTip.text();


                    if(offerUrl && evaluateOffer(offerHeadline)) {
                        //TODO: evaluate each headline against keywords

                        console.log("Offer URL: " + offerUrl);
                        console.log("Offer headline: " + offerHeadline);
                        console.log("Offer ID: " + offerId);
                    }




                    //TODO: store each new entry in the database
                }else{
                    console.log(err);
                }
            }
        }
    ]
};

// TODO: setup schedule to run crawler in a regular basis

crawlerjs(worlds);