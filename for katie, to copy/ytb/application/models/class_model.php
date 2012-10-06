<?php
/* This class handle all media related interaction between controller
 *  media model*/
class Class_model extends CI_Model {

    function __construct()
    {
        parent::__construct();
    }

	/*Media add was moved to library media_upload*/

	/*delete media --mark the media as is_deleted in the media table
	 * $media_id
	 * $user_id*/
	function delete($media_id,$user_id){
		$this->db->trans_start();
		//update the media table
		$this->db->set('is_deleted','1');
		$this->db->where('id',$media_id);
		$this->db->set('updated_at','now()',FALSE);
       	$this->db->update('media');

		//insert the flagged record into the media_deleted
		$this->db->set('media_id',$media_id);
		$this->db->set('user_id',$user_id);
		$this->db->set('created_at','now()',FALSE);
       	$this->db->insert('media_deleted');

		$this->db->trans_complete();
		if($this->db->trans_status() === TRUE){

			$status=array('code'=>0);
			$data=array('status'=>array($status));
			return $data;
		} else {
			$status=array('code'=>4);
			$data=array('status'=>array($status));
			return $data;
		}
	}
	/*retrieve media
	 * $ids media id can be one or an array of media ids
	 * $type search columns by default media, can be wedding and user
	 * $order order by column can be id, created_at
	 * $limit number of rows retrived
	 * $offset offset
	 * $format size depending on the config file
	 * media_type values 1 for photos and 2 for video default photos 3 for both*/
	function get($id,$type='media',$order='media.id desc',$limit=15,$offset=0,$format='all',$media_type='3',$get_all='0'){
		/*Get logged user likes*/
		$user_id=$this->logged_user();
		$dbro=$this->load->database("dbro",TRUE);
		if($type=='wedding'){
			$look_for='media.wedding_id';
		}elseif($type=='user'){
			$look_for='media.user_id';
		}else{
			$look_for='media.id';
		}
		if(is_array($id)){
				$dbro->where_in($look_for,$id);
		} else {
				$dbro->where($look_for,$id);
		}
		if($format<>'all'){
			$dbro->where('media_storage.format',$format);
		}
		if($media_type=='1'){
			$dbro->where('media.media_type','1');
		}elseif($media_type=='2'){
			$dbro->where('media.media_type','2');
		}
		$dbro->where('media.is_deleted','0');
		$dbro->where('media.is_flagged','0');
		//return only media that has publish_step=2
		if($get_all=='0'){$dbro->where('media.publish_step','2');}

		//don't return user profiles
		$dbro->where('media.is_user_profile','0');

		$dbro->join('media_storage','media.id=media_storage.media_id');
		$dbro->join('users','media.user_id=users.id');
		$dbro->join('media as profile_pic','media.user_id=profile_pic.user_id and profile_pic.is_user_profile=1 and profile_pic.is_deleted=0','left outer');
		$dbro->join('media_storage profile_pic_storage','profile_pic.id=profile_pic_storage.media_id and profile_pic_storage.format=\'sqth\'','left outer');

		$dbro->select('media.id,media.likes,media.comments,media.is_user_profile,media.is_wedding_profile,media.wedding_id,media.user_id,users.first_name,users.last_name,media.caption,media.created_at,ifnull(profile_pic_storage.url,\''.$this->config->item('default_profile_pic').'\') as user_profile,if(media.user_id=\''.$user_id.'\',1,0) as allow_delete,media_storage.format,media_storage.url as media_details,media_storage.width,media_storage.height',FALSE);
		$dbro->order_by('id desc');
		if($limit<>0){
			//each media has 4 versions
			if($format=='all'){
				$factor=count($this->config->item('thumb_nails'))+1;
			}else {
				$factor=1;
			}
			$limit=$limit*$factor;
			//old way to do paginaiton where offset is a count of items
			//$offset=$offset*$factor;
			//$dbro->limit($limit,$offset);
			//new way to do pagination where the offset is a media id
			if($offset<>0){
				$dbro->where('media.id <',$offset);
			}
			$dbro->limit($limit);
		}

		$query=$dbro->get('media');
		if($query->num_rows()>0){
			$media_got=$query->num_rows();
			$media=$query->result_array();
			$count=0;
			$data='';
			/*make data array with all media url */

			foreach($media as $tmp){
				if(!is_array($data)){$data=array();
        			$data[0]=$tmp;
					//if($format=='all'){$data[0]['format']='all';}
        			$data[0]['media_details']=array(array('format'=>$tmp['format'],'url'=>$tmp['media_details'],'width'=>$tmp['width'],'height'=>$tmp['height']));
					unset($data[0]['format']);
					unset($data[0]['width']);
					unset($data[0]['height']);
				}
				elseif($data[$count]['id']===$tmp['id']){
        			$data[$count]['media_details']=array_merge($data[$count]['media_details'],array(array('format'=>$tmp['format'],'url'=>$tmp['media_details'],'width'=>$tmp['width'],'height'=>$tmp['height'])));
					unset($data[$count]['format']);
					unset($data[$count]['width']);
					unset($data[$count]['height']);
				}else{
					$count+=1;
					$data[$count]=$tmp;
					//if($format=='all'){$data[$count]['format']='all';}
        			$data[$count]['media_details']=array(array('format'=>$tmp['format'],'url'=>$tmp['media_details'],'width'=>$tmp['width'],'height'=>$tmp['height']));
					unset($data[$count]['format']);
					unset($data[$count]['width']);
					unset($data[$count]['height']);

				}
			}



		if($user_id){
			$dbro->select('media_id as id');
			$dbro->where('user_id',$user_id);
			$user_likes=$dbro->get('likes');
			if($user_likes->num_rows()>0){
				$likes_data=$user_likes->result();
				foreach($likes_data as $row){
					$likes[]=$row->id;
				}
			}else {$likes=array();}
			$dbro->select('wedding_id');
			$dbro->where('user_id',$user_id);
			$dbro->where('(is_admin=\'A\' or is_admin=\'S\')' );
			//$dbro->or_where('is_admin','S');
			$user_admin=$dbro->get('users_weddings');
			if($user_admin->num_rows()>0){
				$admins=$user_admin->result_array();
			}else{$admins=array();}
		}
			/*Check if the media has comments, if it does get the last 3 of them*/

			foreach($data as $item){
				if($user_id){
					if(in_array($item['id'],$likes)){
						$media_like='1';
					}else {
						$media_like='0';
					}
				}else {
						$media_like='0';
					}
				if($user_id){
					if(in_array($item['wedding_id'],$admins)){
						$item['allow_delete']=1;
					}
				}
				if($item['comments']>0){
					$dbro->select('comments.id,comments.comment,comments.media_id,comments.created_at,users.id as user_id,users.first_name,users.last_name,ifnull(media_storage.url,\''.$this->config->item('default_profile_pic').'\')as profile_picture',FALSE);
					$dbro->join('users','users.id=comments.user_id');
					$dbro->join('media','users.id=media.user_id and media.is_user_profile=1 and media.is_deleted=0','left outer');
					$dbro->join('media_storage','media.id=media_storage.media_id and format=\'sqth\'','left outer');
					$dbro->where('comments.media_id',$item['id']);
					$dbro->order_by('id desc');
					$dbro->limit('3');
					$query_comment=$dbro->get('comments');
					if($query_comment->num_rows>0){
						//add default profile picture to the comments
						//$media_comments=array('media_comments'=>$query_comment->result_array());
						//sort the latest 3 comments ascending
						$comments_array=$query_comment->result_array();
						$comments=array();
						foreach($comments_array as $comment){
							$comment['elapsed_time']=$this->_nicetime($comment['created_at'], 0);
							$comments[]=$comment;
						}
						$media_comments=$this->subval_sort($comments,'id');
						$media_comments=array('media_comments'=>$media_comments);
					}else{$media_comments=array('media_comments'=>array());}
				}else{$media_comments=array('media_comments'=>array());}
				$media_result[]=array_merge($item,array('like'=>$media_like,'elapsed_time'=>$this->_nicetime($item['created_at'], $offset)),$media_comments);
			}
		}else{$media_got=0;}
		if($media_got>0){
			$status=array('code'=>'0');
			$result=array('status'=>array($status),'media'=>$media_result);
		}else{
			$status=array('code'=>'4');
			$result=array('status'=>array($status));
		}
		return $result;
	}

	/*flag media --mark the media as is_flagged in the media table
	 * $media_id
	 * $user_id*/
	function flag($media_id,$user_id){
		$this->db->trans_start();
		//update the media table
		$this->db->set('is_flagged','1');
		$this->db->where('id',$media_id);
		$this->db->set('updated_at','now()',FALSE);
       	$this->db->update('media');

		//insert the flagged record into the media_flagged
		$this->db->set('media_id',$media_id);
		$this->db->set('user_id',$user_id);
		$this->db->set('created_at','now()',FALSE);
       	$this->db->insert('media_flagged');

		$this->db->trans_complete();
		if($this->db->trans_status() === TRUE){

			$status=array('code'=>0);
			$data=array('status'=>array($status));
			return $data;
		} else {
			$status=array('code'=>4);
			$data=array('status'=>array($status));
			return $data;
		}
	}
	function publish($media_id,$caption=''){
		$this->db->trans_start();
		//update the media table
		$this->db->set('publish_step','2');
		$this->db->set('caption',$caption);
		$this->db->where('id',$media_id);
		$this->db->set('updated_at','now()',FALSE);
       	$this->db->update('media');
		$this->db->trans_complete();
		if($this->db->trans_status() === TRUE){

			$status=array('code'=>0);
			$data=array('status'=>array($status));
			return $data;
		} else {
			$status=array('code'=>4);
			$data=array('status'=>array($status));
			return $data;
		}
	}
	function _nicetime($media_date, $offset)
	 {
	 	if(empty($media_date)) {
	 		return "No date provided";
	 	}

	 	$periods         = array("s", "m", "h", "d", "w", "Mo", "y");
	 	$lengths         = array("60","60","24","7","4.35","12");

	 	date_default_timezone_set('UTC');

	 	$now             = time();  //+($offset*3600);
	 	$unix_date       = strtotime($media_date);

	 	// check validity of date
	 	if(empty($unix_date)) {
	 		return "Bad date";
	 	}

	 	// is it future date or past date
	 	if($now > $unix_date) {
	 		$difference     = $now - $unix_date;
	 		//echo $now.' '.$unix_date.' '.$offset.' '.$offset*3600;
	 		$tense         = "ago";

	 	} else {
	 		$difference     = $unix_date - $now;
	 		//echo $now.' '.$unix_date.' '.$offset.' '.$offset;
	 		$tense         = "from now";
	 	}

	 	for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {
	 		$difference /= $lengths[$j];
	 	}

	 	$difference = round($difference);
		//make the period plural by adding an s
		/*
	 	if($difference != 1)
	 	{
	 		$periods[$j].= "s";
	 	}
	 	return "$difference $periods[$j] {$tense}";
		*/
		return "$difference$periods[$j]";
	 }
	//sort ascending by a key in an array
	function subval_sort($a,$subkey) {
		foreach($a as $k=>$v) {
			$b[$k] = strtolower($v[$subkey]);
		}
		asort($b);
		foreach($b as $key=>$val) {
			$c[] = $a[$key];
		}
		return $c;
	}
	/*save default wedding media media*/
	function default_wedding_img($wedding_id,$user_id,$default_media_id){
		$this->db->trans_start();
		


		//delete PREVIOUS image is_wedding_profile
		//IF it's one of the default set
		$default_media=$this->config->item('default_wedding');
		$old_profile_media = $this->getCurrentProfileMedia($wedding_id);

		$was_default_media = false;

		foreach ($default_media as $media) {
			if ($old_profile_media == $media['fullweb'])
			{
				$was_default_media = true;
			}
		}


		//reset the previous image that was used as is_wedding_profile 
		$this->db->where('wedding_id',$wedding_id);
		$this->db->where('is_wedding_profile','1');
		$this->db->set('is_wedding_profile','0');

		if ($was_default_media == true)
		{
			$this->db->set('is_deleted','1');
		}

		$this->db->set('updated_at','now()',FALSE);
		$this->db->update('media');


		$this->db->set('user_id',$user_id);
		$this->db->set('wedding_id',$wedding_id);
		$this->db->set('media_type','1');
		$this->db->set('is_wedding_profile','1');
		$this->db->set('created_at','now()',FALSE);
		$this->db->set('publish_step','2');
//		$this->db->set('url',$default_media[$default_media_id]['url']);
		$this->db->insert('media');
		$media_id = $this->db->insert_id();

		$this->db->set('media_id',$media_id);
		$this->db->set('format','original');
		$this->db->set('url',$default_media[$default_media_id]['original']);
		$this->db->set('width', '640');
		$this->db->set('height', '480');		
		$this->db->insert('media_storage');

		$this->db->set('media_id',$media_id);
		$this->db->set('format','sqth');
		$this->db->set('url',$default_media[$default_media_id]['sqth']); //thumb_url
		$this->db->set('width', '92');
		$this->db->set('height', '92');			
		$this->db->insert('media_storage');

		$this->db->set('media_id',$media_id);
		$this->db->set('format','web');
		$this->db->set('url',$default_media[$default_media_id]['web']);
		$this->db->set('width', '254');
		$this->db->set('height', '191');			
		$this->db->insert('media_storage');	

		$this->db->set('media_id',$media_id);
		$this->db->set('format','phone');
		$this->db->set('url',$default_media[$default_media_id]['phone']);
		$this->db->set('width', '640');
		$this->db->set('height', '480');			
		$this->db->insert('media_storage');				

		$this->db->set('media_id',$media_id);
		$this->db->set('format','fullweb');
		$this->db->set('url',$default_media[$default_media_id]['fullweb']);
		$this->db->set('width', '640');
		$this->db->set('height', '480');			
		$this->db->insert('media_storage');	


		$this->db->trans_complete();
		if($this->db->trans_status() === TRUE){

			$status=array('code'=>0);
			$data=array('status'=>array($status));
			return $data;
		} else {
			$status=array('code'=>4);
			$data=array('status'=>array($status));
			return $data;
		}
	}

	function getCurrentProfileMedia($wedding_id)
	{
		$dbro=$this->load->database("dbro",TRUE);

		$dbro->where('media.wedding_id', $wedding_id);

		$dbro->where('media_storage.format','fullweb');

		$dbro->where('media.is_deleted','0');
		$dbro->where('media.is_flagged','0');

		//don't return user profiles
		$dbro->where('media.is_user_profile','0');
		$dbro->where('media.is_wedding_profile','1');

		$dbro->join('media_storage','media.id=media_storage.media_id');

		$dbro->select('media.id, media_storage.url as media_details',FALSE);

		$query=$dbro->get('media');



		if($query->num_rows()>0){
			$media_got=$query->num_rows();
			$media=$query->result_array();

			//echo json_encode($media);

			return $media[0]['media_details'];
		}
	}

	/*check user session with oauth*/
	function logged_user(){
		if($this->config->item('oauth_autenticate')){
			$this->load->library('oauth_resource_server');
			$user_id=$this->oauth_resource_server->is_user();
		}else{
			$user_id=$this->session->userdata('user_id');
		}
		return $user_id;
	}

		/*retrieve media for web , pagination is different than the api
		 * $ids media id can be one or an array of media ids
		 * $type search columns by default media, can be wedding and user
		 * $order order by column can be id, created_at
		 * $limit number of rows retrived
		 * $offset offset from the from_media_id
		 * $format size depending on the config file
		 * media_type values 1 for photos and 2 for video default photos 3 for both
		 * from_media_id */
		function getweb($id,$type='media',$order='media.id desc',$limit=15,$offset=0,$from_media_id=0,$format='all',$media_type='3',$get_all='0'){
			/*Get logged user likes*/
			$user_id=$this->logged_user();
			$dbro=$this->load->database("dbro",TRUE);
			if($type=='wedding'){
				$look_for='media.wedding_id';
			}elseif($type=='user'){
				$look_for='media.user_id';
			}else{
				$look_for='media.id';
			}
			if(is_array($id)){
					$dbro->where_in($look_for,$id);
			} else {
					$dbro->where($look_for,$id);
			}
			if($format<>'all'){
				$dbro->where('media_storage.format',$format);
			}
			if($media_type=='1'){
				$dbro->where('media.media_type','1');
			}elseif($media_type=='2'){
				$dbro->where('media.media_type','2');
			}
			$dbro->where('media.is_deleted','0');
			$dbro->where('media.is_flagged','0');
			//return only media that has publish_step=2
			if($get_all=='0'){$dbro->where('media.publish_step','2');}

			//don't return user profiles
			$dbro->where('media.is_user_profile','0');
			
			//don't return wedding profile pic
			$dbro->where('media.is_wedding_profile','0');

			$dbro->join('media_storage','media.id=media_storage.media_id');
			$dbro->join('users','media.user_id=users.id');
			$dbro->join('media as profile_pic','media.user_id=profile_pic.user_id and profile_pic.is_user_profile=1 and profile_pic.is_deleted=0','left outer');
			$dbro->join('media_storage profile_pic_storage','profile_pic.id=profile_pic_storage.media_id and profile_pic_storage.format=\'sqth\'','left outer');

			$dbro->select('media.id,media.likes,media.comments,media.is_user_profile,media.is_wedding_profile,media.wedding_id,media.user_id,users.first_name,users.last_name,media.caption,media.created_at,ifnull(profile_pic_storage.url,\''.$this->config->item('default_profile_pic').'\') as user_profile,if(media.user_id=\''.$user_id.'\',1,0) as allow_delete,media_storage.format,media_storage.url as media_details,media_storage.width,media_storage.height',FALSE);
			$dbro->order_by('id desc');
			if($from_media_id >0){
				$dbro->where('media.id <=',$from_media_id);
			}
			if($limit<>0){
				//each media has 4 versions
				if($format=='all'){
					$factor=count($this->config->item('thumb_nails'))+1;
				}else {
					$factor=1;
				}
				$limit=$limit*$factor;
				$offset=$offset*$factor;
				$dbro->limit($limit,$offset);
			}

			$query=$dbro->get('media');
			if($query->num_rows()>0){
				$media_got=$query->num_rows();
				$media=$query->result_array();
				$count=0;
				$data='';
				/*make data array with all media url */

				foreach($media as $tmp){
					if(!is_array($data)){$data=array();
	        			$data[0]=$tmp;
						//if($format=='all'){$data[0]['format']='all';}
	        			$data[0]['media_details']=array(array('format'=>$tmp['format'],'url'=>$tmp['media_details'],'width'=>$tmp['width'],'height'=>$tmp['height']));
						unset($data[0]['format']);
						unset($data[0]['width']);
						unset($data[0]['height']);
					}
					elseif($data[$count]['id']===$tmp['id']){
	        			$data[$count]['media_details']=array_merge($data[$count]['media_details'],array(array('format'=>$tmp['format'],'url'=>$tmp['media_details'],'width'=>$tmp['width'],'height'=>$tmp['height'])));
						unset($data[$count]['format']);
						unset($data[$count]['width']);
						unset($data[$count]['height']);
					}else{
						$count+=1;
						$data[$count]=$tmp;
						//if($format=='all'){$data[$count]['format']='all';}
	        			$data[$count]['media_details']=array(array('format'=>$tmp['format'],'url'=>$tmp['media_details'],'width'=>$tmp['width'],'height'=>$tmp['height']));
						unset($data[$count]['format']);
						unset($data[$count]['width']);
						unset($data[$count]['height']);

					}
				}



			if($user_id){
				$dbro->select('media_id as id');
				$dbro->where('user_id',$user_id);
				$user_likes=$dbro->get('likes');
				if($user_likes->num_rows()>0){
					$likes_data=$user_likes->result();
					foreach($likes_data as $row){
						$likes[]=$row->id;
					}
				}else {$likes=array();}
				$dbro->select('wedding_id');
				$dbro->where('user_id',$user_id);
				//$dbro->where('is_admin','A');
				//$dbro->or_where('is_admin','S');
				$dbro->where('(is_admin=\'A\' or is_admin=\'S\')' );
				$user_admin=$dbro->get('users_weddings');
				if($user_admin->num_rows()>0){
					$admins=$user_admin->result_array();
				}else{$admins=array();}
			}
				/*Check if the media has comments, if it does get the last 3 of them*/

				foreach($data as $item){
					if($user_id){
						if(in_array($item['id'],$likes)){
							$media_like='1';
						}else {
							$media_like='0';
						}
					}else {
							$media_like='0';
						}
					if($user_id){
						if(in_array($item['wedding_id'],$admins)){
							$item['allow_delete']=1;
						}
					}
					if($item['comments']>0){
						$dbro->select('comments.id,comments.comment,comments.media_id,comments.created_at,users.id as user_id,users.first_name,users.last_name,ifnull(media_storage.url,\''.$this->config->item('default_profile_pic').'\')as profile_picture',FALSE);
						$dbro->join('users','users.id=comments.user_id');
						$dbro->join('media','users.id=media.user_id and media.is_user_profile=1 and media.is_deleted=0','left outer');
						$dbro->join('media_storage','media.id=media_storage.media_id and format=\'sqth\'','left outer');
						$dbro->where('comments.media_id',$item['id']);
						$dbro->order_by('id desc');
						$dbro->limit('3');
						$query_comment=$dbro->get('comments');
						if($query_comment->num_rows>0){
							//add default profile picture to the comments
							//$media_comments=array('media_comments'=>$query_comment->result_array());
							//sort the latest 3 comments ascending
							$comments_array=$query_comment->result_array();
							$comments=array();
							foreach($comments_array as $comment){
								$comment['elapsed_time']=$this->_nicetime($comment['created_at'], 0);
								$comments[]=$comment;
							}
							$media_comments=$this->subval_sort($comments,'id');
							$media_comments=array('media_comments'=>$media_comments);
						}else{$media_comments=array('media_comments'=>array());}
					}else{$media_comments=array('media_comments'=>array());}
					$media_result[]=array_merge($item,array('like'=>$media_like,'elapsed_time'=>$this->_nicetime($item['created_at'], $offset)),$media_comments);
				}
			}else{$media_got=0;}
			if($media_got>0){
				$status=array('code'=>'0');
				$result=array('status'=>array($status),'media'=>$media_result);
			}else{
				$status=array('code'=>'4');
				$result=array('status'=>array($status));
			}
			return $result;
		}

	/*unflag media --resets the is_flagged to 0 in the media table
	 * and removes the entry in the media_flagged table
	 * will check if the same user and same media before any actions are taken
	 * $media_id
	 * $user_id*/
	function unflag($media_id,$user_id){
		$this->db->trans_start();
		//double check that this user flagged the media
		$this->db->where('media_id',$media_id);
		$this->db->where('user_id',$user_id);
		$was_flagged=$this->db->get('media_flagged');
		
		if($was_flagged->num_rows >0){
			//update the media table
			$this->db->set('is_flagged','0');
			$this->db->where('id',$media_id);
			$this->db->set('updated_at','now()',FALSE);
	       	$this->db->update('media');
	
			//delete the flagged record from the media_flagged
			$this->db->where('media_id',$media_id);
			$this->db->where('user_id',$user_id);
	       	$this->db->delete('media_flagged');
			
			if($this->db->trans_status() === TRUE){
				$this->db->trans_complete();
				$status=array('code'=>0);
				$data=array('status'=>array($status));
				return $data;
			} else {
				$this->db->trans_rollback();
				$status=array('code'=>1);
				$data=array('status'=>array($status));
				return $data;
			}
		}
		else {
			$this->db->trans_rollback();
			$status=array('code'=>4);
			$data=array('status'=>array($status));
			return $data;
		}
	}

	/*undelete media --resets the is_deleted to 0 in the media table
	 * and removes the entry in the media_deleted table
	 * will check if the same user and same media before any actions are taken
	 * $media_id
	 * $user_id*/
	function undelete($media_id,$user_id){
		$this->db->trans_start();
		//double check that this user deleted the media
		$this->db->where('media_id',$media_id);
		$this->db->where('user_id',$user_id);
		$was_deleted=$this->db->get('media_deleted');
		
		if($was_deleted->num_rows >0){
			//update the media table
			$this->db->set('is_deleted','0');
			$this->db->where('id',$media_id);
			$this->db->set('updated_at','now()',FALSE);
	       	$this->db->update('media');
	
			//delete the record from the media_deleted table
			$this->db->where('media_id',$media_id);
			$this->db->where('user_id',$user_id);
	       	$this->db->delete('media_deleted');
			
			if($this->db->trans_status() === TRUE){
				$this->db->trans_complete();
				$status=array('code'=>0);
				$data=array('status'=>array($status));
				return $data;
			} else {
				$this->db->trans_rollback();
				$status=array('code'=>1);
				$data=array('status'=>array($status));
				return $data;
			}
		}
		else {
			$this->db->trans_rollback();
			$status=array('code'=>4);
			$data=array('status'=>array($status));
			return $data;
		}
	}

}
?>
