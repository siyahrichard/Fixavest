<?php
class ConvStat
{
	
	var $uid=null;
	var $conversation=null;
	var $lastReceive=null;
	var $lastSeen=null;
	
	public static $table='conestat';
	
	public function __construct( $uid,$conversation=0,$receive=0,$seen=0)
	{
		$this->uid=$uid; $this->conversation=$conversation; $this->lastReceive=$receive; $this->lastSeen=$seen;
	}
	
	public static function install()
	{
		global $defdb;
		$table=ConvStat::$table;
		
		$q="create table if not exists $table(uid_fl varchar(20) primary key,lrec_fl int)";
		$defdb->run($q);
		
		$q="create table if not exists seen_$table(conv_fl int,uid_fl varchar(20),lseen_fl int,constraint irec_$table unique(conv_fl,uid_fl))";
		$defdb->run($q);
		
		$q="create table if not exists conv_$table(id_fl int primary key auto_increment,uid1_fl varchar(20),uid2_fl varchar(20))";
		$defdb->run($q);
	}
	public static function status( $uid, $conversation, $callback)
	{
		global $defdb;
		$table=ConvStat::$table;
		$ret=new ConvStat($uid);
		if($conversation){
			$ret->conversation=$conversation;
			$q="select lseen_fl from seen_$table where uid_fl='$uid' and conv_fl=$conversation limit 1";
			$defdb->run($q);
			if($r=$defdb->fetch()){
				$ret->lastSeen=$r['lseen_fl'];
			}
		}
		
		$q="select lrec_fl from $table where uid_fl='$uid' limit 1";
		$defdb->run($q);
		if($r=$defdb->fetch()){
			$ret->lastReceive=$r['lrec_fl'];
		}
		return $ret;
	}
	public static function update( $moment, $uid, $conversation)
	{
		global $defdb;
		$table=ConvStat::$table;
		
		if($conversation){
			//update lseen_fl on seen table
			$q="select * from seen_$table where conv_fl=$conversation and uid_fl='$uid' and lseen_fl>$moment limit 1";
			$defdb->run($q);
			if($r=$defdb->fetch()){}
			else{
				$q="insert into seen_$table (conv_fl,uid_fl,lseen_fl)values($conversation,'$uid',$moment) on duplicate key update lseen_fl=$moment";
				$defdb->run($q);
			}
		}else{
			//update lrec_fl
			$q="select * from $table where uid_fl='$uid' and lrec_fl>$moment limit 1";
			$defdb->run($q);
			if($r=$defdb->fetch()){}
			else{
				$q="insert into $table (uid_fl,lrec_fl)values('$uid',$moment) on duplicate key update lrec_fl=$moment";
				$defdb->run($q);
			}
		}
	}
	public static function get( $uid1, $uid2)
	{
		global $defdb;
		$table=ConvStat::$table;
		
		$q="select id_fl from conv_$table where (uid1_fl='$uid1' and uid2_fl='$uid2') or (uid1_fl='$uid2' and uid2_fl='$uid1') limit 1";
		$defdb->run($q);
		if($r=$defdb->fetch()){
			return $r['id_fl'];
		}else{
			$q="insert into conv_$table (uid1_fl,uid2_fl)values('$uid1','$uid2')";
			$defdb->run($q);
			return $defdb->auto_increment;
		}
	}
}
?>