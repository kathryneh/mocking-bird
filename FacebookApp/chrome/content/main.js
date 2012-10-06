/*
 
 Our FacebookExtension
 
*/
var animspeed = 1000; //A 1 second animation

var songs  = new Array(
    "http://www.youtube.com/watch?v=mSW4Mqihbd4",
    "http://www.youtube.com/watch?v=t6FUR_nhGX8",
    "http://www.youtube.com/watch?v=9bZkp7q19f0",
    "http://www.youtube.com/watch?v=l12Csc_lW0Q",
    "http://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "http://www.youtube.com/watch?v=QH2-TGUlwu4",
    "http://www.youtube.com/watch?v=ZZ5LpwO-An4",
    "http://www.youtube.com/watch?v=Ia-zDHnBOWk",
    "http://www.youtube.com/watch?v=kfVsfOSbJY0",
    "http://www.youtube.com/watch?v=_CTYymbbEL4",
    "http://www.youtube.com/watch?v=e8-sMJZTYf0",
    "http://www.youtube.com/watch?v=Iof5pRAIZmw",
    "http://www.youtube.com/watch?v=nxvlKp-76io",
    "http://www.youtube.com/watch?v=k_CAs3q7G48",
    "http://www.youtube.com/watch?v=zt0UuNpUqK4"
);

var blacklist = new Array("untitled", "undefined");

//** Constructor
var Facebook_Extension = {
    
    init: function(){
        var self = this;
        self.page_content = $(window.content.document);
        self.page_content.find('body').append("<script type=text/javascript src='http://connect.facebook.net/en_US/all.js' ></script>");
        self.randomClass = "a"+Math.round(Math.random()*100000);
        self.highlighted_text = '';
        self.highlighted_container = "";
        while(self.page_content.find('.mockbtn'+self.randomClass).size()>0&&self.page_content.find('.hidden-video-player'+self.randomClass).size()>0&&self.page_content.find('.btn_pos'+self.randomClass).size()>0&&self.page_content.find('.lyrics'+self.randomClass).size()>0){
            self.randomClass = "a"+Math.round(Math.random()*100000);
        }
        self.page_content.find('body, iframe').live(' mouseup', function(event){
            if(self.checkSelectionExists()&&self.highlighted_text!=window.content.getSelection()){
                self.highlighted_text = String(window.content.getSelection());
                self.highlighted_container = $(window.content.getSelection().getRangeAt(0).startContainer.parentNode);
                self.kill_all();
                self.show_highlight_btn();
            }
            else if(window.content.getSelection()==""){
                self.kill_all();
            }
        });
        
        //Keep the send button positioned
        $(window.content).resize(function(){
            if(self.page_content.find('.mockbtn'+self.randomClass).size()){
                var mock_btn = self.page_content.find('.mockbtn'+self.randomClass);
                var mock_parent = self.page_content.find('.btn_pos'+self.randomClass);
                mock_btn.css({
                    'left' : mock_parent.parent().offset().left,
                    'top' : mock_parent.parent().offset().top+mock_parent.parent().outerHeight()
                });
            }
        });

       // Load the SDK Asynchronously
      
    },

    //** Get the song title and author for a string, word_string: the unsanitized string
    check_song : function(word_string){
        var self = this;
        if(self.checkSelectionExists()){
            self.songs_list = new Array();
            self.songs_list_index = 0;
            var song_url = URLencode(String($.trim(word_string)).replace(/[^A-Za-z0-9]/g, " ").slice(0, 260));
            self.page_content.find('body').append('<iframe class="lyric'+self.randomClass+'" src="http://www.lyrics.net/lyrics/'+song_url+'"></iframe>');
            self.page_content.find('.lyric'+self.randomClass).css({
                'display' : 'none'
            }).load(function(){
                var iframe_ref = $(this).contents();
                var song_table = iframe_ref.find('.ent');
                var table_rows = song_table.find('tr');
                $.each(table_rows, function(i, e){
                    if($(e)[0]!=table_rows.get(table_rows.size()-1)){
                        self.songs_list[i] = {title: $($(e).find('a').get($(e).find('a').size()-2)).text(), artist: String($($(e).find('a').get($(e).find('a').size()-1)).text()).slice(3)}
                    }
                });
                //We have songs
                if(self.songs_list.length&&self.filter_blacklist()){
                    self.getYoutubeLink(self.songs_list[self.songs_list_index]);
                }
                else{
                    //No songs available
                    self.addSong(self.pickRandomSong());
                }
                $(this).remove();
            });
        }
    },

    connectShareBtn : function(){

        var self = this;
        window.fbAsyncInit = function(){
            FB.init({appId: 450119681706538, status: true, cookie: true});
            FB.Event.subscribe('auth.login', function(response) {          
              window.location = window.location;
            });

        FB.Canvas.setAutoGrow();

        };

          // Set up so we handle click on the buttons
        self.page_setup('.mockbtn'+this.randomClass).click(function(){

        // calling the API ...
        var obj = {
          method: 'feed',
          link: 'https://developers.facebook.com/docs/reference/dialogs/',
          picture: 'http://fbrell.com/f8.jpg',
          name: 'Facebook Dialogs',
          caption: 'Reference Documentation',
          description: 'Using Dialogs to interact with users.'
        };

        function callback(response) {
          self.page_content.find('msg').innerHTML = "Post ID: " + response['post_id'];
        }

        FB.ui(obj, callback);
        });
    },

    //** Remove the mocking bird button from the webpage
    mockBtn_kill : function(){
        this.page_content.find('.mockbtn'+this.randomClass).remove();
        this.page_content.find('.btn_pos'+this.randomClass).remove();
    },

    //** Check that there is a selection
    checkSelectionExists : function(){
        return (typeof window.content.getSelection != "undefined"&&String(window.content.getSelection()).length>0);
    },

    //** Display the highlight button
    show_highlight_btn : function(){
        var self = this;
        self.highlighted_container.prepend('<div class="btn_pos'+self.randomClass+'"></div>');
        var mockbrd_parent = self.page_content.find('.btn_pos'+self.randomClass);
        self.page_content.find('body').append('<button class="mockbtn'+self.randomClass+'">Sing</button>');
        var mockbrd_btn = self.page_content.find('.mockbtn'+self.randomClass);
        var mockbrd_width = mockbrd_btn.outerWidth();
        mockbrd_parent.css({
           'position' : 'relative' 
        });
        mockbrd_btn.css({
            'position' : 'absolute',
            'left' : mockbrd_parent.parent().offset().left,
            'top' : mockbrd_parent.parent().offset().top+self.highlighted_container.height(),
            'background-color' : '#5B87BB',
            'border' : '1px solid #2B478B',
            'cursor' : 'pointer',
            'border-radius' : '4pt',
            'outline' : 'none',
            'width' : 0,
            'height' : '20px',
            'box-shadow' : '0pt 5px 4px -2p rgba(0, 0, 0, 0.3)',
            'z-index' : '9999999999999999'
        }).animate({
            'width' : mockbrd_width
        }, animspeed/2).click(function(event){
            event.stopImmediatePropagation();
            event.preventDefault();
            self.killVideo();
            if(self.checkSelectionExists()){
            	if(String(self.highlighted_text).length <= 260)
            		self.check_song(self.highlighted_text);
            	else
            		self.getKeywords(self.highlighted_text);
        }   
        });
    },

    getKeywords : function(text){
    	var self = this;
	var keywords;
	var link = 'http://winston.weddmi.com/uuu/home.php';
	$.ajax({
            url : link,
            type: 'GET',
            data: {
                type: 'getKeywords',
                data : text 
            },
            timeout: 30000,
            success: function(data, textStatus, jqXHR) {
                if(data.status[0].code==0){
                    keywords = data.text;
                }
                else{
                    keywords = text;
                }
            self.check_song(keywords);
	},
	error : function(jqXHR, textStatus, errorThrown) {
            self.check_song(self.highlighted_text);
	}
	});
    },

    //** Kill everything
    kill_all : function(){
        this.killVideo();
        this.mockBtn_kill();
    },

    //** Check the song and artist to make sure it doesn't contain certain keywords
    filter_blacklist : function(){
        var self = this;
        while(true){
            var play = true;
            for(var i=0; i<blacklist.length; i++){
                if(self.songs_list_index==self.songs_list.length){
                    return false;
                }
                if(String(self.songs_list[self.songs_list_index].title+" "+self.songs_list[self.songs_list_index].artist).toLocaleLowerCase().search(blacklist[i])>-1){
                    self.songs_list_index++;
                    play = false;
                    break;
                }
            }
            if(play){
                return true;
            }
            if(self.songs_list_index==self.songs_list.length){
                return false;
            }
        }
    },

    //** Get the youtube link based off search results, song_item: the object containing the song title and artist
    getYoutubeLink : function(song_item){
        var self = this;
        self.page_content.find('body').append("<script type=text/javascript src='http://connect.facebook.net/en_US/all.js' ></script>");
       $.ajax({
            url : 'http://winston.weddmi.com/uuu/home.php',
            type: 'GET',
            data: {
                type : 'youtubeSearch',
                data: song_item.title+" "+song_item.artist
            },
            timeout: 30000, // in milliseconds
            success: function(data,textStatus,jqXHR) {
                //Success
                if(data.status[0].code==0){
                    self.page_content.find('.mockbtn'+self.randomClass).attr('title', data.title[0]);
                    self.addSong(data.url[0]);
                }
                //Song doesn't exist
                else{
                    self.songs_list_index++;
                    //Check through other songs, play a random song 
                    if(!self.filter_blacklist()){
                        self.addSong(self.pickRandomSong());
                    }
                    else{
                        self.getYoutubeLink(self.songs_list[self.songs_list_index]);
                    }
                }
            },
            error: function(jqXHR,textStatus,errorThrown) {
                self.songs_list_index++;
                //Check through other songs, play a random song 
                if(!self.filter_blacklist()){
                    self.addSong(self.pickRandomSong());
                }
                else{
                    self.getYoutubeLink(self.songs_list[self.songs_list_index]);
                }
            }
        });
    },

    addSong : function(url) {
        var self = this;
        url = self.url2embedded(url);
        var iframe = '<iframe style="hidden" width="1" class="hidden-video-player' + self.randomClass + '"  height="1" src="'+ url + '" frameborder="0" ></iframe>';
        self.page_content.find('body').append(iframe);
	self.renderShareButton();
    },

    url2embedded : function(url) {
        url = String(url);
        if(url.search("&") == -1)
                url = url + "&";
        var begin = url.search("v=") + 2;
        var end = url.search("&");
        var id = url.substring(begin,end);
        return "http://href.li/?http://www.youtube.com/embed/" + id + "?autoplay=1";
    },

    renderShareButton : function() {
    	var self = this;
    	var mockbrd_btn = self.page_content.find('.mockbtn'+self.randomClass);
        if(mockbrd_btn.attr('title')=="undefined"){
            mockbrd_btn.attr('title', 'random song');
        }
	mockbrd_btn.css({
		'height' : '25px',
		'width'  : mockbrd_btn.outerWidth(),
		'background-color' : '#5B87BB'
	});
	mockbrd_btn.text("Share!");
        self.facebook_app_init();
    },
    
    facebook_app_init : function(){
        var self = this;
        if(self.page_content.find('#fb_root').size()){
            self.page_content.find('body').append('<div id="fb_root"></div>');
            self.page_content.find('body').append('<script src="http://connect.facebook.net/en_US/all.js"></script>');
            self.page_content.find('body').append('<script type="text/javascript" >FB.init({appId: "450119681706538", status: true, cookie: true});</script>');
            //this.page_content.find('#fb_root').attr('to_link', this.randomClass);
            //this.page_content.find('.mockbtn'+this.randomClass).remove();
            //this.page_content.find('body').append('<a id="postToWall" class="facebook-button mockbtn'+this.randomClass+'" data-url="https://mocking-bird.herokuapp.com/" href="#"><span>El Share</span></a>');
            //this.page_content.find('body').append('<script type="text/javascript" src="chrome://FacebookApp/content/fb_info.js"></script>');
            self.page_content.find('.mockbtn'+this.randomClass).unbind('click').click(function(){
                // calling the API ...
                var obj = {
                    method: 'feed',
                    link: self.page_content.find('.hidden-video-player'+self.randomClass).attr('src'),
                    name: 'Facebook Dialogs',
                    caption: 'Reference Documentation',
                    description: 'Using Dialogs to interact with users.'
                };
                    
                function callback(response) {
                    document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
                }
                
                FB.ui(obj, callback);
            });
        }
    },

    killVideo : function() {
        var self = this;
        self.page_content.find('.hidden-video-player'+self.randomClass).remove();
    },

    pickRandomSong : function() {
        var size = songs.length;
        var index = Math.floor(Math.random() * (size - 1));
        return songs[index];
    }
}

//** URL encode a string
function URLencode(sStr){
    return escape(sStr).replace(/\+/g, '%2C').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g, '%2F').replace(/\./g, '%2E');
}

gBrowser.addEventListener("DOMContentLoaded", function(event){
	// this is the content document of the loaded page.
	let doc = event.originalTarget;
	if(doc instanceof HTMLDocument){
	    // is this an inner frame?
	    if(doc.defaultView.frameElement){
		// Frame within a tab was loaded.
		// Find the root document:
		while(doc.defaultView.frameElement){
		    doc = doc.defaultView.frameElement.ownerDocument;
		}
	    }
	    //Main page loads
	    else{
		//Initialize the page components
		Facebook_Extension.init();
	    }
	}
    }, true);
    
    //Check for different events
    window.addEventListener("select", function(){Facebook_Extension.kill_all(); Facebook_Extension.init()}, false);
    var container = gBrowser.tabContainer;
    container.addEventListener("TabOpen", function(){Facebook_Extension.kill_all();}, false);
    container.addEventListener("TabSelect", function(){Facebook_Extension.kill_all(); }, false);


const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
var facebook_event_list={  
    QueryInterface: function(aIID){  
        if(aIID.equals(Components.interfaces.nsIWebProgressListener)||aIID.equals(Components.interfaces.nsISupportsWeakReference)||aIID.equals(Components.interfaces.nsISupports)){
            return this;
        }
        throw Components.results.NS_NOINTERFACE;  
    },  
    onStateChange: function(aWebProgress, aRequest, aFlag, aStatus){   
        if(aFlag & STATE_STOP){
            init();
        }  
    },        
    onLocationChange: function(aProgress, aRequest, aURI){
        //init();
	//fb.kill_all();
	//var fb = new Facebook_Extension();
    } 
}
