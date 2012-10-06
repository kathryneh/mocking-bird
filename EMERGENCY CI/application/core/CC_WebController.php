<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class CC_WebController extends CI_Controller {
	// going with public just to be safe :/
	public function __construct() {
		// call the parent constructor
		parent::__construct();
	}

	public function is_authenticated() {
		/* Returns a bool representing whether or not the user is logged in */
		$user_id = $this->session->userdata('user_id');
		return intval($user_id) > 0;
	}
	
	public function logged_user(){
		/* Returns the user id */
		$user_id = $this->session->userdata('user_id');
		return $user_id;
	}

	public function return_json($data) {
		header('Content-Type: application/json');
		$this->load->helper('json_helper');
		$result = format_api_status($data);
		echo json_encode($result);
		return;
	}
}
