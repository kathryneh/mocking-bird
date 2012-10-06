window.content.fbAsyncInit = function() {
    FB.init({
	appId      : '450119681706538', // App ID
	status     : true, // check login status
	cookie     : true, // enable cookies to allow the server to access the session
	xfbml      : true  // parse XFBML
    });
    FB.ui({ method: 'feed', message: 'I just found this song!', link: document.getElementsByClassName('hidden-video-player'+document.getElementById('fb_root').getAttribute('to_link'))[0].getAtrribute('src')});
},
// Load the SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=450119681706538";
    ref.parentNode.insertBefore(js, ref);
}(document));


