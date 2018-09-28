<?php
class Profile
{
	
	var $uid=null;
	var $firstName=null;
	var $middleName=null;
	var $lastName=null;
	var $birthDate=null;
	var $gender=null;
	var $permision=null;
	var $picture=null;
	var $cover=null;
	var $ccard=null;
	
	public static $net=null;
	public static $activePrefix=null;
	
	public function __construct($uid=null,$fname=null,$mname=null,$lname=null,$birth='0/0/0',$gender='2',$permision='255',$picture='null',$cover='null')
	{
		$this->uid=$uid; $this->firstName=$fname; $this->middleName=$mname; $this->lastName=$lname; $this->birthDate=$birth; $this->gender=$gender; $this->permision=$permision;
		$this->picture=$picture; $this->cover=$cover; $this->ccard="";
	}
	
	public static function save($o)
	{
		
		@session_start();
		$loginName=$_SESSION['loginName'];
		if($f=User::checkFlag($loginName))
		{
		    $server=UniversalServer::getServer(0,$f);
		}
		else
		{
		    $server=User::findServer($loginName);
		    
		}
		$f=rawurlencode($o->firstName);
		$m=rawurlencode($o->middleName);
		$l=rawurlencode($o->lastName);
		$b=rawurlencode($o->birthDate);
		$pic=rawurlencode($o->picture);
		$c=rawurlencode($o->cover);
		if($o->ccard)$ccard=rawurlencode($o->ccard); else $ccard="";
		$ch=curl_init($server->url."client/profile/save/?uid=$o->uid&firstName=$f&middleName=$m&lastName=$l&birth=$b&gender=$o->gender&permision=$o->permision&picture=$pic&cover=$c&ccard=$ccard");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$res=curl_exec($ch);
		$http_code=curl_getinfo($ch,CURLINFO_HTTP_CODE);
		curl_close($ch);
		if($http_code==200)
		{
		    echo $res;
		}
		else
		{
		    return "error";
		}
	}
	public static function parseArray($obj)
	{
		$profile=new Profile();
		if(isset($obj['uid']))$profile->uid=$obj['uid'];
		if(isset($obj['permision']))$profile->permision=$obj['permision'];
		if(isset($obj['fName']))$profile->firstName=$obj['fName'];
		if(isset($obj['mName']))$profile->middleName=$obj['mName'];
		if(isset($obj['lName']))$profile->lastName=$obj['lName'];
		if(isset($obj['pic']))$profile->picture=$obj['pic'];
		if(isset($obj['cover']))$profile->cover=$obj['cover'];
		if(isset($obj['birthDate']))$profile->birthDate=$obj['birthDate'];
		if(isset($obj['gender']))$profile->gender=$obj['gender'];
		if(isset($obj['ccard']))$profile->ccard=$obj['ccard'];
		//if(isset($obj['phone']))$profile->phone=$obj['phone'];
		//if(isset($obj['country']))$profile->country=$obj['country'];
		return $profile;
	}
}
?>