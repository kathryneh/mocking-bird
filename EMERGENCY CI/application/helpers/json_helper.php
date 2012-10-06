<?php
/*json helper*/

    /* format_api_status
     * formats the status output to be an array containing code, severity and text 
     * input param is status(array of statuses)
     * 
     * */
	function format_api_status($data){
		
		foreach($data['status'] as $status){
			if($status['code']==0){
				//check if the severity was set
				if(!isset($status['sev'])){
					$status['sev']='I';
				}
				
				//check if the text was set
				if(!isset($status['text'])){
					$status['text']='ok';
				}
			}
			if($status['code']==1){
				//check if the severity was set
				if(!isset($status['sev'])){
					$status['sev']='E';
				}
				
				//check if the text was set
				if(!isset($status['text'])){
					$status['text']='request fail please try again';
				}
			}
			if($status['code']==2){
				//check if the severity was set
				if(!isset($status['sev'])){
					$status['sev']='E';
				}
				
				//check if the text was set
				if(!isset($status['text'])){
					$status['text']='not authenticated';
				}
			}
			if($status['code']==3){
				//check if the severity was set
				if(!isset($status['sev'])){
					$status['sev']='E';
				}
				//check if the text was set
				if(!isset($status['text'])){
					$status['text']='not authorized';
				}
			}
			
			if($status['code']==4){
				//check if the severity was set
				if(!isset($status['sev'])){
					$status['sev']='I';
				}
				
				//check if the text was set
				if(!isset($status['text'])){
					$status['text']='no data found';
				}
			}
			
			if($status['code']==5){
				//check if the severity was set
				if(!isset($status['sev'])){
					$status['sev']='W';
				}
				
				//check if the text was set
				if(!isset($status['text'])){
					$status['text']='input parameters error';
				}
			}
			
			//set the data's status
			$data['status']=array($status);
		}
		
		return $data;
	}