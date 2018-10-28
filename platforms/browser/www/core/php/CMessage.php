<?php
class CMessage extends FSMessage
{
	
	var $status=null;
	var $sid=null;
	var $modified=null;
	var $replay=null;
	var $ms=null;
	var $attachments=null;
	
	public static $table='messages';
	public static $activeObject=null;
	public static $activeDialog=null;
	public static $ownPopup=null;
	public static $audPopup=null;
	
	public function __construct($subject,$value,$sender,$receiver,$senderApp,$receiverApp,$moment,$options=0,$status=0,$sid=0,$id=0)
	{
		$this->status=$status; $this->sid=$sid; $this->subject=$subject; $this->value=$value; $this->receiver=$receiver;
		$this->senderApp=$senderApp; $this->receiverApp=$receiverApp; $this->moment=$moment; $this->id=$id; $this->options=$options; $this->originalXml=null; $this->sender=$sender;
	}
	
	public static function install()
	{
		global $defdb;
		$table=CMessage::$table;
		
		$q="create table if not exists $table(id_fl int primary key auto_increment, sub_fl varchar(128), val_fl text, from_fl varchar(20), to_fl varchar(20), sa_fl int, ra_fl int, mom_fl datetime, stat_fl tinyint, sid_fl int)";
		$defdb->run($q);
		
		$q="create table if not exists e$table (id_fl int primary key, mod_fl datetime, rep_fl int)";
		$defdb->run($q);
		
		$q="create table if not exists files_$table (id_fl int, code_fl varchar(30), share_key varchar(20),constraint if$table unique(id_fl,code_fl,share_key))";
		$defdb->run($q);
		
		$q="create table if not exists trash_files_$table (id_fl int, code_fl varchar(30), share_key varchar(20),constraint itf$table unique(id_fl,code_fl,share_key))";
		$defdb->run($q);
	}
	public static function send( $o, $server, $targetServer=null, $sendBack=null, $errorBack=null)
	{
		$ch=curl_init($server."client/CMessage/income/");
		curl_setopt_array($ch,array(
				CURLOPT_RETURNTRANSFER=>1,
				CURLOPT_POST=>1,
				CURLOPT_POSTFIELDS=>"data=".rawurlencode(json_encode($o)),
				CURLOPT_SSL_VERIFYPEER=>0
			));
		curl_exec($ch); curl_close($ch);
	}
	public static function income( $o)
	{
		global $defdb;
		$table=CMessage::$table;
		
		if($o->id!=0)
		{
			$q="update $table set sub_fl ='$o->subject',val_fl ='$o->value',to_fl ='$o->receiver',ra_fl =$o->receiverApp, stat_fl=$o->status where id_fl=$o->id and (from_fl='$o->sender' or ($o->status|32>0 and to_fl='$o->receiver'))";
			$defdb->run($q);
			$q="insert into e$table (id_fl,mod_fl)value($o->id,'$o->modified') on duplicate key update mod_fl='$o->modified'";
			$defdb->run($q);
			CMessage::saveFiles($o);
		}
		else
		{
			$q="insert into $table (sub_fl ,val_fl,from_fl, to_fl ,sa_fl ,ra_fl ,mom_fl , stat_fl,sid_fl )values( '$o->subject', '$o->value', '$o->sender', '$o->receiver', $o->senderApp, $o->receiverApp, '$o->moment',$o->status,$o->sid)";
			$defdb->run($q);
			$o->id=$defdb->auto_increment;
			CMessage::saveFiles($o,true);//for more performace tell the function to execution of cleaning old files block is not require
		}
		
	}
	public static function receive( $uid, $moment, $server=null,$clear=false, $errorCallback=null)
	{
		global $defdb;
		$table=CMessage::$table;
		$optTable=CMOption::$table;
		$cond="where ($table.mom_fl>'$moment' or e$table.mod_fl>'$moment') and (to_fl='$uid' or from_fl='$uid') and ((opt_fl & 1)=0 or (opt_fl & 1) is null)";
		$cond2="where mom_fl>'$moment' and to_fl='$uid'";
		
		//$removedQuery="select id_fl from $optTable  where uid_fl='$uid' (opt_fl & 1) =0";
		//$lim=($dl>=0)?"limit $dl,$ul":"";
		$q="select $table.*,e$table.mod_fl as mod_fl,$optTable.opt_fl as opt_fl from $table left join e$table on $table.id_fl=e$table.id_fl".
		" left join $optTable on $table.id_fl=$optTable.id_fl and $optTable.uid_fl='$uid' $cond";
		$defdb->run($q);
		$ret=array();
		while($r=$defdb->fetch())
		{
			$tmp=new CMessage($r['sub_fl'],$r['val_fl'],$r['from_fl'],$r['to_fl'],$r['sa_fl'],$r['ra_fl'],$r['mom_fl'],$r['opt_fl'],$r['stat_fl'],$r['sid_fl'],$r['id_fl']);
			$tmp->modified=$r['mod_fl'];
			array_push($ret,$tmp);
		}
		if($clear){
			//$q="delete from $table $cond2";
			//$defdb->run($q);
		}
		return $ret;
	}
	public static function getTrash()
	{
		global $defdb;
		$cmoptTable=CMOption::$table;
		$count_to_delete=2;
		$lim="limit 100";
		$q="select id_fl from (select id_fl,count(uid_fl) as cnt_fl from $cmoptTable where opt_fl&1=1 group by id_fl) as t1 where cnt_fl=$count_to_delete $lim";
		$defdb->run($q);
		$ids=array();
		while($r=$defdb->fetch()){
			array_push($ids,$r['id_fl']);
		}
		return $ids;
	}
	public static function saveFiles( $o,$is_new=false)
	{
		global $defdb;
		$table=CMessage::$table;
		if(is_array($o->attachments)){
			$codes=array();
			$q="insert into files_$table (id_fl,code_fl,share_key)values";
			foreach($o->attachments as $key=>$value){
				if($key>0)$q.=",";
				array_push($codes,$value->code);
				$q.="($o->id,'$value->code','$value->shareKey')";
			}
			$defdb->run($q);
			if(!$is_new){
				$codes=implode("','",$codes);
				$q="insert into trash_files_$table select * from files_$table where code_fl not in('".$codes."')";
				$defdb->run($q);
				//delete from table
				$q="delete from files_$table where code_fl not in('".$codes."')";
				$defdb->run($q);
			}
		}
	}
	public static function getTrashFiles()
	{
		global $defdb;
		$table=CMessage::$table;
		$lim="limit 20";
		$q="select trash_file_$table.*,file_$table.code_fl as exist_code from trash_file_$table left join file_$table on trash_file_$table.code_fl=file_$table.code_fl $lim";
		$defdb->run($q);
		//if exist_code == Null the file is ready to delete
		$codes=array();
		while($r=$defdb->fetch())if(!$r['exist_code'])array_push($codes,$r['code_fl']); //select codes if there is not in the file_$table
		
		return $codes;
	}
	public static function getConversations( $uid)
	{
		global $defdb;
		$table=CMessage::$table;
		$otable=CMOption::$table;
		$q="select * from (".
		"select $table.to_fl as conv_fl,$otable.opt_fl as opt_fl from $table left join $otable on $table.id_fl=$otable.id_fl and $otable.uid_fl='$uid' ".
		"where $table.from_fl='$uid' and ((opt_fl & 1)=0 or (opt_fl & 1) is null) group by to_fl".
		" UNION ".
		"select $table.from_fl as conv_fl,$otable.opt_fl as opt_fl from $table left join $otable on $table.id_fl=$otable.id_fl and $otable.uid_fl='$uid' ".
		"where $table.to_fl='$uid' and ((opt_fl & 1)=0 or (opt_fl & 1) is null) group by from_fl".
		") as t1 group by conv_fl";
		
		
		$defdb->run($q);
		$ret=array();
		while($r=$defdb->fetch())array_push($ret,$r['conv_fl']);
		return $ret;
	}
}
?>
<?php
class CMOption
{
	
	var $id=null;
	var $uid=null;
	var $option=null;
	
	public static $table='cmopt';
	
	public static function install()
	{
		global $defdb;
		$table=CMOption::$table;
		$q="create table if not exists $table (id_fl int,uid_fl varchar(20), opt_fl int,constraint i$table unique(id_fl,uid_fl))";
		$defdb->run($q);
	}
	public static function update( $ids, $option, $uid)
	{
		global $defdb;
		$table=CMOption::$table;
		if(!is_array($ids))$ids=array($ids);
		$q="";
		foreach($ids as $id){
			if($q)$q.=",";
			$q.="($id,'$uid',$option)";
		}
		$q="insert into $table (id_fl,uid_fl,opt_fl)values$q on duplicate key update opt_fl= opt_fl | $option";
		$defdb->run($q);
	}
	public static function deleteAll( $uid, $audience, $callback=null)
	{
		global $defdb;
		$cmtable=CMessage::$table;
		$table=CMOption::$table;
		
		$q="select id_fl from $cmtable where (from_fl='$uid' and to_fl='$audience') or (from_fl='$audience' and to_fl='$uid')";
		$defdb->run($q);
		$ids=array();
		while($r=$defdb->fetch()){
			array_push($ids,$r['id_fl']);
		}
		
		$q="insert into $table (id_fl ,uid_fl ,opt_fl)values";
		foreach($ids as $key=>$value){
			if($key>0)$q.=",";
			$q.="($value, '$uid', 1)";
		}
		$q.="on duplicate key update opt_fl=opt_fl|1";
		$defdb->run($q);
	}
}
?>
<?php
class CMStatus
{
	
	var $id=null;
	var $option=null;
	var $sentTime=null;
	var $receivedTime=null;
	var $seenTime=null;
	
	public static $table='cmstat';
	
	public function __construct()
	{
		
	}
	
	public static function install()
	{
		global $defdb;
		$table=CMStatus::$table;
		$q="create table if not exists $table(id_fl int primary key,opt_fl tinyint(3))";
		$defdb->run($q);
		
		$q="create table if not exists t_$table(id_fl int primary key,s_fl datetime, r_fl datetime, se_fl datetime)";
		$defdb->run($q);
	}
	public static function update( $ids, $option,$timing=false)
	{
		global $defdb;
		$table=CMStatus::$table;
		if(!is_array($ids))$ids=array($ids);
		$q="";
		foreach($ids as $id){
			if($q)$q.=",";
			$q.="($id,$option)";
		}
		$q="insert into $table (id_fl,opt_fl)values$q on duplicate key update opt_fl= opt_fl | $option";
		if($timing){
			$tm=date('Y-j-d H:i:s');
		}
	}
}
?>