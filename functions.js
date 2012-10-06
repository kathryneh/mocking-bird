
Facebook_Extension.prototype.addSong = function(url) {
	var self = this;
	url = self.url2embedded(url);
	var iframe = '<iframe width="0" class="hidden-video-player' + self.randomClass + '"  height="0" src="'+ url + '" frameborder="0" ></iframe>';
	self.page_content.find('body').append(iframe);	
																					           
}


Facebook_Extension.prototype.url2embedded = function(url) {
	url = String(url);
	if(url.search("&") == -1)
		url = url + "&";
	var begin = url.search("v=") + 2;
	var end = url.search("&");
	var id = url.substring(begin,end);
	return "http://href.li/?http://www.youtube.com/embed/" + id + "?autoplay=1";
}

Facebook_Extension.prototype.killVideo = function() {
	var self = this;
	self.page_content.find('.hidden-video-player').remove();
}


var songs  = (
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
		"http://www.youtube.com/watch?v=k_CAs3q7G48"
		);

Facebook_Extensions.prototype.pickRandomSong = function() {
	var size = songs.length;
	var index = Math.floor(Math.random() * (size - 1));
	return songs[index];
}
		
