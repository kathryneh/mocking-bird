<?php
//Function to sanitize values received from the form. Prevents SQL injection
public function return_json($data) {
	header('Content-Type: application/json');
	echo json_encode($data);
	return;
}
function clean($str) {
	$str = @trim($str);
	if(get_magic_quotes_gpc()) {
		$str = stripslashes($str);
	}
	return mysql_real_escape_string($str);
}
function youtubeSearch(){
   
    if($_GET['searchTerm']){
		$searchTerm = $_GET['searchTerm'];
	}
	$searchTerm = clean($searchTerm);

	$minimumViews = 75000;	//seventy-five-thousand views
	$minimumLength = 60;	//one minute
	$maximumLength = 420; 	//seven minutes
	$minimumRating = 4;		//four out of five
	
    // set feed URL
    $feedURL = 'http://gdata.youtube.com/feeds/api/videos?q='.$searchTerm.',music';

    // read feed into SimpleXML object
    $sxml = simplexml_load_file($feedURL);
	
    // iterate over entries in feed

	  $firstResult = $sxml->entry[0];
	  $entry = $firstResult;
      // get nodes in media: namespace for media information
      $media = $entry->children('http://search.yahoo.com/mrss/');
      
      // get video player URL
      $attrs = $media->group->player->attributes();
      $watch = $attrs['url']; 
            
      // get <yt:duration> node for video length
      $yt = $media->children('http://gdata.youtube.com/schemas/2007');
      $attrs = $yt->duration->attributes();
      $length = $attrs['seconds']; 
	  
      
      // get <yt:stats> node for viewer statistics
      $yt = $entry->children('http://gdata.youtube.com/schemas/2007');
      $attrs = $yt->statistics->attributes();
      $viewCount = $attrs['viewCount']; 
      
      // get <gd:rating> node for video ratings
      $gd = $entry->children('http://schemas.google.com/g/2005'); 
      if ($gd->rating) {
        $attrs = $gd->rating->attributes();
        $rating = $attrs['average']; 
      } else {
        $rating = 0; 
      } 
	  

	  //test if we want to accept this video
	  $status=array('code'=>4,'text'=>"Error");
	  $data=array('status'=>array($status));
	  
	  //failure cases
	  if($viewCount < $minimumViews){
		return_json($data);
	  }
	  if($length < $minimumLength){
		return_json($data);
	  }
	  if($length > $maximumLength){
	    return_json($data);
	  }
	  if($rating < $minimumRating){
	    return_json($data);
	  }
	  
	  //success, echo the URL
	  $status=array('code'=>0,'text'=>"OK");
		$data=array('status'=>array($status),'url'=>$watch);
	  
	  return_json($data);
	  }
	  
	  youtubeSearch();

?>
