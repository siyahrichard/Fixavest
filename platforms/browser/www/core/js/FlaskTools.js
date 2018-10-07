function FLHome()
{
};



FLHome.buttons=null;
FLHome.currentType=null;
FLHome.lastParent=null;


FLHome.show=function(par)
{
	FLHome.buttons={
		"all":"allSearchBtn",
		"contact":"contactSearchBtn",
		"message":"messageSearchBtn",
		"web":"webSearchBtn"
	};
	//FLHome.currentType="contact";
	FLHome.lastParent=par;
	par.innerHTML="<div style=\"padding:5px;background-color: midnightblue\"><img style=\"width: 50px;height: 50px;vertical-align: middle;margin-right: 10px\" src=\"res/image/png/logo.png\"/>&nbsp;<button id=\"allSearchBtn\" class=\"blue btn b5\" onclick=\"FLHome.setType('all');\">All</button>&nbsp;<button id=\"contactSearchBtn\" class=\"orange btn b5\" onclick=\"FLHome.setType('contact');\">Contacts</button>&nbsp;<button id=\"messageSearchBtn\" class=\"blue btn b5\" onclick=\"FLHome.setType('message');\">Messages</button>&nbsp;<button id=\"webSearchBtn\" class=\"blue btn b5\" onclick=\"FLHome.setType('web');\">Web</button></div><div id=\"resultArea\" style=\"padding:5px;\"><p style=\"margin:1vw\">Features:<ul style=\"margin:3vh\"><li>Edit/Delete and unsend messages</li><li>Flag Messages</li><li>Run applications and Play games (in this version only chess)</li><li>View message status (sent,received,seen)</li><li>Search over messages and contacts</li></ul></p><p style=\"margin:1vw\">Features of next version:<ul style=\"margin:3vh\"><li>Upload files</li><li>Record audio and video</li><li>Drawing application</li><li>Application status snapshop</li><li>Edit profile information directly</li><li>Search over the web</li><li>Support for system notification</li><li>Scheduled send message</li><li>Messaging panel and API for business</li></ul></p></div>";
	
	if(!SearchItem.configed){
		SearchItem.config({
			"conv":"res/image/png/user.png",
			"msg":"res/image/png/conversation.png"
		});
	}
	var msgAud=_("#msgAudPar");
	if(msgAud){
		msgAud.addClass('hide');
	}
	FLHome.setType(FLHome.currentType?FLHome.currentType:"contact");
};
FLHome.setType=function(type)
{
	FLHome.currentType=type;
	var keys=Object.keys(FLHome.buttons);
	for(var i=0;i<keys.length;i++){
		if(keys[i]==type)
			_("#"+FLHome.buttons[keys[i]]).attr('class','orange btn b5');
		else
			_("#"+FLHome.buttons[keys[i]]).attr('class','blue btn b5');
	}
};
FLHome.onSearch=function(e)
{
	if(e.keyCode==13){
		if(typeof(Messenger)!="undefined"){
			if(Messenger.activeObject){
				Messenger.activeObject.exit(); //stop existing messenger first
			}
		}
		var resArea=FLHome.getResultArea();
		resArea.innerHTML="";
		var param=e.target.value;
		switch(FLHome.currentType){
			case 'all':
				Conversation.search(param,null,0,10,false,FLHome.showConversations);//search in conversations
				Conversation.searchMessage(param,null,0,10,null,FLHome.showMessages);//search in messages
				break;
			case 'contact':
				Conversation.search(param,null,0,10,false,FLHome.showConversations);
				break;
			case 'message':
				Conversation.searchMessage(param,null,0,10,null,FLHome.showMessages);//after count there is search option like flags
				break;
			case 'web':
				//search web for results
				break;
		}
	}
};
FLHome.showConversations=function(res)
{
	var items=[];
	if(res instanceof Array){
		for(var i=0;i<res.length;i++){
			items.push(new SearchItem(
					res[i].title,
					"",//no description for conversations
					res[i].picture,
					Conversation.start,
					res[i].uid,
					res[i].id
				));
		}
	}else{
		var keys=Object.keys(res);
		for(var i=0;i<keys.length;i++){
			items.push(new SearchItem(
					res[keys[i]].title,
					"",//no description for conversations
					res[keys[i]].picture,
					Conversation.start,
					res[keys[i]].uid,
					res[keys[i]].id
				));
		}
	}
	if(items.length>0){
		var stype=new SearchType('Conversations','conv',10,items);
		SearchType.buildForm(stype,1,"resultArea");
	}
};
FLHome.showMessages=function(res)
{
	var items=[];var pos=0;
	for(var i=0;i<res.length;i++){
		pos=100;
		items.push(new SearchItem(
				UserInfo.list[res[i].conv].title,
				res[i].value.substring(0,pos),
				CloudFile.getUrlByCode(UserInfo.list[res[i].conv].picture),
				Messenger.navigate,
				res[i],
				res[i].id
			));
	}
	if(items.length>0){
		var stype=new SearchType('Messages','msg',10,items);
		SearchType.buildForm(stype,1,"resultArea");
	}
};
FLHome.getResultArea=function()
{
	var ret=null;
	if((ret=_("#resultArea"))){
		return ret.source;
	}else if(FLHome.lastParent){
		FLHome.show(FLHome.lastParent);
		return FLHome.getResultArea();
	}
	return null;
};

function FLSetting()
{
};



FLSetting.buttons=null;
FLSetting.currentType=null;


FLSetting.show=function(par)
{
	FLSetting.buttons={
		"device":"deviceSettingBtn",
		"contact":"contactSettingBtn",
		"message":"messageSettingBtn",
		"user":"userSettingBtn"
	};
	var device=window.device;
	if(!device){
		device={
			'platform':'Browser',
			'manufacturer':'unknown',
			'model':'unknown'
		};
	}
	par.innerHTML="<div style=\"padding:5px;background-color: midnightblue\"><img style=\"width: 50px;height: 50px;vertical-align: middle;margin-right: 10px\" src=\"res/image/png/setting.png\"/><button id=\"deviceSettingBtn\" class=\"orange btn b5\" onclick=\"FLSetting.setType('device');\">Device</button>&nbsp;<button id=\"contactSettingBtn\" class=\"blue btn b5\" onclick=\"FLSetting.setType('contact');\">Contacts</button>&nbsp;<button id=\"messageSettingBtn\" class=\"blue btn b5\" onclick=\"FLSetting.setType('message');\">Messages</button>&nbsp;<button id=\"userSettingBtn\" class=\"blue btn b5\" onclick=\"FLSetting.setType('user');\">User</button>&nbsp;</div><div id=\"resultArea\" style=\"margin:5px;border:1px solid gray;border-radius: 5px;padding:5px;box-shadow: 2px 2px 20px gray;background:linear-gradient(to right,white,#F8E5FF);\"><div id=\"deviceSettingPan\"><table><tr><td>Platform:</td><td>%platform%</td></tr><tr><td>Manufacturer:</td><td>%manufacturer%</td></tr><tr><td>Model:</td><td>%device_model%</td></tr></table></div><div id=\"contactSettingPan\" class=\"hide\"><button class=\"green btn b5\" onclick=\"ContactCheck.refresh()\">Refresh Contacts</button>&nbsp;</div><div id=\"messageSettingPan\" class=\"hide\"></div><div id=\"userSettingPan\" class=\"hide\"><table><tr><td>UID:</td><td>%uid%</td></tr></table></div></div>"
	.replace('%platform%',device.platform).replace('%manufacturer%',device.manufacturer).replace('%device_model%',device.model).replace('%uid%',Messenger.currentUID);
};
FLSetting.setType=function(type)
{
	FLSetting.currentType=type;
	var keys=Object.keys(FLSetting.buttons);
	for(var i=0;i<keys.length;i++){
		if(keys[i]==type)
			_("#"+FLSetting.buttons[keys[i]]).attr('class','orange btn b5');
		else
			_("#"+FLSetting.buttons[keys[i]]).attr('class','blue btn b5');
		_("#"+keys[i]+"SettingPan").attr('class',"hide");
	}
	
	_("#"+type+"SettingPan").attr('class',"");
};

function SearchType(title,code,maxShow,items)
{
	
	this.title=null;
	this.code=null;
	this.maxShow=null;
	this.items=null;
this.title=title?title:null; this.code=code?code:null; this.maxShow=maxShow?maxShow:null; this.items=items?items:null;
for(var i=0;i<items.length;i++){
	items[i].parent=this;//get access to the search type
}
};




SearchType.buildForm=function(o,view,par)
{
	if(!Jet.App.form.SearchType)SearchType.config();
	ctrl= Jet.App.buildForm(o,view,par);
	if(o.items){
		for(var i=0;i<o.items.length;i++){
			SearchItem.buildForm(o.items[i],0,"result"+o.code);
		}
	}
};
SearchType.config=function()
{
	Jet.App.register('SearchType',SearchType);
	Jet.App.form.SearchType={};
	Jet.App.form.SearchType[1]="<div class=\"searchType\"><p><b class=\"title\">%title%</b></p><p id=\"result%code%\"></p><p class=\"foot\"><button class=\"green btn\" onclick=\"SearchType.more('%code%')\">More...</button></p></div>";
	
	Jet.App.form.SearchType.userOperation="";
	Jet.App.form.SearchType.ownerOperation=Jet.App.form.SearchType.userOperation+
	"";
};

function SearchItem(title,description,image,callback,arg,id)
{
	
	this.id=null;
	this.title=null;
	this.description=null;
	this.image=null;
	this.callback=null;
	this.arg=null;
	this.parent=null;
this.id=id?id:0; this.title=title?title:null; this.description=description?description:null; this.image=image?image:null; this.callback=callback?callback:null; this.arg=arg?arg:null;
};



SearchItem.errorImages=null;
SearchItem.configed=false;


SearchItem.buildForm=function(o,view,par)
{
	if(!SearchItem.configed)SearchItem.config();
	ctrl= Jet.App.buildForm(o,SearchItem.getViewOf(o),par);
	ctrl.lObj=o;
	ctrl.addEventListener('click',SearchItem.onClick,false);
	return ctrl;
};
SearchItem.config=function(errImages)
{
	Jet.App.register('SearchItem',SearchItem);
	Jet.App.form.SearchItem={};
	Jet.App.form.SearchItem[1]="<div class=\"side1\"><img onerror=\"SearchItem.onImageError(event);\" src=\"%image%\"/></div><div class=\"side2\"><p><b>%title%</b></p><p>%description%</p></div>";
	Jet.App.form.SearchItem[2]="<p><b>%title%</b></p><p>%description%</p>";
	Jet.App.form.SearchItem[3]="<div class=\"side1\"><img onerror=\"SearchItem.onImageError(event);\" src=\"%image%\"/></div><div class=\"side2\"><span>%title%</span></div>";
	Jet.App.form.SearchItem[4]="<div class=\"side1\"><img onerror=\"SearchItem.onImageError(event);\" src=\"%image%\"/></div><div class=\"side2\"><span>%description%</span></div>";
	Jet.App.form.SearchItem[5]="<img onerror=\"SearchItem.onImageError(event);\" src=\"%image%\"/>";
	
	Jet.App.form.SearchItem1par="div"; Jet.App.form.SearchItem2par="div"; Jet.App.form.SearchItem3par="div"; Jet.App.form.SearchItem4par="div";
	Jet.App.form.SearchItem5par="div";
	
	Jet.App.form.SearchItem1cssClass="searchItem"; Jet.App.form.SearchItem2cssClass="searchItem mode1"; Jet.App.form.SearchItem3cssClass="searchItem"; Jet.App.form.SearchItem4cssClass="searchItem";
	Jet.App.form.SearchItem5cssClass="searchItem mode2";
	
	Jet.App.form.SearchItem.userOperation="";
	Jet.App.form.SearchItem.ownerOperation=Jet.App.form.SearchItem.userOperation+
	"";
	if(errImages)SearchItem.errorImages=errImages;
	else SearchItem.errorImages={};//empty dictionary
	
	SearchItem.configed=true;
};
SearchItem.getViewOf=function(o)
{
	if(o.title && o.description && o.image)return 1;
	else if(o.title && o.description)return 2;
	else if(o.title && o.image)return 3;
	else if(o.description && o.image)return 4;
	if(o.image)return 5;
	return 0;
};
SearchItem.onClick=function(e)
{
	p=e.target;
	while(typeof(p.lObj)=="undefined"){
		p=p.parentElement;
	}
	if(p.lObj){
		if(p.lObj.callback){
			p.lObj.callback(p.lObj.arg);
		}
	}
	if(e.stopPropagation)e.stopPropagation();
	e.cancelBubble=true;
};
SearchItem.onImageError=function(e)
{
	p=e.target;
	while(typeof(p.lObj)=="undefined"){
		p=p.parentElement;
	}
	if(p.lObj){
		/*var img=SearchItem.errorImages[p.lObj.parent.code];
		if(img){
			e.target.setAttribute('src',img);
		}else{
			e.target.parentElement.removeChild(e.target);//remove the image
		}*/
		var par=e.target.parentElement;
		par.removeChild(e.target);
		TextAvatar.getTextAvatar(p.lObj.title,par,null,null,2);
	}
};

function TextAvatar()
{
};




TextAvatar.getColorsOf=function(arg,odds,evens)
{
	if(!evens)evens="red";
	if(!odds)odds="green";
	
	var size=arg.length;
	if(size<10)size+=10;
	else if(size<20)size+=14;
	
	var fcolor={
	"red":255,
	"green":255,
	"blue":255
	};
	
	var bcolor={
	"red":255,
	"green":255,
	"blue":255
	};
	
	var cat=(size%2)>0?odds:evens;
	var color=['red','green','blue'];
	
	for(var i=0;i<color.length;i++){
	fcolor[color[i]]-=parseInt(size*4);
	bcolor[color[i]]-=parseInt(size*6);
	}
	
	fcolor[cat]+=parseInt(size*3);
	bcolor[cat]+=parseInt(size*2);
	
	for(i=0;i<color.length;i++){
	if(fcolor[color[i]]<0)fcolor[color[i]]=0;
	else if(fcolor[color[i]]>255)fcolor[color[i]]=255;
	
	if(bcolor[color[i]]<0)bcolor[color[i]]=0;
	else if(bcolor[color[i]]>255)bcolor[color[i]]=255;
	}
	
	return [
	"#"+fcolor["red"].toString(16)+fcolor["green"].toString(16)+fcolor["blue"].toString(16),
	"#"+bcolor["red"].toString(16)+bcolor["green"].toString(16)+bcolor["blue"].toString(16)
	]
};
TextAvatar.getTextAvatar=function(arg,par,odds,evens,count,style)
{
	if(!style)style="text-avatar";
	arg=arg.trim();
	var title=arg[0];
	if(count>1){
		var r=null;
		if((r=/\s\w/.exec(arg))){
			title+=r[0].trim();//add first character after space
		}else if(title.length>1){
			title+=arg[1];//add next character
		}
	}
	
	var color=TextAvatar.getColorsOf(arg);
	var d=document.createElement('div');
	d.setAttribute('class',style);
	var poser=document.createElement('div');
	poser.setAttribute('class','av-label');
	var cnt=document.createElement('div');
	cnt.setAttribute('class','av-content');
	cnt.innerHTML=title.toUpperCase();
	poser.appendChild(cnt);
	d.style.color=color[0];
	d.style.backgroundColor=color[1];
	d.appendChild(poser);
	
	if(par){
		par=typeof(par)=="string"?document.getElementById(par):par;
		par.innerHTML="";
		par.appendChild(d);
		var rect=d.getBoundingClientRect();
		var cent=rect.height/100;
		cnt.style.fontSize=parseInt(cent*70)+"px";
		cnt.style.lineHeight=parseInt(cent*70)+"px";
	}
	
	return d;
};
