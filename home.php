<?php

	$type = $_GET['type'];
	$in_data = $_GET['data'];
	
	if($type=="getClasses"){
		getClasses();
	}
	if($type=="youtubeSearch"){
		youtubeSearch($in_data);
	}
	if($type=="getKeywords"){
		getKeywords($in_data);
	}
	
	function getClasses(){
		//$result = $this->user_model->getCourses($id);
		$status = array('code'=>0, 'text'=>'ok');
		$course1 = array('id'=>'0', 'name'=>'comp110', 'title'=>'Introduction to Programming', 'credit'=>'4', 'time'=>'1300', 'description'=>'', 'prof'=>'David Stotts', 'length'=>75, 'days'=>'mwf');
		$course2 = array('id'=>'1', 'name'=>'engl200', 'title'=>'Fiction Writing', 'credit'=>'3', 'time'=>'0800', 'description'=>'', 'prof'=>'Bradely Hammer', 'length'=>50, 'days'=>'tr');
		$course3 = array('id'=>'2', 'name'=>'chem408', 'title'=>'Organic Chemistry VI', 'credit'=>'3', 'time'=>'1530', 'description'=>'', 'prof'=>'Josh Glover', 'length'=>50, 'days'=>'mrf');
		$course4 = array('id'=>'3', 'name'=>'poli100', 'title'=>'Federal Government', 'credit'=>'3', 'time'=>'1100', 'description'=>'', 'prof'=>'Steve Turner', 'length'=>75, 'days'=>'tr');
		$classes = array($course1, $course2, $course3, $course4);
		$result = array('status'=>array($status), 'classes'=>$classes);
		$this->return_json($result);
	}

	
	//Function to sanitize values received from the form. Prevents SQL injection
	function return_json($data) {
		header('Content-Type: application/json');
		echo json_encode($data);
		return;
	}
	
	function youtubeSearch($in_data){
   
		$searchTerm = $in_data;
		if($searchTerm!=""&&$searchTerm!=null){

			$minimumViews = 40000;	//seventy-five-thousand views
			$minimumLength = 60;	//one minute
			$maximumLength = 420; 	//seven minutes
			$minimumRating = 4;		//four out of five
			// set feed URL
			$feedURL = 'http://gdata.youtube.com/feeds/api/videos?q='.$searchTerm.',music';

			// read feed into SimpleXML object
			$sxml = simplexml_load_file($feedURL);
			
			// iterate over entries in feed
			if(count($sxml->entry)>0){
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
			}
			else{//case if count(results) < 1
				//make it a failure case to true
				$viewCount = 0;
				$length = 0;
				$rating = 0;
			}
		  	//failure cases
		  	if($viewCount < $minimumViews||$length < $minimumLength||$length > $maximumLength||$rating < $minimumRating){
				//test if we want to accept this video
				$status=array('code'=>2,'text'=>"Error");
				$data=array('status'=>array($status));
				return_json($data);
		  	}
			else{
				//success, echo the URL
				$status=array('code'=>0,'text'=>"Ok");
				$data=array('status'=>array($status),'url'=>$watch, 'title'=>$firstResult->title);
				return_json($data);
			}
		}
		else{
		  	$status=array('code'=>4,'text'=>"No Data");
		  	$data=array('status'=>array($status));
			return_json($data);
		}
	}
	
	function getKeywords($in_data){

		$stringToPass = $in_data;

		if($stringToPass!=""&&$stringToPass!=null){

			$url = 'http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction';
			$post = "query=tool&appid=hack&context=".rawurlencode($stringToPass);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
			$xml = simplexml_load_string(curl_exec($ch));
			curl_close($ch);
			$tempStringOfEvenMoreShitYo ="";
			foreach($xml->children() as $child)
			{
				$tempStringOfEvenMoreShitYo = $tempStringOfEvenMoreShitYo.' '.$child;	
			}
			$status=array('code'=>0,'text'=>"OK");
			$data=array('status'=>array($status),'text'=>$tempStringOfEvenMoreShitYo);
			
			return_json($data);
		}
		else{
			$status=array('code'=>4,'text'=>"No Data");
		  	$data=array('status'=>array($status));
			return_json($data);
		}
	}

/* End of file home.php */
/* Location: ./application/controllers/home.php */