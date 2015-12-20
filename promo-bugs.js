var crawlerjs = require('crawler-js'),
    cheerio = require('cheerio');
// selector: 'ol.discussionListItems li.discussionListItem div.main h3.title a.PreviewTooltip',


var worlds = {
    interval: 1000,
    getSample: 'http://www.promobugs.com.br/forums/promocoes.4/',
    get: 'http://www.promobugs.com.br/forums/promocoes.4/page-[numbers:1:1:1]',
    preview: 0,
    extractors: [
        {
            selector: 'ol.discussionListItems li.discussionListItem',
            callback: function(err, html, url, response){
                console.log('Crawled url:');
                console.log(url);
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

                    var previewToolTip = $('div.main h3.title a.PreviewTooltip')
                    var offerUrl = previewToolTip.attr('href');
                    var offerHeadline = previewToolTip.text();
                    if(offerUrl) {
                        console.log("Offer URL: " + offerUrl);
                        console.log("Offer headline: " + offerHeadline);
                        console.log("Offer ID: " + offerId);
                    }

                    //TODO: evaluate each headline against keywords
                    //TODO: store each new entry in the database
                }else{
                    console.log(err);
                }
            }
        }
    ]
}

// TODO: setup schedule to run crawler in a regular basis

crawlerjs(worlds);