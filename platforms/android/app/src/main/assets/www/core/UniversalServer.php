<?php
class UniversalServer
{
	
	var $prefix=null;
	var $type=null;
	var $url=null;
	
	public static $list=null;
	public static $version=null;
	public static $root='/kelvok/';
	
	public function __construct($prefix,$type,$url)
	{
		$this->prefix=$prefix;
		$this->type=$type;
		$this->url=$url;
	}
	
	public static function checkUpdate()
	{
		UniversalServer::load();
		$ch=curl_init(UniversalConnection::$defaultRegion."client/hub/version/");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$ver=intval(curl_exec($ch));
		curl_close($ch);
		if(UniversalServer::$version<$ver)
		{
		    UniversalServer::capture();
		}
	}
	public static function getServer( $type, $prefix=null)
	{
		
		if(!UniversalServer::$list)UniversalServer::load();
		if(($type||$type===0) && $prefix)
		{
		    
		    foreach(UniversalServer::$list as $cur)
		    {
		        if($cur->type==$type && $cur->prefix==$prefix)return $cur;
		    }
		}
		else if($type>=0)
		{
		    $ret=array();
		    foreach(UniversalServer::$list as $cur)
		    {
		        if($cur->type==$type)array_push($ret,$cur);
		    }
		    return $ret;
		}
	}
	public static function capture()
	{
		
		$ch=curl_init(UniversalConnection::$defaultRegion."client/hub/get/");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$data=curl_exec($ch);
		curl_close($ch);
		file_put_contents(UniversalServer::$root."hubData",$data);
		
		$ch=curl_init(UniversalConnection::$defaultRegion."client/hub/version/");
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		$ver=curl_exec($ch);
		curl_close($ch);
		file_put_contents(UniversalServer::$root."hubVersion",$ver);
	}
	public static function load()
	{
		
		if(file_exists(UniversalServer::$root."hubVersion"))
		{
		    UniversalServer::$version=intval(file_get_contents(UniversalServer::$root."hubVersion"));
		    $servers=trim(file_get_contents(UniversalServer::$root."hubData"));
		    $servers=explode("\n",$servers);
		    UniversalServer::$list=array();
		    foreach($servers as $key=>$cur)
		    {
		        if($cur!="")
		        {
		            $serv=explode("|",$cur);
		            UniversalServer::$list[$key]=new UniversalServer($serv[0],$serv[1],$serv[2]);
		        }
		    }
		}
		else
		{
		    UniversalServer::$version=0;
		}
	}
	public static function writeJS($type)
	{
		
		echo "\r\n";
		if($type)
		{
		    foreach(UniversalServer::$list as $key=>$cur)
		    {
		        if($cur->type==$type)echo "UniversalServer.list[$key]=new UniversalServer('$cur->prefix',$cur->type,'$cur->url');\r\n";
		    }
		}
		else
		{
		    foreach(UniversalServer::$list as $key=>$cur)
		    {
		        echo "UniversalServer.list[$key]=new UniversalServer('$cur->prefix',$cur->type,'$cur->url');\r\n";
		    }
		}
	}
	public static function getPrefix( $uid)
	{
		if(preg_match("/[a-z]+/",$uid,$match))return $match[0];
		return null;
	}
	public static function get( $type, $prefix=null)
	{
		return UniversalServer::getServer(type,prefix);
	}
}
?>
<?php
class PUServer extends UniversalServer
{
	
	var $pattern=null;
	
	public function __construct( $prefix, $type, $url,$pattern='/.*/')
	{
		$this->prefix=$prefix;
		$this->type=$type;
		$this->url=$url;
		$this->pattern=$pattern;
	}
}
?>