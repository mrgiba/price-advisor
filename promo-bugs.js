var crawlerjs = require('crawler-js');

var worlds = {
    interval: 1000,
    getSample: 'http://www.promobugs.com.br/forums/promocoes.4/',
    get: 'http://www.promobugs.com.br/forums/promocoes.4/',
    preview: 0,
    extractors: [
        {
            selector: 'ol.discussionListItems li.discussionListItem div.main h3.title a.PreviewTooltip',
            callback: function(err, html, url, response){
                console.log('Crawled url:');
                console.log(url);
                //console.log(response); // If you need see more details about request
                if(!err){
                    data = {};
                    //data.world = html.children('a').eq(1).attr('href');
                    data.url = html.attr('href');
                    if(typeof data.url == 'undefined'){
                        delete data.url;
                    }
                    console.log(data);
                }else{
                    console.log(err);
                }
            }
        }
    ]
}

crawlerjs(worlds);