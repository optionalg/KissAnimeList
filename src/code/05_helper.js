    function firefoxUrl(url, html){
        if(html.indexOf('property="og:url"') > -1){
            url = html.split('<meta property="og:url"')[1].split('content="')[1].split('"')[0];
        }
        return url;
    }

    function local_setValue( thisUrl, malurl ){
        if( (!(thisUrl.indexOf("myAnimeList.net/") >= 0)) && ( GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeSelector(thisUrl))+'/Mal' , null) == null || thisUrl.indexOf("#newCorrection") >= 0 || GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeSelector(thisUrl))+'/Crunch' , null) == 'no')){
            var param = { Kiss: thisUrl, Mal: malurl};
            if(dbSelector == 'Crunchyroll'){
                param = { Kiss: window.location.href+'?..'+$.titleToDbKey($.urlAnimeSelector()), Mal: malurl};
                if($.isOverviewPage()){
                    param = null;
                    if(GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeSelector(thisUrl))+'/Crunch' , null) == null){
                        GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeSelector(thisUrl))+'/Crunch', 'no' );
                    }
                }else{
                    GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeSelector(thisUrl))+'/Crunch', 'yes' );
                }
            }

            var toDB = 1;
            if(thisUrl.indexOf("#newCorrection") >= 0){
                toDB = 0;
                if (confirm('Submit database correction request? \n If it does not exist on MAL, please leave empty.')) {
                    toDB = 1;
                }
            }


            if(toDB == 1){
                GM_xmlhttpRequest({
                    url: 'https://kissanimelist.firebaseio.com/Data2/Request/'+dbSelector+'Request.json',
                    method: "POST",
                    data: JSON.stringify(param),
                    onload: function () {
                        con.log("[DB] Send to database:",param);
                    },
                    onerror: function(error) {
                        con.log("[DB] Send to database:",error);
                    }
                });
            }
        }
        GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeSelector(thisUrl))+'/Mal', malurl );
    }

    function getselect(data, name){
        var temp = data.split('name="'+name+'"')[1].split('</select>')[0];
        if(temp.indexOf('selected="selected"') > -1){
            temp = temp.split('<option');
            for (var i = 0; i < temp.length; ++i) {
                if(temp[i].indexOf('selected="selected"') > -1){
                    return temp[i].split('value="')[1].split('"')[0];
                }
            }
        }else{
            return '';
        }
    }

    function flashm(text,error = true, info = false, permanent = false){
        con.log("[Flash] Message:",text);
        if(error === true){
            var colorF = "#3e0808";
        }else{
            var colorF = "#323232";
        }

        if(permanent){
            $('#flash-div-top').prepend('<div class="flashPerm" style="display:none;"><div style="display:table; pointer-events: all; background-color: red;padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">'+text+'</div></div>');
            $('.flashPerm').delay(2000).slideDown(800);
        }else{
            if(info){
                $('.flashinfo').removeClass('flashinfo').delay(2000).fadeOut({
                    duration: 400,
                    queue: false,
                    complete: function() { $(this).remove(); }});
                $('#flashinfo-div').addClass('hover').append('<div class="flashinfo" style="display:none; max-height: 5000px; margin-top: -8px;"><div style="display:table; pointer-events: all; background-color: red; margin: 0 auto; margin-top: -2px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; "><div style="max-height: 60vh; overflow-y: auto; padding: 14px 24px 14px 24px;">'+text+'</div></div></div>');
                $('.flashinfo').slideDown(800).delay(4000).queue(function() { $('#flashinfo-div').removeClass('hover'); $(this).css('max-height', '8px');});
            }else{
                $('.flash').removeClass('flash').fadeOut({
                    duration: 400,
                    queue: false,
                    complete: function() { $(this).remove(); }});
                var mess ='<div class="flash" style="display:none;"><div style="display:table; pointer-events: all; background-color: red;padding: 14px 24px 14px 24px; margin: 0 auto; margin-top: 20px; max-width: 60%; -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 2px;color: white;background:'+colorF+'; ">'+text+'</div></div>';
                if($('.flashinfo').length){
                    $('.flashinfo').before(mess);
                }else{
                    $('#flash-div').append(mess);
                }
                $('.flash').slideDown(800).delay(4000).slideUp(800, function() { $(this).remove(); });
            }
        }
    }

    function flashConfirm(message, yesCall, cancelCall){
        $('.flashPerm').remove();
        var rNumber = Math.floor((Math.random() * 1000) + 1);
        message = '<div style="text-align: left;">' + message + '</div><div style="display: flex; justify-content: space-around;"><button class="Yes'+rNumber+'" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">OK</button><button class="Cancel'+rNumber+'" style="background-color: transparent; border: none; color: rgb(255,64,129);margin-top: 10px; cursor:pointer;">CANCEL</button></div>';
        flashm(message, false, false, true);
        $( '.Yes'+rNumber ).click(function(){
            $(this).parentsUntil('.flashPerm').remove();
            yesCall();
        });
        $( '.Cancel'+rNumber ).click(function(){
            $(this).parentsUntil('.flashPerm').remove();
            cancelCall();
        });
    }

    function updatebutton(){
        buttonclick();
    }

    function buttonclick(){
        var anime = {};
        if(listType == 'anime'){
            anime['.add_anime[num_watched_episodes]'] = $("#malEpisodes").val();
        }else{
            anime['.add_manga[num_read_volumes]'] = $("#malVolumes").val();
            anime['.add_manga[num_read_chapters]'] = $("#malChapters").val();
        }
        anime['.add_'+listType+'[score]'] = $("#malUserRating").val();
        anime['.add_'+listType+'[status]'] = $("#malStatus").val();
        anime['forceUpdate'] = 2;

        setanime($.normalUrl(), anime);
    }

    function formattitle(title) {
        con.log("[TITLE] Title:",title);

        title = title.replace(/-dub$/i,'');
        title = title.replace(/-sub$/i,'');
        title = title.replace(/\(dub\)$/i,'');
        title = title.replace(/\(sub\)$/i,'');

        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace(' ','-');
        title = title.replace("s2"," 2nd season");
        title = title.replace("s3"," 3nd season");
        title = title.replace("s4"," 4nd season");
        title = title.replace("s5"," 5nd season");
        title = title.replace("s6"," 6nd season");
        title = title.replace("s7"," 7nd season");
        title = title.replace("s8"," 8nd season");
        title = title.replace("s9"," 9nd season");
        //title = title.replace(/[-,.?:'"\\!@#$%^&\-_=+`~;]/g,"");
        con.log("[TITLE] Formated:",title);
        return title;
    }

    function episodeInfo(episode, malUrl, message = '', clickCallback = function(){}){
        //message = '';
        if(episodeInfoBox){
            con.log('[Hover] Episode:',malUrl+'/episode/'+episode);
            GM_xmlhttpRequest({
                url: malUrl+'/episode/'+episode,
                method: "GET",
                onload: function (response) {
                    if(response.response != null){
                        if( response.response.indexOf("Sorry, this anime doesn't seem to have any episode information yet.") > -1 ){
                            if(message == ''){
                                return;

                            }
                        }
                        if(message != ''){
                            message = "<div class='info-Mal-undo' style='white-space: nowrap; margin-top: 15px; /*margin-left: 15px;*/'> "+ message +"</div>";
                        }
                        var data = response.response;
                        var synopsis = '';
                        var epTitle = '';
                        var epSubTitle = '';
                        var imgUrl = "";
                        try{
                            epTitle = data.split('class="fs18 lh11"')[1].split('</h2>')[0].split('</span>')[1];
                            if(epTitle.trim() != '<span class="ml8 icon-episode-type-bg">'){
                                epTitle = '#'+episode+" - "+epTitle+'<br>';
                            }else{
                                epTitle = '';
                            }
                        }catch(e){}

                        if(episodeInfoSubtitle){
                            try{
                                epSubTitle = data.split('<p class="fn-grey2"')[1].split('</p>')[0].split('>')[1].replace(/^\s+/g, "");
                                epSubTitle = " <small>"+epSubTitle+'</small><br>';
                            }catch(e){}
                        }

                        if(episodeInfoSynopsis){
                            try{
                                synopsis = data.split('Synopsis</h2>')[1].split('</div>')[0].replace(/^\s+/g, "");
                                if( synopsis.indexOf("badresult") > -1 || synopsis == ""){
                                    synopsis = "";
                                }else{
                                    synopsis = '<div style="border: 1px solid; margin-top: 15px; padding: 8px;">'+synopsis+'</div>';
                                }
                            }catch(e){}
                        }

                        var imgHtml = '';
                        if(episodeInfoImage){
                            try{
                                imgUrl = data.split('"isCurrent":true')[0].split('{').slice(-1)[0].split('"thumbnail":"')[1].split('"')[0].replace(/\\\//g, '/');
                            }catch(e){}


                            if(imgUrl != ''){
                                imgHtml = '<img style = "margin-top: 15px; height: 100px;" src="'+imgUrl+'"/>';
                            }
                        }
                        var synopsisHtml = '<div style="overflow: hidden; text-align: left; max-width: 0; max-height: 0;" class="synopsis">'+synopsis+'</div>';

                        if(epTitle != ''){
                            flashm ( '<div class="flasm-hover" style="/*display: flex;*/ align-items: center;"><div style="white-space: nowrap;"">'+epTitle + epSubTitle + imgHtml + "</div>"+ message +" </div>" + synopsisHtml, false, true);
                        }else if( message != '' ){
                            flashm ( message , false, true);
                        }

                        $('.undoButton').click(clickCallback);
                    }
                },
                onerror: function(error) {
                    con.log("[episodeInfo] error:",error);
                }
            });
        }
    }

    var miniMalButtonLate = '';
    var miniMalButtonKey = 0;
    function miniMalButton(url = null){
        miniMalButtonLate = url;
        $(".open-info-popup").unbind('click').show().click( function(){
            if($('#info-popup').css('display') == 'none'){
                document.getElementById('info-popup').style.display = "block";
                fillIframe(url, currentMalData);
                $('.floatbutton').fadeOut();
            }else{
                document.getElementById('info-popup').style.display = "none";
                $('.floatbutton').fadeIn();
            }
        });

        if(!miniMalButtonKey){
            miniMalButtonKey = 1;
            $("#info-iframe").contents().keydown(function(e) {
                keys(e);
            });

            $(document).keydown(function(e) {
                keys(e);
            });
        }

        function keys(e){
            if (e.ctrlKey && e.keyCode === 77) {
                if($('#info-popup').css('display') == 'none'){
                    document.getElementById('info-popup').style.display = "block";
                    fillIframe(url, currentMalData);
                    $('.floatbutton').fadeOut();
                }else{
                    document.getElementById('info-popup').style.display = "none";
                    $('.floatbutton').fadeIn();
                }
            }
        }
    }

    function atobURL( encoded ){
        try{
            return atob( encoded );
        }catch(e){
            return encoded;
        }
    }

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           return decodeURI(results[1]) || 0;
        }
    }

    function getTooltip(text, style = '', direction = 'top'){
        var rNumber = Math.floor((Math.random() * 1000) + 1);
        return '<div id="tt'+rNumber+'" class="icon material-icons" style="font-size:16px; line-height: 0; color: #7f7f7f; padding-bottom: 20px; padding-left: 3px; '+style+'"> &#x1F6C8;</div>\
        <div class="mdl-tooltip mdl-tooltip--'+direction+' mdl-tooltip--large" for="tt'+rNumber+'">'+text+'</div>';
    }
