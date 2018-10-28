<?php
class RemoteSession
{
	
	var $uid=null;
	var $host=null;
	var $session=null;
	
	public static $table='r_session';
	
	public static function install()
	{
		global $defdb;
		$table=RemoteSession::$table;
		
		$q="create table if not exists $table(uid_fl varchar(20) primary key,host_fl varchar(5),ses_fl varchar(70))";
		$defdb->run($q);
	}
	public static function get( $url, $uid, $host)
	{
		global $defdb;
		$table=RemoteSession::$table;
		$q="select ses_fl from $table where uid_fl = '$uid' and host_fl='$host' limit 1";
		$defdb->run($q);
		$ses="";
		if($r=$defdb->fetch()){
			$ses=$r['ses_fl'];
		}
		
		$ch=curl_init($url."client/RemoteSession/validate/?uid=$uid&ses=$ses&secret=".serverSecret); //validate or create
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		$ses2=curl_exec($ch);
		curl_close($ch);
		
		if($ses2!=$ses){
			$ses=$ses2;
			$q="insert into $table (uid_fl ,host_fl ,ses_fl )values( '$uid', '$host', '$ses') on duplicate key update ses_fl ='$ses'";
			$defdb->run($q);
		}
		return $ses;
	}
	public static function validate( $uid, $ses)
	{
		if($ses){
			session_id($ses);
			session_start();
			if(isset($_SESSION['uniuid'])){
				if($_SESSION['uniuid']==$uid)return $ses;
				else{
					session_destroy();
					session_start();
				}
			}
		}else session_start();
		
		$_SESSION['uniuid']=$uid;
		$_SESSION['unidata']="{"."\"uid\":\"$uid\""."}";
		return session_id(); //return new session id
	}
}
?>