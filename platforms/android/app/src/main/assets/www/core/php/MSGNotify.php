<?php
class MSGNotify
{
	
	var $uid=null;
	var $conv=null;
	var $count=null;
	
	public static $table='msg_notify';
	
	public function __construct( $uid, $conv, $count)
	{
		$this->uid=$uid; $this->conv=$conv; $this->count=$count;
	}
	
	public static function install()
	{
		global $defdb;
		$table=MSGNotify::$table;
		
		$q="create table if not exists $table(uid_fl varchar(20),conv_fl varchar(20),cnt_fl int,constraint i$table unique(uid_fl,conv_fl))";
		$defdb->run($q);
	}
	public static function set( $uid, $conv, $count)
	{
		global $defdb;
		$table=MSGNotify::$table;
		$q="insert into $table (uid_fl ,conv_fl ,cnt_fl )values( '$uid', '$conv', $count) on duplicate key update cnt_fl=cnt_fl+1";
		$defdb->run($q);
	}
	public static function get( $uid, $callback=null)
	{
		global $defdb;
		$table=MSGNotify::$table;
		$q="select conv_fl,cnt_fl from $table where uid_fl='$uid'";
		$defdb->run($q);
		$ret=array();
		while($r=$defdb->fetch())
		{
			array_push($ret,new MSGNotify($uid,$r['conv_fl'],$r['cnt_fl']));
		}
		return $ret;
	}
	public static function remove( $uid, $conv)
	{
		global $defdb;
		$table=MSGNotify::$table;
		$q="delete from $table where uid_fl='$uid' and conv_fl='$conv'"; $defdb->run($q);
	}
}
?>