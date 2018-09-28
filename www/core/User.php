<?php
class User
{
	
	var $uid=null;
	var $username=null;
	var $email=null;
	var $password=null;
	var $phone=null;
	var $link=null;
	var $question=null;
	var $profile=null;
	var $loginName=null;
	var $region='http://localhost/projects/kelvok/';
	var $country=null;
	var $verified=null;
	
	public static $availableCallback=null;
	public static $activeObject=null;
	public static $panelPath='panel/';
	public static $currentUID=null;
	public static $fingerPrint=null;
	public static $autoRenew=true;
	public static $renewLookupeeDelay=120;
	public static $staticCertRequest=false;
	public static $forwardUrl=null;
	public static $currentAppKey=null;
	public static $currentPrefix=null;
	
	public function __construct($id=0,$username=null,$email=null,$phone=null,$password=null,$link=0,$profile=null, $country=null)
	{
		
		$this->id=$id; $this->username=$username; $this->email=$email; $this->phone=$phone; $this->password=$password; $this->profile=$profile;
		$this->country=$country;
	}
	
	public static function register($user)
	{
		$prefix="jtaht";
		while($prefix=="jtaht"){
			$a=UniversalServer::getServer(0);
			$auth=$a[rand(0,count($a)-1)];
			$prefix=$auth->prefix;
		}
		$url=$auth->url."client/user/register/?user=".rawurlencode($user->username)."&email=".rawurlencode($user->email)."&country=$user->country&phone=$user->phone&pass=".rawurlencode($user->password);
		$ch=curl_init($url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$res=curl_exec($ch);
		curl_close($ch);
		return $res;
	}
	public static function available($user,$email=null,$phone,$country=98)
	{
		
		$servers=UniversalServer::getServer(0);
		$ret=0;
		foreach($servers as $server)
		{
		    $url=$server->url;
		    $q=$user?"&user=&user":"";
		    $q=$email?"&email=$email":"";
		    if($phone){
		    	$q.="&country=$country&phone=$phone";
		    }
		    $url.="client/user/available/?avail&$q";
		    $ch=curl_init($url);
		    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		    $res=curl_exec($ch);
		    $ret|=intval($res);
		    curl_close($ch);
		}
		return $ret;
	}
	public static function login($loginName,$password, $country=null)
	{
		if($f=User::checkFlag($loginName))
		{
		    $server=UniversalServer::getServer(0,$f);
		}
		else
		{
		    $server=User::findServer($loginName);
		    
		}
		User::flag($loginName,$server->prefix);
		$ch=curl_init($server->url."client/user/auth/?loginName=".rawurlencode($loginName)."&pass=".rawurlencode($password).($country?"&country=$country":''));
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$res=curl_exec($ch);
		$http_code=curl_getinfo($ch,CURLINFO_HTTP_CODE);
		curl_close($ch);
		if($http_code==200)
		{
		    if($res!="error"){
			    if($data=json_decode($res)){
			    	$_SESSION['user_data']=$res;
			    	if(isset($_REQUEST['fp']))User::setLookupee($_REQUEST['fp'],$data->uid);
			    }else return "unable";
		    }
		    return $res;
		}
		else
		{
		    return "unable";
		}
	}
	public static function parseArray($obj)
	{
		$user=new User();
		if(isset($obj['uid']))$user->uid=$obj['uid'];
		if(isset($obj['username']))$user->username=$obj['username'];
		if(isset($obj['email']))$user->email=$obj['email'];
		if(isset($obj['phone']))$user->phone=$obj['phone'];
		if(isset($obj['country']))$user->country=$obj['country'];
		if(isset($obj['verified']))$user->verified=$obj['verified'];
		if(isset($obj['profile']))$user->profile=Profile::parseArray($obj['profile']);
		return $user;
	}
	public static function flag($loginName,$prefix)
	{
		$ln=str_replace(".","___",$loginName);
		setcookie($ln."_kvk_flag",$prefix,time()+2592000,"/"); //set cookie for 1 month
		User::$currentPrefix=$prefix; //keep the prefix in the remaining parts of the request
	}
	public static function checkFlag($loginName)
	{
		$ln=str_replace(".","___",$loginName);
		if(isset($_COOKIE[$ln.'_kvk_flag']))return $_COOKIE[$ln.'_kvk_flag'];
		else if(User::$currentPrefix) return User::$currentPrefix;
		return null;
	}
	public static function findServer($loginName)
	{
		$servers=UniversalServer::getServer(0);
		foreach($servers as $server)
		{
		    $url=$server->url;
		    $url.="client/user/available/?loginName=$loginName";
		    $ch=curl_init($url);
		    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		    $res=curl_exec($ch);
		    curl_close($ch);
		    User::$currentUID=$res;
		    if(intval($res)>0)return $server;
		}
		return false;
	}
	public static function isLogin()
	{
		if(isset($_SESSION['user_data']))
		{
		    $user_arr=json_decode($_SESSION['user_data'],true);
		    $user= User::parseArray($user_arr);
		    $user->loginName=$_SESSION['loginName'];
		    return $user;
		}
		return false;
	}
	public static function logout()
	{
		unset($_SESSION['user_data']);
		session_destroy();
	}
	public static function verify($userData=null)
	{
		
		if($userData)
		{
		    if(isset($_SESSION['forwardUrl']))
		    {
		        if(isset($_SESSION['apsi']))
		        {
		        	$network=isset($_COOKIE['network'])?$_COOKIE['network']:null;
		            $cert=User::getCert($userData->loginName,$userData->uid,$_SESSION['apsi'],'en',$network);
		            $hub=User::checkFlag($userData->loginName);//returns hub lable
		            header("location:{$_SESSION['forwardUrl']}?cert=$cert&hub=$hub");
		        }
		        else
		        {
		            header("location:{$_SESSION['forwardUrl']}?uid=$userData->uid");
		        }
		        unset($_SESSION['forwardUrl']);
		        unset($_SESSION['apsi']);
		        die();
		    }
		}
		else
		{
		    if(isset($_GET['forwardUrl']))
		    {
		      $_SESSION['forwardUrl']=$_GET['forwardUrl'];
		      if(isset($_GET['apsi']))$_SESSION['apsi']=$_GET['apsi'];
		      return $_GET['forwardUrl'];
		    }
		    else
		    {
		        if(isset($_SESSION['forwardUrl']))
		        {
		            unset($_SESSION['forwardUrl']);
		            unset($_SESSION['apsi']);
		        }
		    }
		}
		return "";
	}
	public static function getCert( $loginName, $uid, $apsi, $lang, $network=null, $domain=null)
	{
		
		if($pre=User::checkFlag($loginName))
		{
		    $server=UniversalServer::getServer(0,$pre);
		}
		else
		{
		    $server=User::findServer($loginName);
		}
		$apsi=rawurlencode($apsi);
		$url=$server->url."client/cert/generate/?uid=$uid&apsi=$apsi&lang=$lang&domain=$domain&secret=".rawurlencode(jtc_secret).
			(User::$staticCertRequest?"&static=1":'');
		if($network)$url.="&network=$network";
		$ch=curl_init($url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$cert=curl_exec($ch);
		curl_close($ch);
		return $cert;
	}
	public static function changePassword($oldPass,$newPass)
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
		User::flag($loginName,$server->prefix);
		$ch=curl_init($server->url."client/user/chpass/?loginName=".rawurlencode($loginName)."&oldPass=".rawurlencode($oldPass)."&newPass=".rawurlencode($newPass));
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$res=curl_exec($ch);
		$http_code=curl_getinfo($ch,CURLINFO_HTTP_CODE);
		curl_close($ch);
	}
	public static function updateLogin( $uid, $username=null, $email=null, $phone=null, $country=null)
	{
		$loginName=$_SESSION['loginName'];
		if($f=User::checkFlag($loginName)){
			$server=UniversalServer::getServer(0,$f);
			$url=$server->url."client/user/updateLogin/?uid=$uid";
			if($username)$url.="&username=$username";
			if($email)$url.="&email=$email";
			if($phone)$url.="&phone=$phone&country=$country";
			$cnt=file_get_contents($url);
		}
	}
	public static function setLookupee( $fp, $uid)
	{
		setcookie("fp",$fp,time()+84000,"/");
		global $region_exts;
		$parts=explode(".",$_SERVER['HTTP_HOST']);
		$extention=end($parts);
		$region=array_search($extention,$region_exts);
		$ip=ip2long($_SERVER['REMOTE_ADDR']);
		$ch=curl_init(Lookup_Url."client/RegionLookup/save/?ip=$ip&fp=$fp&uid=$uid&region=$region");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_exec($ch);
		curl_close($ch);
	}
	public static function renewLookupee( $fp)
	{
		setcookie("fp",$fp,time()+84000,"/");
		$ip=ip2long($_SERVER['REMOTE_ADDR']);
		$ch=curl_init(Lookup_Url."client/RegionLookup/renew/?ip=$ip&fp=$fp");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_exec($ch);
		curl_close($ch);
	}
	public static function getLookupee( $fp)
	{
		global $region_exts;
		$ip=ip2long($_SERVER['REMOTE_ADDR']);
		$ch=curl_init(Lookup_Url."client/RegionLookup/read/?ip=$ip&fp=$fp\n");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		$res=curl_exec($ch);
		curl_close($ch);
		
		if($lookupee=json_decode($res)){
			$parts=explode(".",$_SERVER['HTTP_HOST']);
			$extention=end($parts);
			$region=array_search($extention,$region_exts);
			
			if($lookupee->region!=$region){
				$url="http://jointab.".$region_exts[$lookupee->region];//."/?".http_build_query($_GET,'',"&");
				return $url;
			}
		}
		return "";
	}
	public static function expireLookupee( $fp)
	{
		$ip=ip2long($_SERVER['REMOTE_ADDR']);
		$ch=curl_init(Lookup_Url."client/RegionLookup/expire/?ip=$ip&fp=$fp");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
		curl_exec($ch);
		curl_close($ch);
	}
	public static function saveSCertReq( $fp, $key)
	{
		$user=User::isLogin();
		if($user){
			$prefix=User::checkFlag($user->loginName);
			$server=UniversalServer::getServer(0,$prefix);
			if($server){
				$url="{$server->url}client/scertrequest/save/?uid=$user->uid&key=$key&fp=$fp&secret=".rawurlencode(jtc_secret);
				 file_put_contents("requestSCert.txt",$url);
				$ch=curl_init($url);
				curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
				$res=curl_exec($ch);
				curl_close($ch);
				//return $res;
				return $prefix;
			}
		}
		return "";
	}
}
?>