<?php
class FSMessage
{
	
	var $subject=null;
	var $value=null;
	var $data=null;
	var $receiver=null;
	var $senderApp=null;
	var $receiverApp=0;
	var $moment=null;
	var $id=null;
	var $options=null;
	var $originalXml=null;
	var $sender=null;
	
	public static $defaultSenderApp=0;
	
	public function __construct($subject,$value,$sender,$receiver,$senderApp,$receiverApp,$moment,$options,$id)
	{
		
	}
}
?>