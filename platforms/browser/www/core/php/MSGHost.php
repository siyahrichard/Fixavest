<?php
class MSGHost
{
	
	var $host=null;
	var $client=null;
	var $option=null;
	
	public static $table='msghost';
	
	public static function get( $uid, $conv, $callback=null)
	{
		global $defdb;
		$table=MSGHost::$table;
		
		$host=$uid;
		preg_match("/[a-z]+/",$conv,$match);
		$side_server=UniversalServer::getServer(7,$match[0]);
		
		$q="select host_fl from $table where host_fl='$conv' or client_fl='$conv' limit 1";
		$defdb->run($q);
		
		if($r=$defdb->fetch()){
			$host=$r['host_fl'];
		}else{
			$this_server_hosted=intval(MSGHost::getCount());
			$ch=curl_init($side_server->url."client/MSGHost/getCount/");
			curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
			$side_server_hosted=intval(curl_exec($ch));
			curl_close($ch);
			if($this_server_hosted<$side_server_hosted){
				MSGHost::set($uid,$conv);
			}else{
				$ch=curl_init($side_server->url."client/MSGHost/set/?host=$conv&client=$uid&secret=");
				curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
				curl_exec($ch);
				curl_close($ch);
				MSGHost::set($conv,$uid);
				$host=$conv;
			}
		}
		
		if($host!=$uid){
			$s=
				RemoteSession::get($side_server->url,$uid,$side_server->prefix);//url,uid,host
			return $side_server->url.",".$s;
		}else{
			return "";
		}
	}
	public static function set( $host, $client)
	{
		global $defdb;
		$table=MSGHost::$table;
		$q="insert ignore into $table (host_fl,client_fl)values('$host','$client')";
		$defdb->run($q);
	}
	public static function install()
	{
		global $defdb;
		$table=MSGHost::$table;
		
		$q="create table if not exists $table(host_fl varchar(20),client_fl varchar(20),opt_fl tinyint,constraint i$table unique(host_fl,client_fl))";
		$defdb->run($q);
	}
	public static function getCount()
	{
		global $defdb;
		$table=MSGHost::$table;
		$q="select count(*) as cnt_fl as $table";
		$defdb->run($q);$r=$defdb->fetch();
		return $r['cnt_fl'];
	}
	public static function setOption( $uid, $conv, $option,$seto=true)
	{
		global $defdb;
		$table=MSGHost::$table;
		if($seto)
			$q="update $table set opt_fl=opt_fl|$option where (host_fl='$uid' and client_fl='$conv') or (host_fl='$conv' and client_fl='$uid') limit 1";
		else
			$q="update $table set opt_fl=((opt_fl|$option) ^ $option) where (host_fl='$uid' and client_fl='$conv') or (host_fl='$conv' and client_fl='$uid') limit 1";
		$defdb->run($q);
	}
	public static function getAvailable( $uid)
	{
		global $defdb;
		$table=MSGHost::$table;
		$q="select client_fl as conv_fl from $table where host_fl='$uid' and opt_fl&1=0 union select host_fl as conv_fl from $table where client_fl='$uid' and opt_fl&1=0";
		$defdb->run($q);
		$ret=array();
		while($r=$defdb->fetch()){
			array_push($ret,$r['conv_fl']);
		}
		return $ret;
	}
}
?>