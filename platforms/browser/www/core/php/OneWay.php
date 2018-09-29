<?php
class OneWay
{
	
	public static $address=null;
	public static $appId=null;
	public static $uid=null;
	
	public static function log( $msg, $sub)
	{
		$msg=new CMessage($sub,$msg,'',OneWay::$uid,0,OneWay::$appId,date("Y-m-j h:i:s"));
		CMessage::send($msg,OneWay::$address);
	}
}
?>