<?php
	
	/*
	 * DBConnect
	 * Build 2
	 * Author Hedayat Yazdani
	 * Target: use mysqli for mysql
	 */

	define("DEF_ENTITY","cms_entity.sqlite");
	define("DEF_USER","");
	define("DEF_PASSWORD","");
	define("DEF_DATABASE","");
	
	define("DB_SQLITE",0);
	define("DB_MYSQL",1);
	
	class DBConnect
	{
		var $kind,$entity,$user,$pass,$db;
		var $result,$query,$handle;
		
		// about select
		var $index,$count,$auto_increment;
		function __construct($kind=DB_SQLITE,$entity=DEF_ENTITY,$user=DEF_USER,$pass=DEF_PASSWORD,$db=DEF_DATABASE)
		{
			$this->kind=$kind; $this->entity=$entity;
			if($this->kind==DB_MYSQL)
			{
				/*$this->user=$user; $this->pass=$pass; $this->db=$db;
				$this->handle=mysql_connect($this->entity,$this->user,$this->pass);
				mysql_select_db($this->db,$this->handle);*/
				$this->handle=new mysqli($entity, $user, $pass, $db);
			}
			elseif($this->kind==DB_SQLITE)
			{
				$this->handle=sqlite_open($this->entity);
			}
		}
		function run($q)
		{
			$this->query=$q;
			if($this->kind==DB_MYSQL)
			{	
				//code to run in MySql
				/*$this->result=mysql_query($this->query);
				if($this->result)
				{
					$this->index=0;
					@$this->count=mysql_num_rows($this->result);
					@$this->auto_increment=mysql_insert_id($this->result);
				}*/
				$this->result=$this->handle->query($q);
				if($this->result)
				{
					$this->index=0;
					@$this->count=$this->result->num_rows;
					@$this->auto_increment=$this->handle->insert_id;
				}
			}
			if($this->kind==DB_SQLITE)
			{
				//code to run in sqlite3
				
				$cmd=substr($q,0,6);
				$cmd=strtoupper($cmd);
				if($cmd=="SELECT")
				{
					$this->result=sqlite_query($q,$this->handle);
				}
				else
				{
					sqlite_exec($q,$this->handle);
				}
			}
			
		}
		function fetch()
		{
			if($this->kind==DB_MYSQL)
			{	
				//code to run in my sql
				if($this->index<$this->count)
				{
					$this->index++;
					//return mysql_fetch_assoc($this->result);
					return $this->result->fetch_assoc();
				}
			}
			if($this->kind==DB_SQLITE)
			{
				//code to run in sqlite3
				
				if($this->result)return sqlite_fetch_array($this->result);
			}
			return false;
		}
		function __destruct()
		{
			if($this->kind==DB_MYSQL)
			{	
				//code to run in my sql
				//mysql_close($this->handle);
				$this->handle->close();
			}
			if($this->kind==DB_SQLITE)
			{
				//code to run in sqlite3
				
				//if($this->result) sqlite_query_close($this->result);
				sqlite_close($this->handle);
			}
		}
	}
?>
