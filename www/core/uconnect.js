function UniversalConnection(force,systemUrl)
{
	
	this.uid=null;
	this.region=null;
	this.systemUrl=null;
	this.data=null;
this.systemUrl=systemUrl;
this.region=UniversalConnection.defaultRegion;
if(force){
	
}
	
	this.login=function()
	{
		if(window.open){
			var partner=""; var hash="";
			if(this.flag=="register"){
				hash="#register";
			}else{
				partner="&parnet="+this.flag;
			}
			
			if(this.region)
			{
			    if(UniversalConnection.appkey)
			        window.open(this.region+"?apsi="+encodeURIComponent(UniversalConnection.appkey)+
			        "&auth="+UniversalConnection.authType+"&forwardUrl="+encodeURIComponent(this.systemUrl)+partner+hash,"_system");
			    else console.log("App Key is not set");
			}
		}else console.log("Error: cordova.InappBrowser plugin not found.");
	};
};



UniversalConnection.defaultRegion='http://jointab.com/';
UniversalConnection.authType=1;
UniversalConnection.dataType='json';
UniversalConnection.appkey='appkey here';
UniversalConnection.appkeyType='apsi';
UniversalConnection.flag=null;
UniversalConnection.session=null;
UniversalConnection.cert=null;
UniversalConnection.server=null;


UniversalConnection.checkIntent=function()
{
	if(window.plugins){
		if(window.plugins.intent){
			window.plugins.intent.getCordovaIntent(function(intent){
				console.log(intent);
				var pre=document.createElement('pre');
				pre.innerHTML=JSON.stringify(intent);
				document.body.appendChild(pre);
			},function(){
				console.log("Unable to get the intent");
			});
			return;
		}
	}
	console.log("The intent plugin not found.");
};
UniversalConnection.config=function()
{
	document.addEventListener("deviceready",function(e){
		UniversalConnection.checkIntent();
	});
	if(cordova.InAppBrowser){
		window.open=cordova.InAppBrowser.open;
		console.log("InAppBrowser seted");
	}
};
