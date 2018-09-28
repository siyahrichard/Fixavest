<?php
class UniversalConnection
{
	
	var $uid=null;
	var $region=null;
	var $systemUrl=null;
	var $data=null;
	
	public static $defaultRegion='http://jointab.com/';
	public static $authType=1;
	public static $dataType='json';
	public static $appkey='NQ==_dc76a491afa8333129d11eb57b433c4c';
	public static $appkeyType='apsi';
	public static $flag=null;
	
	public function __construct($force=true,$systemUrl=null)
	{
		if(isset($_GET['getApsi'])){echo UniversalConnection::$appkey; die();}//maybe unsecure
		if(session_id()=='')@session_start();
		$this->systemUrl=($systemUrl)?$systemUrl:"http".(!empty($_SERVER['HTTPS'])?"s":"")."://".$_SERVER['SERVER_NAME'].$_SERVER['REQUEST_URI'];
		//hide certification from url
		$this->systemUrl=preg_replace("/cert\=[a-z\d]+\&*|hub=[a-z]+\&*/i","",$this->systemUrl);
		if(strstr($this->systemUrl,"?"))
		{
			preg_match("/(https*:\/\/[\/\w\d\._-]+)\?/",$this->systemUrl,$match);
			$this->systemUrl=$match[1];
		}
		if(isset($_GET['fromJointab'])){
			preg_match('/^https*\:\/\/[\w_\.\-]+\.\w+/',$_SERVER['HTTP_REFERER'],$m);
			$this->region=$m[0];
			$_SESSION['jointabRegion']=$this->region;
		}else if(isset($_SESSION['jointabRegion'])){
			$this->region=$_SESSION['jointabRegion'];
		}else $this->region=UniversalConnection::$defaultRegion;
		
		preg_match('/(\w+)\.(\w+)\/*$/',$this->region,$match);
		if($match[1]=='jointab' && in_array($match[2],['com','net','org','ir','space','biz'])){
			//ok
		}else{
			die('invalid region.');
		}
		
		$this->data=null;
		if(isset($_GET['unilogout']))
		{
		    unset($_SESSION['unidata']);
		    unset($_SESSION['uniuid']);
		    session_destroy();
		}
		else if(isset($_SESSION['unidata']))
		{
		    if(UniversalConnection::$dataType=="json")
		    {
		        $this->data=json_decode($_SESSION['unidata'],true);
		        $this->uid=$this->data['uid'];
		    }
		    if(isset($_REQUEST['uniUserData'])){
		    	echo $_SESSION['unidata'];
		    	die();
		    }
		}
		else if(isset($_SESSION['uniuid']))
		{
			$this->uid=$_SESSION['uniuid'];
		}
		else if(isset($_GET['cert']) && !isset($_REQUEST['appkey'])) //otherwise let autRemoteMothod
		{
		    $this->data=$this->checkCert();
		    $this->uid=$this->data['uid'];
		    $closeScript="";
		    if(isset($_SESSION['closeAfterLogin'])){
		    	unset($_SESSION['closeAfterLogin']);
		    	$closeScript="<script type=\"text/javascript\">window.close();</script>";
		    }
		    if(!$closeScript)header("location: $this->systemUrl"); //try to hide certification
		    die($closeScript);
		}
		else if(!UniversalConnection::$appkey && isset($_GET['uid']))
		{
		    $this->uid=$_GET['uid'];
		    $_SESSION['uniuid']=$this->uid;
		}
		else if($force || isset($_GET['unilogin']))
		{
		    $this->login();
		}else if(isset($_GET['uniParam'])){
			$this->flag=$_GET['uniParam'];
			$this->login(); //implements flag to registor on google or live
		}
		UniversalConnection::sessionJob();//maybee unsecure
		if(isset($_GET['token']))
		{
		    $token=$_GET['token'];
		    if($token!=$this->token)
		    {
		        $this->logout();
		    }
		}
		
		if($this->data)
		{
		    $this->uid=$this->data['uid'];
		}
	}
	
	public function login()
	{
		$partner=""; $hash="";
		if($this->flag=="register"){
			$hash="#register";
		}else{
			$partner="&parnet=".$this->flag;
		}
		if(isset($_REQUEST['closeAfterLogin']))$_SESSION['closeAfterLogin']=1;
		if($this->region)
		{
		    if(UniversalConnection::$appkey)
		        header("location: ".$this->region."?apsi=".rawurlencode(UniversalConnection::$appkey)."&auth=".UniversalConnection::$authType."&forwardUrl=".rawurlencode($this->systemUrl).$param.$hash);
		    else
		        header("location: ".$this->region."?auth=".UniversalConnection::$authType."&forwardUrl=".rawurlencode($this->systemUrl).$param.$hash);
		    die();
		}
	}
	public function logout()
	{
		
		@session_start();
		unset($_SESSION['uniuid']);
		unset($_SESSION['uniregion']);
		unset($_SESSION['unitoken']);
		unset($_SESSION['unilang']);
		unset($_SESSION['unidevice']);
		unset($_SESSION['uniprofile']);
		@session_destroy();
	}
	
	public static function checkCert($staticMode=false,$getSession=false, $appkey=null)
	{
		
		$server=UniversalServer::getServer(0,$_GET['hub']);
		$url=$server->url."client/cert/getData/?apsi=".rawurlencode(UniversalConnection::$appkey)."&cert=".rawurlencode($_GET['cert'])."&dataType=".UniversalConnection::$dataType.
		($staticMode?"&static=1":"");
		
		$ch=curl_init($url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$res=curl_exec($ch);
		curl_close($ch);
		
		if(UniversalConnection::$dataType=="json")
		{
			if($res){
			    $_SESSION['unidata']=$res;
			    $arr=json_decode($res,true);
			    if($getSession && ($appkey==UniversalConnection::$appkey))return session_id(); //session id for mobile app
			    else return $arr; //user data to use in server app
			}else{
				die("Login certification Expired - retry to login");
			}
		}
	}
	public static function getButton($obj)
	{
		
		$btn="<div style=\"position:relative;%all_pointer%\" %all_click%><span style=\"position:absolute;top:0px;left:0px;background-color:#1a1a1a;color:white;line-height:30px;padding:2px 10px 2px 80px;font-size:18px;\">%cnt%</span><img style=\"position: absolute; top:0px;left:10px\" src=\"http://kvk.jointab.com/res/userButton.png\"/></div>";
		
		if($obj->uid)
		{
		    $name=$obj->data['username'];
		    if($obj->data['profile'])
		        if($obj->data['profile']['fName']!="")
		            $name=$obj->data['profile']['fName']." ".$obj->data['profile']['lName'];
		    $cnt="<span>$name&nbsp;&nbsp;</span><span onclick=\"window.location.href='$obj->systemUrl?unilogout'\" style=\"cursor:pointer\">Logout</span>";
		    $btn=str_replace("%all_pointer%","",$btn);
		    $btn=str_replace("%all_click%","",$btn);
		    $btn=str_replace("%cnt%",$cnt,$btn);
		}
		else
		{
		    $cnt="<span>Login</span>";
		    $btn=str_replace("%all_pointer%","cursor:pointer",$btn);
		    $btn=str_replace("%all_click%","onclick=\"window.location.href='$obj->systemUrl?unilogin'\"",$btn);
		    $btn=str_replace("%cnt%",$cnt,$btn);
		}
		
		return $btn;
	}
	public static function sessionJob()
	{
		if(isset($_SERVER['HTTP_REFERER'])){
			if(preg_match("/\.jointab\.(com|net|org)/i",$_SERVER['HTTP_REFERER']) and isset($_REQUEST['authSession']))
			{
			    if(isset($_REQUEST['authSessionId']))session_id($_REQUEST['authSessionId']);
			    else echo session_id();
			    
			    if(isset($_REQUEST['authSessionDestroy']))session_destroy();
			    die();
			}
		}
	}
	public static function autoRemote()
	{
		if(isset($_REQUEST['appkey'])){
			if(isset($_REQUEST['session'])){
				if($_REQUEST['appkey']==UniversalConnection::$appkey)session_id($_REQUEST['session']);//sets session if the appkey was correct
				@session_start();
			}else if(isset($_REQUEST['cert'])){
				if(session_id()=='')@session_start();
				return UniversalConnection::checkCert(true,true,$_REQUEST['appkey']);
			}
		}
		return "";
	}
}
?>