<?php

function getKeywords()
{
	if($_GET['stringToPass'])
		$stingOfShitYo = $_GET['stringToPass'];
	else
		return;
	$url = 'http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction';
	$post = "query=tool&appid=hack&context=".rawurlencode($stringOfShitYo);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
	$xml = simplexml_load_string(curl_exec($ch));
	curl_close($ch);
	$tempStringOfEvenMoreShitYo;
	foreach($xml->children() as $child)
	{
		$tempStringOfEvenMoreShitYo = $tempStringOfEvenMoreShitYo.' '.$child;	
	}
	$status=array('code'=>0,'text'=>"OK");
	$data=array('status'=>array($status),'text'=>$tempStringOfEvenMoreShitYo);
	
	return_json($data);
}
getKeywords();

?> 
