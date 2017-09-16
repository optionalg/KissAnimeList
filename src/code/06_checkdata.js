    function checkdata(){
        if($.normalUrl() !== ""){
            getanime($.normalUrl(), function(anime){handleanime(anime);});
        }else{
            alert(error);
        }

        $.docReady(function() {
            var wrapStart = '<span style="display: inline-block;">';
            var wrapEnd = '</span>';

            var ui = '<p id="malp">';
            ui += '<span id="MalInfo">'+loadingText+'</span>';

            ui += '<span id="MalData" style="display: none; justify-content: space-between; flex-wrap: wrap;">';

            ui += wrapStart;
            ui += '<span class="info">Mal Score: </span>';
            ui += '<a id="malRating" style="color: '+textColor+';min-width: 30px;display: inline-block;" target="_blank" href="">____</a>';
            ui += wrapEnd;

            //ui += '<span id="MalLogin">';
            wrapStart = '<span style="display: inline-block; display: none;" class="MalLogin">';

            ui += wrapStart;
            ui += '<span class="info">Status: </span>';
            ui += '<select id="malStatus" style="font-size: 12px;background: transparent; border-width: 1px; border-color: grey; color: '+textColor+'; text-decoration: none; outline: medium none;">';
            //ui += '<option value="0" style="background: #111111;color: '+textColor+';"></option>';
            ui += '<option value="1" style="background: #111111;color: '+textColor+';">'+watching+'</option>';
            ui += '<option value="2" style="background: #111111;color: '+textColor+';">Completed</option>';
            ui += '<option value="3" style="background: #111111;color: '+textColor+';">On-Hold</option>';
            ui += '<option value="4" style="background: #111111;color: '+textColor+';">Dropped</option>';
            ui += '<option value="6" style="background: #111111;color: '+textColor+';">'+planTo+'</option>';
            ui += '</select>';
            ui += wrapEnd;

            if(listType == 'anime'){
                var middle = '';
                middle += wrapStart;
                middle += '<span class="info">Episodes: </span>';
                middle += '<span style="color: '+textColor+'; text-decoration: none; outline: medium none;">';
                middle += '<input id="malEpisodes" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+textColor+'; text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
                middle += '/<span id="malTotal">0</span>';
                middle += '</span>';
                middle += wrapEnd;

            }else{
                var middle = '';
                middle += wrapStart;
                middle += '<span class="info">Volumes: </span>';
                middle += '<span style="color: '+textColor+'; text-decoration: none; outline: medium none;">';
                middle += '<input id="malVolumes" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+textColor+'; text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
                middle += '/<span id="malTotalVol">0</span>';
                middle += '</span>';
                middle += wrapEnd;


                middle += wrapStart;
                middle += '<span class="info">Chapters: </span>';
                middle += '<span style="color: '+textColor+'; text-decoration: none; outline: medium none;">';
                middle += '<input id="malChapters" value="0" style="background: transparent; border-width: 1px; border-color: grey; text-align: right; color: '+textColor+'; text-decoration: none; outline: medium none;" type="text" size="1" maxlength="4">';
                middle += '/<span id="malTotalCha">0</span>';
                middle += '</span>';
                middle += wrapEnd;
            }

            ui += middle;


            ui += wrapStart;
            ui += '<span class="info">Your Score: </span>';
            ui += '<select id="malUserRating" style="font-size: 12px;background: transparent; border-width: 1px; border-color: grey; color: '+textColor+'; text-decoration: none; outline: medium none;"><option value="" style="background: #111111;color: '+textColor+';">Select</option>';
            ui += '<option value="10" style="background: #111111;color: '+textColor+';">(10) Masterpiece</option>';
            ui += '<option value="9" style="background: #111111;color: '+textColor+';">(9) Great</option>';
            ui += '<option value="8" style="background: #111111;color: '+textColor+';">(8) Very Good</option>';
            ui += '<option value="7" style="background: #111111;color: '+textColor+';">(7) Good</option>';
            ui += '<option value="6" style="background: #111111;color: '+textColor+';">(6) Fine</option>';
            ui += '<option value="5" style="background: #111111;color: '+textColor+';">(5) Average</option>';
            ui += '<option value="4" style="background: #111111;color: '+textColor+';">(4) Bad</option>';
            ui += '<option value="3" style="background: #111111;color: '+textColor+';">(3) Very Bad</option>';
            ui += '<option value="2" style="background: #111111;color: '+textColor+';">(2) Horrible</option>';
            ui += '<option value="1" style="background: #111111;color: '+textColor+';">(1) Appalling</option>';
            ui += '</select>';
            ui += wrapEnd;

            //ui += '</span>';
            ui += '</span>';
            ui += '</p>';

            var uihead ='';
            uihead += '<p class="headui" style="float: right; margin: 0; margin-right: 10px">';
            uihead += '';
            uihead += '<p>';

            var uiwrong ='';
            //uiwrong += '<a id="malWrong" href="#" style="display: inline; margin-left: 6px;">';
            //uiwrong += '[Mal incorrect?]';
            //uiwrong += '</a>';
            //uiwrong += '<a id="episodeOffset" href="#" onclick="return false;" style="display: inline; margin-left: 6px;">';
            //uiwrong += '[Episode Offset]';
            //uiwrong += '</a>';

            uiwrong += '<button class="open-info-popup mdl-button" style="display:none; margin-left: 6px;">MAL</button>';


            if($("#flash").width() === null){
                $(ui).uiPos();
                $(uiwrong).uiWrongPos();
                $(uihead).uiHeadPos();

                $( "#malEpisodes" ).change(function() {
                    updatebutton();
                });
                //####Manga####
                $( "#malVolumes" ).change(function() {
                    updatebutton();
                });
                $( "#malChapters" ).change(function() {
                    updatebutton();
                });
                //#############
                $( "#malUserRating" ).change(function() {
                    updatebutton();
                });
                $( "#malStatus" ).change(function() {
                    updatebutton();
                });

                var flashpos = $('body');
                //if($('#my_video_1').width() !== null){
                    //flashpos = $('#my_video_1');
                //}
                flashpos.after('<div id="flash-div" style="text-align: center;pointer-events: none;position: fixed;bottom:0px;width:100%;z-index: 2147483647;left: 0;"><div id="flash" style="display:none;  background-color: red;padding: 20px; margin: 0 auto;max-width: 60%;          -webkit-border-radius: 20px;-moz-border-radius: 20px;border-radius: 20px;background:rgba(227,0,0,0.6);                       "></div></div>');
                $("#malWrong").click(function() {
                    var murl = GM_getValue(dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Mal' , null);
                    murl = prompt("Please enter the right MyAnimeList url. \nLeave blank for reset",murl);
                    if(murl !== null){
                        if(murl !== ''){
                            GM_setValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Mal', murl );
                            flashm( "new url '"+murl+"' set." , false);
                            checkdata();
                        }else{
                            GM_deleteValue( dbSelector+'/'+$.titleToDbKey($.urlAnimeTitle($.normalUrl()))+'/Mal' );
                            flashm( "MyAnimeList url reset" , false);
                            checkdata();
                        }
                    }
                });

                createIframe();
                //#######Kissanime#######
                $("#btnRemoveBookmark").click(function() {
                    var anime = {};
                    anime['.add_'+listType+'[status]'] = 4;
                    anime['forceUpdate'] = 1;
                    setanime($.normalUrl(),anime);
                });

                $("#btnAddBookmark").click(function() {
                    var anime = {};
                    anime['.add_'+listType+'[status]'] = 6;
                    anime['forceUpdate'] = 1;
                    setanime($.normalUrl(),anime);
                });
                //#######################
            }
        });


    }