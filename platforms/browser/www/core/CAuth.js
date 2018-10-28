function CAuth(fp,cert,session,uid,uinfo)
{
	
	this.fp=null;
	this.cert=null;
	this.session=null;
	this.uid=null;
	this.userinfo=null;
this.fp=fp?fp:localStorage.user_fp; this.cert=cert?cert:localStorage.user_cert; this.session=session?session:localStorage.user_sess;
this.uid=uid?uid:localStorage.user_uid; this.userinfo=uinfo?uinfo:localStorage.user_info; CAuth.activeObject=this;
};



CAuth.appkey=null;
CAuth.loginPath='login.html';
CAuth.activeObject=null;
CAuth.server=null;
CAuth.forceLogin=true;
CAuth.tries=2;


CAuth.isLogin=function()
{
	if(CAuth.tries<1)return null; //skip the loop of login
	CAuth.tries--;
	
	if(localStorage.user_sess){
		if((Date.now()-3600000)<parseInt(localStorage.user_sess_time)){
			var tmp= new CAuth();
			(new JetHtml(document.body)).trigger("login");
			return tmp;
		}else if(localStorage.user_cert){
			CAuth.getSession();
		}else{
			window.location.href=CAuth.loginPath; //very rare or not possible
		}
	}else if(localStorage.user_cert){
		CAuth.getSession();
	}else{
		if(CAuth.forceLogin){
			window.location.href=CAuth.loginPath;
		}
	}
	return null;
};
CAuth.getSession=function()
{
	var n=new NetData();
	n.url="client/UniversalConnection/autoRemote/";
	n.callback=CAuth.onSessionBack;
	n.onerror=CAuth.onErrorLogin;
	n.add('appkey',CAuth.appkey,true).add('cert',localStorage.user_cert,true).add('uid','1').add('hub',localStorage.user_hub).commit();
};
CAuth.beforeSend=function(nt)
{
	if(nt.target.match(/^https*:\/\//))return;
	var url=CAuth.server+nt.target;
	url=url.replace(/\/\//g,"/"); //convert all duplicated slash to one //=>/
	url=url.replace(/\:\//,"://"); //convert first scheme slash to double https:/host => https://host
	nt.target=url;
	//nt.method="GET"; //cordova not supports post request
	//add authorize parameters
	if(CAuth.activeObject){
		if(CAuth.activeObject.session){
			nt.add('session',CAuth.activeObject.session,true);
			nt.add('appkey',CAuth.appkey,true);
		}
	}
};
CAuth.onSessionBack=function(res)
{
	if(res.indexOf(',')>0){
		//output is in format session,uid
		parts=res.split(',');
		localStorage.setItem('user_sess',parts[0]);
		localStorage.setItem('user_sess_time',Date.now());
		localStorage.setItem('user_uid',parts[1]);
		var tmp= new CAuth();
		(new JetHtml(document.body)).trigger("login");
		return tmp;
	}else{
		//the session is expired on the server it must to renew it
		localStorage.removeItem('user_sess');
		localStorage.removeItem('user_sess_time');
		CAuth.isLogin();
	}
};
CAuth.logout=function(callback)
{
	localStorage.clear();
	if(callback)callback();
};
CAuth.onErrorLogin=function(e)
{
	(new JetHtml(document.body)).trigger('loginerror');
};
