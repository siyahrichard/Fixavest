<?php
	require "../config.php";
	//require "UniversalServer.php";
	//require "uconnect.php";
	echo UniversalServer::$root;
	echo UniversalConnection::$defaultRegion;
	UniversalServer::checkUpdate();
?>