	  <?php
	  //turn something like
	  //http://www.youtube.com/watch?v=J8vGGWn2AmE&feature=youtube_gdata_player
	  //into -->
	  //http://www.youtube.com/embed/J8vGGWn2AmE?autoplay=1
	  function url2embedded($url){
			$begin = strpos($url,'v=')+2;
			$end = strpos($url,'&');
			$code = substr($url,$begin,$end-$begin);
			$embed = 'http://www.youtube.com/embed/'.$code.'?autoplay=1';
			return $embed;
	  }
	  ?>
