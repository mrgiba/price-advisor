var cheerio = require('cheerio'),
    fs = require("fs"),
    sendgrid;

if(process.env.SENDGRID_USER && process.env.SENDGRID_KEY) {
    sendgrid  = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_KEY);
}

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

//var searchCriteria = JSON.parse(fs.readFileSync('./searchCriteria.json'));
var searchCriteria;
if(process.env.SEARCH_KEYWORDS) {
    searchCriteria = {words: process.env.SEARCH_KEYWORDS.split(/[\s,]+/i)}
}
else {
    searchCriteria = JSON.parse(fs.readFileSync('./searchCriteria.json'));
}

console.log('Search criteria: ' + JSON.stringify(searchCriteria));

function evaluateOffer(headline) {
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

function sendMailNotification(offerHeadline, offerUrl) {
    //to      : 'priceuser@mailinator.com',
    var payload   = {
        to      : 'mrgiba@gmail.com',
        from    : "advisor@price-advisor.mybluemix.net",
        fromname: "Price Advisor",
        subject : 'Offer found',
        html    : 'Offer found<br>' + offerHeadline + '<br>' + offerUrl
    }

    if(sendgrid) {
        sendgrid.send(payload, function (err, json) {
            if (err) {
                console.error('Error sending email: ' + JSON.stringify(err));
            }
            else {
                console.log('Mail sent: ' + JSON.stringify(json));
            }
        });
    }
}

//     get: 'http://www.promobugs.com.br/forums/promocoes.4/page-[numbers:1:1:1]'

var crawler = {
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
                        var baseUrl = 'http://www.promobugs.com.br/';

                        console.log("Offer URL: " + offerUrl);
                        console.log("Offer headline: " + offerHeadline);
                        console.log("Offer ID: " + offerId);

                        sendMailNotification(offerHeadline, baseUrl + offerUrl);
                    }

                    //TODO: store each new entry in the database
                }else{
                    console.log(err);
                }
            }
        }
    ]
};

module.exports = crawler;
