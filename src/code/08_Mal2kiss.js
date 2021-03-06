    function displaySites(responsearray, page){
        if($('#'+page+'Links').width() == null){
            $('#siteSearch').before('<h2 id="'+page+'Links" class="mal_links"><img src="https://www.google.com/s2/favicons?domain='+responsearray['url'].split('/')[2]+'"> '+page+'</h2><br class="mal_links" />');
        }
        if($("#info-iframe").contents().find('#'+page+'Links').width() == null){
            $("#info-iframe").contents().find('.stream-block-inner').append('<li class="mdl-list__item mdl-list__item--three-line"><span class="mdl-list__item-primary-content"><span><img style="padding-bottom: 3px;" src="https://www.google.com/s2/favicons?domain='+responsearray['url'].split('/')[2]+'"> '+page+'</span><span id="'+page+'Links" class="mdl-list__item-text-body"></span></span></li>');
        }
        $('#'+page+'Links').after('<div class="mal_links"><a target="_blank" href="'+responsearray['url']+'">'+responsearray['title']+'</a><div>');
        $("#info-iframe").contents().find('#'+page+'Links').append('<div><a target="_blank" href="'+responsearray['url']+'">'+responsearray['title']+'</a><div>');
        $("#info-iframe").contents().find('.stream-block').show();
    }

    function getSites(sites, page){
        $.each(sites, function(index, value){
            if( GM_getValue( value+'/'+encodeURIComponent(index)+'/MalToKiss', null) != null ){
                con.log('[2Kiss] Cache' );
                var responsearray = $.parseJSON(GM_getValue( value+'/'+encodeURIComponent(index)+'/MalToKiss', null));
                displaySites(responsearray, page);
            }else{
                GM_xmlhttpRequest({
                    url: 'https://kissanimelist.firebaseio.com/Data2/'+value+'/'+encodeURIComponent(index)+'.json',
                    method: "GET",
                    onload: function (response) {
                        con.log('[2Kiss] ',response.response);
                        if(response.response != null){
                            var responsearray = $.parseJSON(response.response);
                            if( value == 'Crunchyroll' ){
                                responsearray['url'] = responsearray['url'] + '?season=' + index;
                            }
                            GM_setValue( value+'/'+encodeURIComponent(index)+'/MalToKiss', '{"title":"'+responsearray['title']+'","url":"'+responsearray['url']+'"}' );
                            displaySites(responsearray, page);
                        }
                    },
                    onerror: function(error) {
                        con.log("error: "+error);
                    }
                });
            }
        });
    }

    function setKissToMal(malUrl){
        $(document).ready(function() {
            $('.mal_links').remove();
            var type = malUrl.split('/')[3];
            var uid = malUrl.split('/')[4].split("?")[0];
            var sites = new Array();
            var sitesName = new Array();
            var searchLinks = 0;
            if(type == 'anime'){
                if(kissanimeLinks != 0){
                    sites.push('Kissanime');
                    sitesName['Kissanime'] = 'KissAnime';
                    searchLinks = 1;
                }
                if(masteraniLinks != 0){
                    sites.push('Masterani');
                    sitesName['Masterani'] = 'MasterAnime';
                    searchLinks = 1;
                }
                if(nineanimeLinks != 0){
                    sites.push('9anime');
                    sitesName['9anime'] = '9anime';
                    searchLinks = 1;
                }
                if(crunchyrollLinks != 0){
                    sites.push('Crunchyroll');
                    sitesName['Crunchyroll'] = 'Crunchyroll';
                    searchLinks = 1;
                }
                if(gogoanimeLinks != 0){
                    sites.push('Gogoanime');
                    sitesName['Gogoanime'] = 'Gogoanime';
                    searchLinks = 1;
                }
            }else{
                if(kissmangaLinks != 0){
                    sites.push('Kissmanga');
                    sitesName['Kissmanga'] = 'KissManga';
                    searchLinks = 1;
                }
            }
            if(searchLinks != 0){
                $('h2:contains("Information")').before('<h2 id="siteSearch" class="mal_links">Search</h2><br class="mal_links" />');
                if(type == 'anime'){
                    $('#siteSearch').after('<div class="mal_links"></div>');
                    if(masteraniLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.google.com/search?q=site:www.masterani.me/anime/info/+'+encodeURI($('#contentWrapper > div:first-child span').text())+'">MasterAnime (Google)</a> <a target="_blank" href="https://www.masterani.me/anime?search='+$('#contentWrapper > div:first-child span').text()+'">(Site)</a></div>');
                    if(gogoanimeLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.gogoanime.tv/search.html?keyword='+$('#contentWrapper > div:first-child span').text()+'">Gogoanime</a></div>');
                    if(crunchyrollLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="http://www.crunchyroll.com/search?q='+$('#contentWrapper > div:first-child span').text()+'">Crunchyroll</a></div>');
                    if(nineanimeLinks != 0) $('#siteSearch').after('<div class="mal_links"><a target="_blank" href="https://9anime.to/search?keyword='+$('#contentWrapper > div:first-child span').text()+'">9anime</a></div>');
                    if(kissanimeLinks != 0) $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissanime.ru/Search/Anime" id="kissanimeSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissanimeSearch">KissAnime</a><input type="hidden" id="keyword" name="keyword" value="'+$('#contentWrapper > div:first-child span').text()+'"/></form>');
                    $('.submitKissanimeSearch').click(function(){
                      $('#kissanimeSearch').submit();
                    });
                }else{
                    $('#siteSearch').after('<form class="mal_links" target="_blank" action="http://kissmanga.com/Search/Manga" id="kissmangaSearch" method="post" _lpchecked="1"><a href="#" onclick="return false;" class="submitKissmangaSearch">KissManga</a><input type="hidden" id="keyword" name="keyword" value="'+$('#contentWrapper > div:first-child span').text()+'"/></form>');
                    $('.submitKissmangaSearch').click(function(){
                      $('#kissmangaSearch').submit();
                    });
                }
            }else{
                $('h2:contains("Information")').before('<div class="mal_links" id="siteSearch"></div>');
            }
            $.each( sites, function( index, page ){
                var url = 'https://kissanimelist.firebaseio.com/Data2/Mal'+type+'/'+uid+'/Sites/'+page+'.json';
                GM_xmlhttpRequest({
                    url: url,
                    method: "GET",
                    onload: function (response) {
                        con.log('[2Kiss]', url, response.response);
                        if(response.response != 'null'){
                            getSites($.parseJSON(response.response), sitesName[page]);
                        }
                    },
                    onerror: function(error) {
                        con.log("[setKissToMal] error:",error);
                    }
                });
            });
       });
    }

    function malThumbnails(){
        if(window.location.href.indexOf("/pics") > -1){
            return;
        }
        if(window.location.href.indexOf("/pictures") > -1){
            return;
        }
        if(malThumbnail == "0"){
            return;
        }
        var height = parseInt(malThumbnail);
        var width = Math.floor(height/144*100);

        var surHeight = height+4;
        var surWidth = width+4;
        GM_addStyle('.picSurround img:not(.noKal){height: '+height+'px !important; width: '+width+'px !important;}');
        GM_addStyle('.picSurround img.lazyloaded.kal{width: auto !important;}');
        GM_addStyle('.picSurround:not(.noKal) a{height: '+surHeight+'px; width: '+surWidth+'px; overflow: hidden; display: flex; justify-content: center;}');

        try{
            window.onload = function(){ overrideLazyload(); };
            document.onload = function(){ overrideLazyload(); };
        }catch(e){
            $(document).ready(function(){ overrideLazyload(); });
        }

        function overrideLazyload() {
            var tags = document.querySelectorAll(".picSurround img:not(.kal)");
            var url = '';
            for (var i = 0; i < tags.length; i++) {
                var regexDimensions = /\/r\/\d*x\d*/g;
                if(tags[i].hasAttribute("data-src")){
                    url = tags[i].getAttribute("data-src");
                }else{
                    url = tags[i].getAttribute("src");
                }

                if ( regexDimensions.test(url) || /voiceactors.*v.jpg$/g.test(url) ) {
                    if(!(url.indexOf("100x140") > -1)){
                        tags[i].setAttribute("data-src", url);
                        url = url.replace(/v.jpg$/g, '.jpg');
                        tags[i].setAttribute("data-srcset", url.replace(regexDimensions, ''));
                        tags[i].classList.add('lazyload');
                    }
                    tags[i].classList.add('kal');
                }else{
                    tags[i].closest(".picSurround").classList.add('noKal');
                    tags[i].classList.add('kal');
                    tags[i].classList.add('noKal');
                }
            }
        }
    }
