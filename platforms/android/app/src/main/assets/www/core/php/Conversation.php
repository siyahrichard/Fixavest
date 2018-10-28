<?php
class Conversation
{
	
	var $uid=null;
	var $title=null;
	var $picture=null;
	var $id=null;
	
	public static $listo=null;
	public static $activeObject=null;
	public static $showingContact=0;
	public static $allUIDs=null;
	public static $contactIndex=0;
	public static $activeParam=null;
	public static $startCallback=null;
	public static $db=null;
	public static $convOS=null;
	public static $msgOS=null;
	public static $audIconPopup=null;
	public static $server='';
	public static $serverSession='';
	
	public function __construct( $uid, $title, $picture)
	{
		
	}
	
	public static function get( $arg, $last)
	{
		global $defdb;
		$table=CMessage::$table;
		$tcond="and (mod_fl>'$last' or mom_fl>'$last')";
		$q="select from_fl,count(*) as cnt_fl,max(mom_fl) as mx from $table left join e$table on e$table.id_fl=$table.id_fl where to_fl='$arg' $tcond group by from_fl order by max(mom_fl) desc";
		$defdb->run($q);
		$ret=array();
		while($r=$defdb->fetch()){
			$tmp=new stdClass();
			$tmp->uid=$r['from_fl']; $tmp->count=$r['cnt_fl']; $tmp->time=$r['mx'];
			array_push($ret,$tmp);
		}
		return $ret;
	}
}
?>