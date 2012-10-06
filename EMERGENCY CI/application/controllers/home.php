<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
require APPPATH.'/core/CC_WebController.php';
class Home extends CC_WebController {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/home
	 *	- or -  
	 * 		http://example.com/index.php/home/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/home/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	
	function __construct(){
		parent::__construct();
	}
	
	public function index(){
		$this->load->view('home');
	}
	
	public function getClasses(){
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
	
	public function searchClasses(){
		//$result = $this->user_model->getCourses($id);
		$status = array('code'=>0, 'text'=>'ok');
		$course1 = array('id'=>'0', 'name'=>'comp110', 'title'=>'Introduction to Programming', 'credit'=>'4', 'time'=>'1300', 'description'=>'Here is a course description', 'prof'=>'David Stotts', 'length'=>75, 'days'=>'mwf');
		$course2 = array('id'=>'4', 'name'=>'comp200', 'title'=>'Nap Time', 'credit'=>'3', 'time'=>'0830', 'description'=>'Here is another course description', 'prof'=>'Kevin Jeffay', 'length'=>50, 'days'=>'tr');
		$course3 = array('id'=>'5', 'name'=>'comp655', 'title'=>'Cryptography', 'credit'=>'3', 'time'=>'1400', 'description'=>'more talk of code breaking', 'prof'=>'Michael Reiter', 'length'=>75, 'days'=>'tr');
		$course4 = array('id'=>'6', 'name'=>'comp426', 'title'=>'Adv. Web Programming', 'credit'=>'3', 'time'=>'1230', 'description'=>'ah, well this should be an interesting class...', 'prof'=>'Ketan Mayer-Patel', 'length'=>75, 'days'=>'tr');
		$course5 = array('id'=>'7', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course6 = array('id'=>'8', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course7 = array('id'=>'9', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course8 = array('id'=>'10', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course9 = array('id'=>'11', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course10 = array('id'=>'12', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course11 = array('id'=>'13', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course12 = array('id'=>'14', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course13 = array('id'=>'15', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course14 = array('id'=>'16', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course15 = array('id'=>'17', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$course16 = array('id'=>'18', 'name'=>'comp590', 'title'=>'Discrete Structures', 'credit'=>'3', 'time'=>'1230', 'description'=>'A replacement for Math 383', 'prof'=>'Ben Clark', 'length'=>75, 'days'=>'tr');
		$classes = array($course1, $course2, $course3, $course4, $course5, $course6, $course7, $course8, $course9, $course10, $course11, $course12, $course13, $course14, $course15, $course16);
		$result = array('status'=>array($status), 'classes'=>$classes);
		$this->return_json($result);
	}
	
	function unauthenticatedResponse(){
		$status = array('code'=>2, 'text'=>'Not authenticated.');
		$result = array('status'=>array($status));
		$this->return_json($result);
	}
	
	//Function to sanitize values received from the form. Prevents SQL injection
	public function return_json($data) {
		header('Content-Type: application/json');
		echo json_encode($data);
		return;
	}
	
	public function youtubeSearch(){
   
		$searchTerm = $this->input->get('searchTerm');

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
				$this->return_json($data);
		  	}
			else{
				//success, echo the URL
				$status=array('code'=>0,'text'=>"Ok");
				$data=array('status'=>array($status),'url'=>$watch, 'title'=>$firstResult->title);
				$this->return_json($data);
			}
		}
		else{
		  	$status=array('code'=>4,'text'=>"No Data");
		  	$data=array('status'=>array($status));
			$this->return_json($data);
		}
	}
	
	public function getKeywords(){
		echo "3";
		/*$stringToPass = $this->input->get('stringToPass');
		echo "2";
		if($stringToPass!=""&&$stringToPass!=null){
			echo "1";
			$url = 'http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction';
			$post = "query=tool&appid=hack&context=".rawurlencode($stringToPass);
			$ch = curl_init();
			curl_setopt($ch, CURLOPT_URL, $url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_POST, 1);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
			$xml = simplexml_load_string(curl_exec($ch));
			curl_close($ch);
			$tempString;
			foreach($xml->children() as $child)
			{
				$tempString = $tempString.' '.$child;	
			}
			$status=array('code'=>0,'text'=>"OK");
			$data=array('status'=>array($status),'text'=>$tempString);
			
			return_json($data);
		}
		else{
			$status=array('code'=>4,'text'=>"No Data");
		  	$data=array('status'=>array($status));
			$this->return_json($data);
		}*/
	}

/* End of file home.php */
/* Location: ./application/controllers/home.php */