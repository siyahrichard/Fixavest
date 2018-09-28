function User(id,username,email,phone,password,link,profile,country)
{
	
	this.uid=null;
	this.username=null;
	this.email=null;
	this.password=null;
	this.phone=null;
	this.link=null;
	this.question=null;
	this.profile=null;
	this.loginName=null;
	this.region='http://localhost/projects/kelvok/';
	this.country=null;
	this.verified=null;
this.id=id; this.username=username; this.email=email; this.phone=phone; this.password=password; this.link=link; this.country=country;
};



User.availableCallback=null;
User.activeObject=null;
User.panelPath='panel/';
User.currentUID=null;
User.fingerPrint=null;
User.autoRenew=true;
User.renewLookupeeDelay=120;
User.staticCertRequest=false;
User.forwardUrl=null;
User.currentAppKey=null;


User.register=function(user)
{
	if(_("#pass1Txb").value()==_("#pass2Txb").value())
	{
	    User.activeObject=new User(0,_("#userTxb").value(),_("#emailTxb").value(),_("#phoneTxb").value(),_("#pass1Txb").value());
	    User.activeObject.country=_('#countryCode').value();
	    user=new User();
	    User.availableCallback=User.registerStart;
	    User.available(User.activeObject.username,User.activeObject.email,User.activeObject.phone);
	}
};
User.available=function(user,email,phone,country)
{
	n.clear();
	n.target="/client/user/available/";
	if(user)n.add("user",user);
	if(email)n.add("email",email);
	if(phone){
		n.add("phone",phone);
		n.add('country',country);
	}
	n.method="GET";
	if(User.availableCallback)
	{
	    n.callback=User.availableCallback;
	    n.send();
	}
};
User.login=function(loginName,password,country)
{
	var error=0;
	if(HomeCore.phoneMode){
		if(_("#phoneTxbL").value()==="")error|=1;
	}else{
		if(_("#loginNameTxb").value()==="")error|=1;
	}
	if(_("#passwordTxb").value()==="")error|=2;
	
	if(error===0)
	{
	    //_("#loginForm").source.submit();
	    n.target="client/user/login/";
	    n.clear();
	    if(HomeCore.phoneMode){
	    	n.add("country",_("#countryCodeL").value());
	    	n.add("loginName",_("#phoneTxbL").value());
	    }else
	    	n.add("loginName",_("#loginNameTxb").value());
	    n.add("password",_("#passwordTxb").value());
		if(User.fingerPrint)n.add("fp",User.fingerPrint);
	    n.method="POST";
	    n.callback=User.goToPanel;
	    n.send();
	}
	else
	{
	    //show errors
	    alert("Please enter username and password");
	}
};
User.registerStart=function(res)
{
	res=parseInt(res);
	if(res===0)
	{
	    n.clear();
	    n.target="client/user/register/";
	    n.add("user",User.activeObject.username);
	    n.add("email",User.activeObject.email);
	    n.add("phone",User.activeObject.phone);
	    n.add("country",User.activeObject.country);
	    n.add("password",User.activeObject.password);
	    n.callback=User.registerationComplete;
	    n.send();
	}
	else
	{
	    msg=[];
	    if(res&1)msg.push(registerError[1]);
	    if(res&2)msg.push(registerError[2]);
	    if(res&4)msg.push(registerError[4]);
	    alert(msg.join(" \n"));
	}
};
User.goToPanel=function(res)
{
	if(res=="ok"){
		if(User.staticCertRequest && User.forwardUrl && User.currentAppKey){
			User.saveSCertReq(User.fingerPrint,User.currentAppKey);//also close the page after n mili seconds. in second version n=500 ms
			//close tab if the user comed from mobile like AutoConnect
			//setTimeout(window.close,3000);
		}else window.location.href=User.panelPath;
	}else if(res=="unable"){
		alert(loginUnable);
	}else{
	    alert(loginError);
	}
};
User.registerationComplete=function(res)
{
	if(res=='1'){
		alert('Registration Completed.');
		HomeCore.setFragment('login');
		_('#loginNameTxb').value(User.activeObject.username | User.activeObject.email | User.activeObject.phone);
	}else{
		alert('Unable to Register');
	}
};
User.renewLookupee=function(fp)
{
	var n=new NetData();
	n.url="/client/user/renewLookupee/";
	_ajaxQ.add(n); _ajaxQ.run();
	if(User.autoRenew)
		setTimeout(User.renewLookupee,User.renewLookupeeDelay*1000);
};
User.getLookupee=function(fp)
{
	var n=new NetData();
	n.url="/client/user/getLookupee/";
	n.add("fp",fp);
	n.callback=User.checkLookupee;
	_ajaxQ.add(n); _ajaxQ.run();
};
User.checkLookupee=function(res)
{
	var query=window.location.href.split('?');
	if(query.length>1){
		query="?"+query[1];//last part after ? mark
	}else query="";
	if(res.length>10)window.location.href=(res+query);//.replace(/\?*/g,"?").replace(/\/*/g,"/");
	
};
User.saveSCertReq=function(fp,key)
{
	var n=new NetData();
	n.url="/client/user/saveSCertReq/";
	n.add('fp',fp);
	n.add("key",key,true);
	n.callback=User.saveSCertReqBack;
	_ajaxQ.add(n); _ajaxQ.run();
};
User.saveSCertReqBack=function(res)
{
	if(User.forwardUrl && res.length>0 && res.length<20){
		var url=User.forwardUrl;
		if(url.indexOf("?")>0)url+="&fp="+User.fingerPrint+"&hub="+res; //res must contains the hub
		else url+="?fp="+User.fingerPrint+"&hub="+res; //res must contains the hub
		//window.location.href=url;
		//open(url);
		//setTimeout(window.close,500);
		//window.close();
		var parts=window.location.href.split('/');
		var scheme=parts[0];
		var host=parts[2];
		window.location.href=scheme+"//"+host+"/tools/forwardCloser/?url="+encodeURIComponent(url);//forward and close
	}
};
