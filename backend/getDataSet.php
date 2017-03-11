<?php

//dd array will anclude all data
// $data = array();
 
if(isset($_POST)) { 
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	$value = $request->value;
	//dd return as JSON string
	echo file_get_contents($value.".json");
}

?>