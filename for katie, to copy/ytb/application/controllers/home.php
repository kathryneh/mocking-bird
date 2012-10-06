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
	
	public function clean($str) {
		$str = @trim($str);
		if(get_magic_quotes_gpc()) {
			$str = stripslashes($str);
		}
		return @mysql_real_escape_string($str);
	}
	
	public function youtubeSearch(){
   
		$searchTerm = $this->input->get('searchTerm');

		if($searchTerm!=""&&$searchTerm!=null){
			$searchTerm = $this->clean($searchTerm);

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
		  	if($viewCount < $minimumViews||$length < $minimumLength||$length > $maximumLength||$rating < $minimumRating){
				$this->return_json($data);
		  	}

			//success, echo the URL
			$status=array('code'=>0,'text'=>"Ok");
			$data=array('status'=>array($status),'url'=>$watch);
			  
			$this->return_json($data);
		}
		else{
			//test if we want to accept this video
		  	$status=array('code'=>4,'text'=>"Error");
		  	$data=array('status'=>array($status));
			$this->return_json($data);
		}
	}
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */