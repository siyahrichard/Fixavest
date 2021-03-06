function CMessage(subject,value,sender,receiver,senderApp,receiverApp,moment,options,status,sid,id)
{
	
	this.status=null;
	this.sid=null;
	this.modified=null;
	this.replay=null;
	this.ms=null;
this.subject=subject?subject:null;this.value=value?value:null; this.receiver=receiver?receiver:null; this.senderApp=senderApp?senderApp:null;
this.receiverApp=receiverApp?receiverApp:0; this.moment=moment?moment:null; this.id=id?id:0; this.options=options?options:0;
this.sender=sender?sender:null;

this.status=status?status:0; this.sid=sid?sid:0; this.ms=null;
};
CMessage.prototype=new FSMessage();
CMessage.prototype.constructor=CMessage;
CMessage.prototype.parent=FSMessage.prototype;



CMessage.table='messages';
CMessage.activeObject=null;
CMessage.activeDialog=null;
CMessage.ownPopup=null;
CMessage.audPopup=null;


CMessage.send=function(o,server,targetServer)
{
	var n=new NetData();
	n.url=server+"client/CMessage/income/";
	n.add("data",JSON.stringify(o),true);
	n.add("target",targetServer,true);
	//n.callback=LU.globalCallback?LU.globalCallback:null;
	n.callback=function(id){
		var msg=arguments.callee.lObj;
		msg.id=parseInt(id);
		var showing=Messenger.isShowing(msg);
		if(!showing)Messenger.messages.push(msg);//check it is not on the list
		if(msg.value!="X" && (!showing || CMessage.activeDialog))CMessage.show(Messenger.activeObject,msg,true);
		Messenger.getStatus(); //get status of sending message
	};
	n.callback.lObj=o;
	n.onerror=null;
	_ajaxQ.add(n).run();
};
CMessage.receive=function(uid,moment,server,clear)
{
	var n=new NetData();
	n.url=server+"client/CMessage/receive/";
	n.add("time",moment,true); //uses unix timestamp rather than Moment
	if(clear)n.add("clear",0);
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	_ajaxQ.add(n).run();
};
CMessage.show=function(messenger,msg,my,text)
{
	my=(typeof(my)=="undefined")?(msg.sender==Messenger.currentUID):my;
	var cssClass="itMessage"; var popup=CMessage.audPopup;
	if(my){
		cssClass="myMessage";
		popup=CMessage.ownPopup;
	}
	
	var pan=document.createElement('div');
	pan.setAttribute('id',"MSG_"+msg.id);
	Popup.set(pan,popup);
	pan.lObj=msg;
	pan.setAttribute("class",cssClass);
	if(msg.receiverApp==Messenger.appId || msg.receiverApp==0)
		pan.innerHTML=text?text:Messenger.unpurizeText(msg.value);
	else{
		var appClass=Messenger.appList[msg.receiverApp];
		var btn=document.createElement('button');
		btn.setAttribute("class","yellow btn");
		btn.setAttribute("onclick","Messenger.onOpenApp("+msg.receiverApp+",this.cmessage);");
		btn.innerHTML="Open "+appClass.title;
		btn.cmessage=msg;
		pan.appendChild(btn);
	}
	
	var info=document.createElement('div');
	info.setAttribute('class','info msg-status');
	info.setAttribute("id",'status'+msg.id);
	info.innerHTML=("0"+msg.moment.hour).slice(-2)+":"+("0"+msg.moment.minute).slice(-2);
	var d=Messenger.activeObject.startDate;
	if(d.getMonth()+1 != msg.moment.month || d.getDate()!=msg.moment.day || d.getFullYear()!=msg.moment.year){
		var tm=" , "+msg.moment.day+" "+MonthNames[msg.moment.month];
		if(d.getFullYear()!=msg.moment.year){
			tm+=" "+msg.moment.year;
		}
		info.innerHTML+=tm;
	}
	
	pan.appendChild(info);
	
	var par=document.getElementById('messageArea'+messenger.index);
	if(CMessage.activeDialog){
		par.insertBefore(pan,CMessage.activeDialog);
		par.removeChild(CMessage.activeDialog);
		CMessage.activeDialog=null;
	}else{
		par.appendChild(pan);
		par.appendChild(document.createElement('hr'));
	}
	
	par.scrollTop=par.scrollHeight; //scroll down to the last message
};
CMessage.compare=function(a,b)
{
	return ((a.moment.year * 31536000) + (a.moment.month * 2592000) + (a.moment.day * 86400) + (a.moment.hour * 3600) + (a.moment.minute * 60) + (a.moment.second));
};
CMessage.config=function()
{
	CMessage.ownPopup=new Popup(true);
	CMessage.ownPopup.focusOutMode=true;
	CMessage.ownPopup.items=[
		new PopupItem("Copy",CMessage.onCopyToClipboard,null,null,'copyIcon'),
		new PopupItem("Flag",CMessage.onFlag,null,null,'flagIcon'),
		new PopupItem("Edit",CMessage.onEdit,null,null,'editIcon'),
		new PopupItem("Delete",CMessage.onDelete,null,null,'deleteIcon'),
		new PopupItem("Unsend",CMessage.onUnsend,null,null,'unsendIcon'),
	];
	
	CMessage.audPopup=new Popup(true);
	CMessage.audPopup.focusOutMode=true;
	CMessage.audPopup.items=[
		new PopupItem("Copy",CMessage.onCopyToClipboard,null,null,null),
		new PopupItem("Flag",CMessage.onFlag,null,null,'flagIcon'),
		new PopupItem("Delete",CMessage.onDelete,null,null,'deleteIcon'),
	];
};
CMessage.onEdit=function(e)
{
	if(Messenger.appId==Popup.eventObject.lObj.receiverApp){
		CMessage.activeObject=Popup.eventObject.lObj;
		CMessage.activeDialog=Popup.eventObject;
		var inputTxb=document.getElementById('inputTxb');
		inputTxb.innerHTML=Messenger.unpurizeText(CMessage.activeObject.value);
	}else{
		Messenger.onOpenApp(Popup.eventObject.lObj.receiverApp,Popup.eventObject.lObj);//edit on the app
	}
};
CMessage.onDelete=function(e)
{
	CMOption.update([Popup.eventObject.lObj.id],1);
	Conversation.removeMessages([Popup.eventObject.lObj]);
	Popup.eventObject.parentElement.removeChild(Popup.eventObject);
};
CMessage.onUnsend=function(e)
{
	var msg=Popup.eventObject.lObj;
	msg.value="X";
	Messenger.activeObject.send(msg);
	//Conversation.removeMessages([msg]);
	//Popup.eventObject.parentElement.removeChild(Popup.eventObject);
	Libre.status.show("Unsent : MSG-"+msg.id);
};
CMessage.onFlag=function(e)
{
	var msg=Popup.eventObject.lObj;
	CMOption.update([msg.id],2);
	msg.options=msg.options?parseInt(msg.options)|2:2;
	Conversation.storeMessages(msg);//update the message on client
};
CMessage.onCopyToClipboard=function(e)
{
	Libre.status.show("Copied.");
	var s=document.getElementById('searchTxb');
	var old_text=s.value;
	s.value=Popup.eventObject.lObj.value;
	s.select();
	document.execCommand("copy");
	s.value=old_text;
	
	
};

function Messenger(par,target)
{
	
	this.theme=null;
	this.directMode=null;
	this.currentServer=null;
	this.targetServer=null;
	this.index=null;
	this.dialog=null;
	this.targetUID='';
	this.working=true;
	this.timeoutKeeper=null;
	this.secureKey=null;
	this.startDate=null;
	this.setting=null;
if(!Messenger.list)Messenger.list=[];
this.index=Messenger.list.length;
Messenger.list[this.index]=this;
this.targetServer="";
this.currentServer="";

if(par)Messenger.buildForm(this,1,par);
if(!Messenger.messages)Messenger.messages=[];

//start receiveing
this.working=true;
Messenger.receive();

if(Messenger.messages)Messenger.messages.length=0;
else Messenger.messages=[];

if(target){
	this.targetUID=target;
	var skey=localStorage.getItem(Messenger.currentUID+"_"+target);
	this.secureKey=skey?skey:"None";
}

this.startDate=new Date(Date.now());
	
	this.selectContact=function(uid,phone)
	{
		if(uid){
			var server=UniversalServer.get(6,UniversalServer.getPrefix(uid));
			if(server){
				this.targetServer=server.url;
			}
		}
	};
	this.send=function(o)
	{
		CMessage.send(o,this.currentServer,this.targetServer!=this.currentServer?this.targetServer:"");
		//if(this.targetServer!=this.currentServer)CMessage.send(o,this.targetServer);
		
	};
	this.onSend=function(event)
	{
		this.sendText(_("#inputTxb").value());
		_("#inputTxb").source.innerHTML='';
	};
	this.sendText=function(arg)
	{
		var d=new Date(Date.now());
		var strStamp=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		var msg=null;
		if(CMessage.activeObject){
			msg=CMessage.activeObject;
			msg.value=Messenger.purizeText(arg.trim());
			Conversation.storeMessages(msg);
		}else{
			msg=new CMessage('',Messenger.purizeText(arg.trim()),Messenger.currentUID,this.targetUID,Messenger.appId,Messenger.appId,0);
			var date=new Date(Date.now());
			msg.moment={year:date.getFullYear(),'month':date.getMonth()+1,'day':date.getDate(),'hour':date.getHours(),'minute':date.getMinutes(),'second':date.getSeconds()};
		}
		//CMessage.show(this,msg,true,arg.trim());
		var moment_backup=msg.moment;
		msg.moment=strStamp;
		msg.value=CryptoJS.AES.encrypt(msg.value,this.secureKey).toString();
		this.send(msg);
		msg.value=CryptoJS.AES.decrypt((msg.value),Messenger.activeObject.secureKey).toString(CryptoJS.enc.Utf8);
		msg.moment=moment_backup;
		CMessage.activeObject=null; //clear CMessage.activeObject
		console.log('sendText() has called');
	};
	this.checkInput=function(event)
	{
		if(event.keyCode==13){
			if(event.ctrlKey){
				var sel, range;
				if (window.getSelection) {
				    sel = window.getSelection();
				    if (sel.getRangeAt && sel.rangeCount && (sel.anchorNode.parentElement==inputTxb || sel.anchorNode==inputTxb)) {
				        range = sel.getRangeAt(0);
				        range.deleteContents();
				        var br=document.createElement('br');
				        range.insertNode( br );
				        Messenger.selectEnd(br);
				    }
				}
			}else{
				this.sendText(event.target.innerHTML);
				event.target.innerHTML="";//clear it
			}
		}
	};
	this.exit=function()
	{
		this.working=false;
		Messenger.activeObject=null;
		try{
			clearTimeout(this.timeoutKeeper);
		}catch(ex){console.log("timeout keeper was invalid.");}
	};
};



Messenger.activeMessenger=null;
Messenger.list=null;
Messenger.receiveDelay=50000;
Messenger.currentUID=null;
Messenger.receiveDelay=5000;
Messenger.clearOnRead=true;
Messenger.seenIndex=0;
Messenger.statusDelayMultiplier=1;
Messenger.messages=null;
Messenger.lastMoment=0;
Messenger.appId=6;
Messenger.appList=null;
Messenger.activeAppId=null;
Messenger.showingHolder=null;
Messenger.showingMessage=null;


Messenger.config=function()
{
	Jet.App.register('Messenger',Messenger);
	Jet.App.form.Messenger={};
	//Jet.App.form.Messenger[1]="<div class=\"messageArea\" id=\"messageArea%index%\"></div><div class=\"sendArea h-setbox\"><img src=\"res/image/svg/add-white.svg\" class=\"blue btn\"/><input id=\"inputTxb%index%\" onkeypress=\"Messenger.list[%index%].checkInput(event)\"/><img src=\"res/image/svg/right-arrow-white.svg\" class=\"blue btn\" onclick=\"Messenger.list[%index%].onSend(event)\"/></div>";
	Jet.App.form.Messenger[1]="<tr><td style=\"word-break:break-all;vertical-align: top;\"><div class=\"messengerPan infobox\"><div class=\"messageArea\" id=\"messageArea%index%\"></div></div><div class=\"sendArea h-setbox\"><div id=\"attachArea\" class=\"hide\"><ul><li><img src=\"res/image/png/call.png\"/></li><li onclick=\"Messenger.buildEmojies();\"><img src=\"res/image/png/emojies/1F600.png\"/></li><li onclick=\"Messenger.buildApps();\"><img src=\"res/image/png/app.png\"/></li></ul><div id=\"attachBoard\"></div></div><div class=\"h-setbox\"><img src=\"res/image/svg/add-white.svg\" class=\"blue btn\" onclick=\"_('#attachArea').toggleClass('hide');\"/><div contenteditable=\"true\" class=\"editor\" id=\"inputTxb\" onkeyup=\"Messenger.list[%index%].checkInput(event)\"></div><img src=\"res/image/svg/right-arrow-white.svg\" class=\"blue btn\" onclick=\"Messenger.list[%index%].onSend(event)\"/></div></div></div></td><td class=\"messengerAppArea hide\"><div id=\"msgAppParent\"></div></td></tr>";
	Jet.App.form.Messenger[2]="";
	
	
	Jet.App.form.Messenger1cssClass="workingTable";
	Jet.App.form.Messenger1par="table";
	Jet.App.form.Messenger.userOperation="";
	Jet.App.form.Messenger.ownerOperation=Jet.App.form.Messenger.userOperation+
	"";
	
	//add utc time method to Date object
	
	Date.prototype.getUTCTime = function(){ 
	  return new Date(
	    this.getUTCFullYear(),
	    this.getUTCMonth(),
	    this.getUTCDate(),
	    this.getUTCHours(),
	    this.getUTCMinutes(), 
	    this.getUTCSeconds()
	  ).getTime(); 
	};
	
	CMessage.config();
	Messenger.setting=new MSGSetting();
};
Messenger.buildForm=function(o,view,par)
{
	Messenger.activeObject=o;
	var ctrl=Jet.App.buildForm(o,view,par,"Messenger");
	ctrl.setAttribute("cellspacing","0");
	o.dialog=ctrl;
	Messenger.buildEmojies();
	Libre.onResize(); //also set fixed size to MessageArea
	Messenger.seenIndex=0;
	return ctrl;
	
};
Messenger.receiveBack=function(res)
{
	var app=null; var lastSeen=0;
	if(Messenger.activeAppId){
		app=Messenger.appList[Messenger.activeAppId];
	}
	
	if(typeof(res)=="string")var ls=JSON.parse(res); else var ls=res;
	var ut=0; var ut2=0; var date=null;
	for(var i=0;i<ls.length;i++){
		if(ls[i].receiverApp==Messenger.appId && ls[i].value!="X")//decode only if the message is for messenger itself
			ls[i].value=CryptoJS.AES.decrypt((ls[i].value),Messenger.activeObject.secureKey).toString(CryptoJS.enc.Utf8);
		ut=Date.parse(ls[i].moment.replace(/-/g,"/")+" UTC");
		var date=new Date(ut);
		ut/=1000;
		var last=ut;
		var date2=null;
		if(ls[i].modified){
			ut2=Date.parse(ls[i].modified.replace(/-/g,"/")+" UTC");
			date2=new Date(ut2);
			ut2/=1000;
			if(ut2>ut)last=ut2;
		}
		ls[i].ms=ut;
		if(parseInt(Messenger.lastMoment)<last)Messenger.lastMoment=parseInt(last);
		ls[i].moment={year:date.getFullYear(),'month':date.getMonth()+1,'day':date.getDate(),'hour':date.getHours(),'minute':date.getMinutes(),'second':date.getSeconds()};
		if(date2)
			ls[i].modified={year:date2.getFullYear(),'month':date2.getMonth()+1,'day':date2.getDate(),'hour':date2.getHours(),'minute':date2.getMinutes(),'second':date2.getSeconds()};
		var showing=false;
		if((showing=Messenger.isShowing(ls[i]))){
			var dlg=document.getElementById("MSG_"+ls[i].id);
			if(ls[i].value=="X"){
				dlg.parentElement.removeChild(dlg);
				Conversation.removeMessages(ls[i]);
				ls[i]=null;
				continue; //skip remaining of the loop
			}else{
				if(ls[i].ms>Messenger.showingHolder.ms)Messenger.showingHolder.ms=ls[i].ms;//update the ms for Messenger.getStatus
				CMessage.activeDialog=dlg;
			}
		}else{
			if(ls[i].value=="X"){
				ls[i]=null; continue;
			}
			Messenger.messages.push(ls[i]);
		}
		var mine=Messenger.activeObject.targetUID==ls[i].sender?false:true;
		if(
			((Messenger.activeObject.targetUID==ls[i].sender || !showing) && ls[i].receiverApp==Messenger.appId) 
			|| 
			(ls[i].receiverApp!=Messenger.appID && !showing)
		){
			CMessage.show(Messenger.activeObject,ls[i],mine);
			if(last>lastSeen)lastSeen=last;
			if(Messenger.activeObject.targetUID==ls[i].sender)Messenger.updateStatus("seen"); //if you get message from the audience it means he seen all of your messages
			
		}
		CMessage.activeDialog=null; //clear it
		if(app){
			if(app.activeCMessage.id==ls[i].id){
				Messenger.onUpdateAppData(Messenger.activeAppId,ls[i]);
				if(last>lastSeen)lastSeen=last;
			}
		}
	}
	if(last){
		localStorage.setItem('lastMoment',Messenger.lastMoment);
		if(Messenger.setting.broadcastReceiveTime)ConvStat.update(Messenger.lastMoment,Messenger.currentUID);
		if(Messenger.setting.broadcastSeenTime && lastSeen>0)ConvStat.update(lastSeen,Messenger.currentUID,Conversation.activeObject.id);
	}
	//receive messages again
	if(Messenger.activeObject.working)Messenger.activeObject.timeoutKeeper=setTimeout(Messenger.receive,Messenger.receiveDelay);
	if(typeof(Conversation)!="undefined" && ls.length>0){
		Conversation.storeMessages(ls);
	}
};
Messenger.isMobile=function()
{
	return (window.getComputedStyle(_("#audienceTxb").source).display=="none");
};
Messenger.updateStatus=function(stat)
{
	var ls=Messenger.messages;
	if(stat=="seen"){
		for(var i=Messenger.seenIndex;i<ls.length;i++){
			_("#status"+ls[i].id).attr('class','info msg-status seen');
		}
		Messenger.seenIndex=i;
	}else{
		for(var i=Messenger.seenIndex;i<ls.length;i++){
			if((ls[i].ms<=stat.lastSeen && ls[i].ms>0) || ls[i].receiver==Messenger.currentUID){
				_("#status"+ls[i].id).attr('class','info msg-status seen');
				if(ls[i].receiver!=Messenger.currentUID)Messenger.seenIndex=i;
			}else if(ls[i].ms<=stat.lastReceive){
				_("#status"+ls[i].id).attr('class','info msg-status received');
			}else _("#status"+ls[i].id).attr('class','info msg-status');
		}
	}
};
Messenger.getStatus=function(res)
{
	if(res){
		var seen_index=Messenger.seenIndex;
		Messenger.updateStatus(JSON.parse(res));
		if(Messenger.seenIndex>seen_index)Messenger.statusDelayMultiplier=1; //reset multiplier if index was changed
	}else{
		if(Messenger.seenIndex<Messenger.messages.length-1){
			ConvStat.status(Messenger.activeObject.targetUID,Conversation.activeObject.id,Messenger.getStatus);
			setTimeout(Messenger.getStatus,Messenger.receiveDelay*Messenger.statusDelayMultiplier);
			Messenger.statusDelayMultiplier++;
		}
	}
};
Messenger.checkLastStatus=function()
{
	var ls=Messenger.messages;
	if(ls.length>0){
		if(ls[ls.length-1].sender==Messenger.currentUID)Messenger.getStatus(); //check for user seen/received status
		else Messenger.updateStatus('seen'); //set all messages to seen if last message is from the audience
	}
};
Messenger.receive=function()
{
	if(Messenger.lastMoment===0){
		var v=parseInt(localStorage.getItem('lastMoment'));
		if(v){
			Messenger.lastMoment=v;//parseInt(new Date(v*1000).getUTCTime()/1000);
		}else Messenger.lastMoment=1; //stop loading from local storage
	}
	LU.globalCallback=Messenger.receiveBack;
	CMessage.receive(null,Messenger.lastMoment,"",Messenger.clearOnRead);
};
Messenger.buildEmojies=function()
{
	var aboard=document.getElementById('attachBoard');
	aboard.innerHTML="";
	var em=document.createElement('ul');
	aboard.appendChild(em);
	var keys=Object.keys(Emojies);
	var li=null; var img=null;
	for(var i=0;i<keys.length;i++){
		li=document.createElement("li");
		img=document.createElement("img");
		img.setAttribute("src","res/image/png/emojies/"+parseInt(keys[i]).toString(16).toUpperCase()+".png");
		li.appendChild(img);
		li.setAttribute("onclick","Messenger.setEmoji("+keys[i]+");");
		em.appendChild(li);
	}
};
Messenger.setEmoji=function(emcode)
{
	var src=Emojies[emcode];
	if(!src)src="res/image/png/emojies/"+emcode.toString(16).toUpperCase()+".png";
	var img=document.createElement("img");
	img.setAttribute("data",emcode);
	img.setAttribute("src",src);
	img.setAttribute("type","emoji");
	var inputTxb=document.getElementById('inputTxb');
	var sel, range;
	if (window.getSelection) {
	    sel = window.getSelection();
	    if (sel.getRangeAt && sel.rangeCount && (sel.anchorNode.parentElement==inputTxb || sel.anchorNode==inputTxb)) {
	        range = sel.getRangeAt(0);
	        range.deleteContents();
	        range.insertNode( img );
	        Messenger.selectEnd();
	    }else{
	    	inputTxb.appendChild(img);//add emoji to the end of the input box
	    }
	} else if (document.selection && document.selection.createRange) {
	    //document.selection.createRange().text = text;
	}
};
Messenger.purizeText=function(txt)
{
	var pat=/<img\s+data=\"([^\"]+)\"\s+src=\"([^\"]+)\"\s+type=\"([^\"]+)\"\/>/g;
	var r=null;
	while((r=pat.exec(txt))){
		var rp="&em"+r[1]+";";
		txt=txt.replace(r[0],rp);
	}
	return txt;
};
Messenger.unpurizeText=function(txt)
{
	var pat=/\&em(\d+);/g;
	//var pat=/<img\s+data=\"([^\"]+)\"\s+src=\"([^\"]+)\"\s+type=\"([^\"]+)\"\/>/g;
	var r=null;
	while((r=pat.exec(txt))){
		var src=Emojies[parseInt(r[1])];
		if(!src)src="res/image/png/emojies/"+emcode.toString(16).toUpperCase()+".png";
		var rp="<img src=\""+src+"\" type=\"emoji\" data=\""+emcode+"\"/>";
		txt=txt.replace(r[0],rp);
	}
	return txt;
};
Messenger.selectEnd=function(node)
{
	var sel=document.getSelection();
	var range=document.createRange();
	if(!node)node=sel.anchorNode;
	var ao=node.length?node.length:0;
	var offset=sel.extentOffset>ao?sel.extentOffset:ao;
	range.setStart(node,offset);
	range.setEnd(node,offset);
	sel.removeAllRanges();
	sel.addRange(range);
};
Messenger.onCreateApp=function(appid)
{
	var appClass=Messenger.appList[appid];
	if(appClass.loaded){
		var data=appClass.create();
	
		var d=new Date(Date.now());
		var strStamp=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		var msg=new CMessage('',data,Messenger.currentUID,Messenger.activeObject.targetUID,Messenger.appId,appid,0);
		msg.status=32; //set as bidirectional message
		var date=new Date(Date.now());
		//CMessage.show(Messenger.activeObject,msg,true,data);
		msg.moment=strStamp;
		//msg.value=CryptoJS.AES.encrypt(msg.value,Messenger.activeObject.secureKey).toString();
		Messenger.activeObject.send(msg);
		//convert moment to object rather than string
		msg.moment={year:date.getFullYear(),'month':date.getMonth()+1,'day':date.getDate(),'hour':date.getHours(),'minute':date.getMinutes(),'second':date.getSeconds()};
	}else{
		appClass.loadResourceCallback=function(){
			Messenger.onCreateApp(arguments.callee.appid);
		};
		appClass.loadResourceCallback.appid=appid;
		appClass.loadResources("service/"+appid+"/");
	}
};
Messenger.onOpenApp=function(appid,msg)
{
	Messenger.activeAppId=appid;
	
	var appClass=Messenger.appList[appid];
	appClass.currentUID=Messenger.currentUID;
	Libre.sidebar.visible(false);
	_(".messengerAppArea").removeClass("hide");
	_("#closeAppBtn").removeClass("hide");
	var msgAppPar=Messenger.activeObject.dialog.querySelector('#msgAppParent');
	if(appClass.loaded){
		//msg=Object.create(msg);
		//msg.value=CryptoJS.AES.decrypt((msg.value),Messenger.activeObject.secureKey).toString(CryptoJS.enc.Utf8);
		msgAppPar.style.height="calc(100% - "+document.querySelector('.sendArea').offsetHeight+"px)";
		appClass.openByCuad(msg,msgAppPar);
	}else{
		appClass.loadResourceCallback=function(){
			Messenger.onOpenApp(Messenger.activeAppId,arguments.callee.msg);
		};
		appClass.loadResourceCallback.msg=msg;
		appClass.loadResources("service/"+appid+"/");
	}
	
	if(Messenger.isMobile())document.querySelector(".messageArea").style.display="none";
};
Messenger.onEditAppData=function(msg)
{
	//msg.value=CryptoJS.AES.encrypt(msg.value,Messenger.activeObject.secureKey).toString();
	Messenger.activeObject.send(msg);
	Conversation.storeMessages(msg);
};
Messenger.onUpdateAppData=function(appid,msg)
{
	var appClass=Messenger.appList[appid];
	//msg=Object.create(msg);
	//msg.value=CryptoJS.AES.decrypt((msg.value),Messenger.activeObject.secureKey).toString(CryptoJS.enc.Utf8);
	var msgAppArea=Messenger.activeObject.dialog.querySelector('.messengerAppArea');
	appClass.reloadByCuad(msg,msgAppArea);
};
Messenger.getMessageById=function(id)
{
	for(var i=0;i<Messenger.messages.length;i++)if(Messenger.messages[i].id==id)return Messenger.messages[i];
	return null;
};
Messenger.buildApps=function()
{
	var aboard=document.getElementById('attachBoard');
	aboard.innerHTML="";
	var em=document.createElement('ul');
	aboard.appendChild(em);
	var keys=Object.keys(Messenger.appList);
	var li=null; var img=null;
	for(var i=0;i<keys.length;i++){
		li=document.createElement("li");
		img=document.createElement("img");
		img.setAttribute("src","service/"+keys[i]+"/res/image/png/logo72.png");
		li.setAttribute("title",Messenger.appList[keys[i]].title);
		li.appendChild(img);
		li.setAttribute("onclick","Messenger.onCreateApp("+keys[i]+");");
		em.appendChild(li);
	}
};
Messenger.closeApp=function()
{
	document.querySelector("#msgAppParent").innerHTML="";
	_(".messengerAppArea").addClass("hide");
	_("#closeAppBtn").addClass("hide");
	document.querySelector(".messageArea").style.display="";
	Messenger.activeAppId=null;
};
Messenger.isShowing=function(msg)
{
	for(var i=0;i<Messenger.messages.length;i++){
		if(Messenger.messages[i].id==msg.id){
			Messenger.showingHolder=Messenger.messages[i];
			return true;
		}
	}
	return false;
};
Messenger.onHome=function()
{
	if(Messenger.activeObject)Messenger.activeObject.exit();
	_("#msgAudPar").addClass('hide');
	FLHome.show(_('#workPan').source);
};
Messenger.onSetting=function()
{
	if(Messenger.activeObject)Messenger.activeObject.exit();
	_("#msgAudPar").addClass('hide');
	FLSetting.show(_('#workPan').source);
};
Messenger.showFlags=function(res)
{
	if(typeof(res)=="undefined"){
		Messenger.onHome();//go to homepage
		Conversation.searchMessage("",null,0,50,2,Messenger.showFlags);//search in messages, here '2' is an option to search only flaged messages
	}else{
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
			_("#resultArea").source.innerHTML="";
			var stype=new SearchType('Flaged Messages','msg',10,items);
			SearchType.buildForm(stype,1,"resultArea");
		}else{
			_("#resultArea").value("There is no flaged message yet.");
		}
	}
};
Messenger.showMeOnSidebar=function(uinfo)
{
	var picture=CloudFile.getUrlByCode(uinfo.picture);
	if(!picture)picture="res/image/png/user.png";
	_("#profileImg").attr('src',picture);
	_("#profileTitle").value(uinfo.title);
};
Messenger.onLogout=function()
{
	if(confirm('are you sure to logout?')){
		CAuth.logout(function(){window.location.href='login.html';});
	}
};
Messenger.navigate=function(msg)
{
	if(msg){
		Messenger.showingMessage=msg;
		Conversation.start(msg.conv,Messenger.navigate);
	}else{
		Messenger.scrollTo(Messenger.showingMessage);
	}
};
Messenger.scrollTo=function(msg)
{
	var dialog=_("#MSG_"+Messenger.showingMessage.id).source;
	if(Messenger.activeObject){
		var ma=Messenger.activeObject.dialog.querySelector('.messageArea');
		ma.scrollTop=dialog.offsetTop-10;
	}
};

function Conversation(uid,title,picture)
{
	
	this.uid=null;
	this.title=null;
	this.picture=null;
	this.id=null;
this.uid=uid; this.title=title; this.picture=picture;
};



Conversation.listo=null;
Conversation.activeObject=null;
Conversation.showingContact=0;
Conversation.allUIDs=null;
Conversation.contactIndex=0;
Conversation.activeParam=null;
Conversation.startCallback=null;
Conversation.db=null;
Conversation.convOS=null;
Conversation.msgOS=null;
Conversation.audIconPopup=null;


Conversation.save=function(o)
{
	var transaction=Conversation.db.transaction(["convOS"],"readwrite");
	transaction.objectStore("convOS").add(o);
};
Conversation.install=function()
{
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	
	var request=window.indexedDB.open(Messenger.currentUID+"cuadMSG",1);
	request.onsuccess=function(event){
		Conversation.db=event.target.result;
		Conversation.search('');
	};
	request.onerror=function(event){
		
	};
	request.onupgradeneeded=function(event){
		Conversation.db=event.target.result;
		Conversation.convOS=Conversation.db.createObjectStore("convOS",{keyPath:"uid"});
		Conversation.msgOS=Conversation.db.createObjectStore("msgOS",{keyPath:["id","sender","receiver"]});
		
		Conversation.convOS.createIndex("title","title",{unique:false});
		Conversation.msgOS.createIndex("conv","conv",{unique:false});
		Conversation.msgOS.createIndex("sortConv",["conv","ms"],{unique:false});
	};
	
};
Conversation.load=function(uid,stato)
{
	var transaction=Conversation.db.transaction(["convOS"],"readwrite");
	transaction.onsuccess=function(e){};
	transaction.onerror=function(e){};
	
	var objectStore=transaction.objectStore('convOS');
	var request=objectStore.get(uid);
	request.objectStore=objectStore;
	request.onsuccess=function(e){
		var res=null;
		if(e.target.result) res=e.target.result;
		else{
			var uinfo=null;
			if((uinfo=UserInfo.list[uid])){
				var picture=CloudFile.getUrlByCode(uinfo.picture);
				if(!picture)picture="res/image/png/conversation.png";
				res=new Conversation(uid,uinfo.title,picture);
			}else{
				var callback=function(e){
					var picture=CloudFile.getUrlByCode(e.picture);
					if(!picture)picture="res/image/png/conversation.png";
					res=new Conversation(e.uid,e.title,picture);
					if(!Conversation.listo)Conversation.listo={};Conversation.listo[res.uid]=res; //keep conversation somewhere
					Conversation.save(res);
					Conversation.buildForm(res,2,"convArea");
					if(arguments.callee.stato){
						_("#convCount"+e.uid).value(arguments.callee.stato.count);
						_("#convCount"+e.uid).removeClass('hide');
					}
				};
				callback.stato=stato;
				UserInfo.get(uid,callback);
				return;
			}
		}
		if(!Conversation.listo)Conversation.listo={};Conversation.listo[res.uid]=res; //keep conversation somewhere
		Conversation.buildForm(res,2,"convArea");
		if(stato){
			_("#convCount"+uid).value(stato.count);
			_("#convCount"+uid).removeClass('hide');
		}
		//Conversation.loadMessages(uid);
	};
};
Conversation.search=function(param,order,contacts,dl,ul,callback)
{
	_("#convArea").source.innerHTML=''; _("#contactArea").source.innerHTML='';
	param=param.toLowerCase();
	if(!Conversation.listo)Conversation.listo={};
	var request=Conversation.db.transaction(['convOS'],'readonly').objectStore('convOS').openCursor();
	Conversation.listo={};//clear the list
	request.onsuccess=function(e){
		var cursor=e.target.result;
		if(cursor){
			if(cursor.value.title.toLowerCase().indexOf(this.param)>=0){
				Conversation.buildForm(cursor.value,2,"convArea");
				Conversation.listo[cursor.value.uid]=cursor.value; //keep conversation somewhere
			}
			cursor.continue();
		}else{
			if(this.callback)this.callback(Conversation.listo);
			else if(contacts)Conversation.showContacts(param,true);
		}
	};
	request.callback=callback;
	request.param=param;
};
Conversation.config=function()
{
	Jet.App.register('Conversation',Conversation);
	Jet.App.form.Conversation={};
	Jet.App.form.Conversation[1]="";
	Jet.App.form.Conversation[2]="<img src=\"%picture%\" onerror=\"Conversation.defaultImage(event);\" class=\"avatar\"/><span id=\"titleOf%uid%\">%title%</span><img src=\"res/image/png/option.png\" class=\"option\" onclick=\"ConvSetting.onEdit('%uid%');stopProp(event);\"/><span class=\"msgCount\" id=\"convCount%uid%\">0</span>";
	Jet.App.form.Conversation2par='li';
	Jet.App.form.Conversation.userOperation="";
	Jet.App.form.Conversation.ownerOperation=Jet.App.form.Conversation.userOperation+
	"";
	
	//start getting conversation
	setTimeout(Conversation.get,1000); //load after 1 second
	
	Conversation.audIconPopup=new Popup(true);
	Conversation.audIconPopup.focusOutMode=true;
	Conversation.audIconPopup.items=[
		new PopupItem("Name",null,null,null,null),
		new PopupItem("Setting",Conversation.onEditAudience,null,null,null)
	];
	Popup.set(document.getElementById('msgAud'),Conversation.audIconPopup);
};
Conversation.buildForm=function(o,view,par)
{
	if(view==2){
		par=typeof(par)=="object"?par:document.getElementById(par);
		if((cnv=par.querySelector('#conversation'+o.uid)))cnv.parentElement.removeChild(cnv);
	}
	var c= Jet.App.buildForm(o,view,par,"Conversation"); //<li id=\"conversation%uid%\" onclick=\"\">
	if(view==2){
		c.setAttribute("onclick","Conversation.start('%uid%');".replace('%uid%',o.uid));
		c.setAttribute("id","conversation"+o.uid);
		c.setAttribute("uid",o.uid);
		_("#convCount"+o.uid).value('0');
		_("#convCount"+o.uid).addClass('hide');
	}
	return c;
};
Conversation.start=function(uid,callback)
{
	//update conversation id first
	ConvStat.get(Messenger.currentUID,uid);
	Conversation.startCallback=callback;
	//remove from contactArea
	var ctrl=_("#contactArea").source.querySelector('#conversation'+uid);
	if(ctrl)ctrl.parentElement.removeChild(ctrl);
	
	//close sidebar if mobile mode
	if(Messenger.isMobile()){
		Libre.sidebar.visible(false);
	}
	
	var allow=true;
	if(Messenger.activeObject){
		if(Messenger.activeObject.targetUID==uid)allow=false;
		else{
			var olduid=Messenger.activeObject.targetUID;
			_("#conversation"+olduid).removeClass('active');
			Messenger.activeObject.exit(); //exit last conversation
		}
	}
	if(allow){
		var transaction=Conversation.db.transaction(["convOS"],"readwrite");
		transaction.onsuccess=function(e){};
		transaction.onerror=function(e){};
		
		var objectStore=transaction.objectStore('convOS');
		var request=objectStore.get(uid);
		request.objectStore=objectStore;
		request.onsuccess=function(e){
			if(e.target.result){
				Conversation.configMessenger(e.target.result);
			}else{
				var title=uid;  var uinfo=null;
				if((uinfo=UserInfo.list[uid])){
					var picture=CloudFile.getUrlByCode(uinfo.picture);
					if(!picture)picture="res/image/png/user.png";
					var conv=new Conversation(uid,uinfo.title,picture);
					Conversation.configMessenger(conv);
					Conversation.save(conv);
				}else{
					UserInfo.get(uid,function(e){
						var picture=CloudFile.getUrlByCode(uinfo.picture);
						if(!picture)picture="res/image/png/user.png";
						var conv=new Conversation(e.uid,e.title,picture);
						Conversation.configMessenger(conv);
						Conversation.save(conv);
					});
				}
			}
		};
	}
};
Conversation.configMessenger=function(conv)
{
	Libre.work.show('');
	Conversation.activeObject=conv;
	var messenger=new Messenger(_("#workPan").source,conv.uid);
	//messenger.targetUID=conv.uid;
	Conversation.buildForm(conv,2,"convArea");
	Conversation.loadMessages(conv.uid);
	_("#convCount"+conv.uid).addClass('hide');//remove showing mark
	_("#convCount"+conv.uid).value('0');
	_("#conversation"+conv.uid).addClass('active');
	_("#audienceTxb").value("&#10145; "+conv.title);
	Conversation.audIconPopup.items[0].title=conv.title;
	Conversation.audIconPopup.items[1].command.uid=conv.uid;
	//load messages
	
	_("#msgAudPar").removeClass('hide');
	TextAvatar.getTextAvatar(conv.title,"msgAudPar",null,null,2);
	
};
Conversation.UInfoSetTitle=function(uinfo)
{
	_("#titleOf"+uinfo.uid).value(uinfo.title);
};
Conversation.bind=function(o,ctrl,view)
{
	if(view==2){
		ctrl.setAttribute("title",o.title);
	}
};
Conversation.showContacts=function(param,noneExists,dl,ul)
{
	if(!dl)dl=0; if(!ul)ul=20; Conversation.showingContact=0; Conversation.contactIndex=0;
	Conversation.allUIDs=Object.keys(FollowContact.list);
	Conversation.activeParam=param;
	Conversation.stepShowContact();
};
Conversation.checkUserInfo=function(uinfo)
{
	if(uinfo.title.toLowerCase().indexOf(Conversation.activeParam)>=0){
		var picture=CloudFile.getUrlByCode(uinfo.picture);
		if(!picture)picture="res/image/png/conversation.png";
		var conv=new Conversation(uinfo.uid,uinfo.title,picture);
		Conversation.buildForm(conv,2,"contactArea");
		_("#convCount"+conv.uid).addClass('hide');//remove showing mark
		_("#convCount"+conv.uid).value('0');
		Conversation.showingContact++;
	}
	Conversation.stepShowContact();
};
Conversation.stepShowContact=function()
{
	var uid=Conversation.allUIDs[Conversation.contactIndex];
	if(uid){
		Conversation.contactIndex++;
		if(!Conversation.listo[uid]){
			var uinfo=UserInfo.get(uid,Conversation.checkUserInfo);
			if(uinfo){
				Conversation.checkUserInfo(uinfo);
			}
		}else Conversation.stepShowContact();
	}
};
Conversation.defaultImage=function(e)
{
	var avatar=document.createElement('span');
	avatar.setAttribute("class","avatar");
	var title=e.target.parentElement.getAttribute('title');
	
	e.target.parentElement.insertBefore(avatar,e.target);
	e.target.parentElement.removeChild(e.target);
	
	TextAvatar.getTextAvatar(title,avatar,null,null,2);
	//e.target.setAttribute("src","res/image/png/user.png");
};
Conversation.storeMessages=function(messages)
{
	var objectStore=Conversation.db.transaction(["msgOS"],"readwrite").objectStore('msgOS');
	var stfn=function(msg){
		if(msg){/* not null msg */
			if(msg.sender!=Messenger.currentUID)msg.conv=msg.sender; else msg.conv=msg.receiver;
			objectStore.put(msg);
		}
	};
	if(messages instanceof Array)messages.forEach(stfn);
	else stfn(messages); //if messages is a single message object
};
Conversation.get=function(arg,last)
{
	if(arg){
		var ls=JSON.parse(arg);
		for(var i=0;i<ls.length;i++){
			Conversation.load(ls[i].uid,ls[i]);
		}
		setTimeout(Conversation.get,Messenger.receiveDelay*3);
	}else{
		var n=new NetData();
		n.url="client/Conversation/get/"; n.callback=Conversation.get; n.add('time',Messenger.lastMoment?Messenger.lastMoment:parseInt(localStorage.lastMoment)).commit();
	}
};
Conversation.loadMessages=function(uid)
{
	var index=Conversation.db.transaction(['msgOS'],'readonly').objectStore('msgOS').index("sortConv");
	
	index.openCursor(IDBKeyRange.bound([uid,0],[uid,parseInt(Date.now()/1000)])).onsuccess=function(e){
		var cursor=e.target.result;
		if(cursor){
			Messenger.messages.push(cursor.value);
			cursor.continue();
		}else{
			//show all messages
			var lastSeen=0;
			for(var i=0;i<Messenger.messages.length;i++){
				CMessage.show(Messenger.activeObject,Messenger.messages[i],Messenger.messages[i].sender==Messenger.currentUID?true:false);
				if(lastSeen<Messenger.messages[i].ms)lastSeen=Messenger.messages[i].ms;
			}
			if(Messenger.setting.broadcastSeenTime && lastSeen>0)ConvStat.update(lastSeen,Messenger.currentUID,Conversation.activeObject.id);
			Messenger.checkLastStatus();
			if(Conversation.startCallback){
				Conversation.startCallback();
				Conversation.startCallback=null;
			}
		}
	};
};
Conversation.removeMessages=function(messages)
{
	var objectStore=Conversation.db.transaction(["msgOS"],"readwrite").objectStore('msgOS');
	var stfn=function(msg){
		objectStore.delete([msg.id,msg.sender,msg.receiver]);
	};
	if(messages instanceof Array)messages.forEach(stfn);
	else stfn(messages); //if messages is a single message object
};
Conversation.onEditAudience=function(e)
{
	ConvSetting.onEdit(arguments.callee.uid);
	stopProp(event);
};
Conversation.setId=function(res)
{
	Conversation.activeObject.id=parseInt(res);
};
Conversation.delete=function(uid,del_conversation)
{
	var index=Conversation.db.transaction(['msgOS'],'readwrite').objectStore('msgOS').index("sortConv");
	
	var req=index.openCursor(IDBKeyRange.bound([uid,0],[uid,parseInt(Date.now()/1000)]));
	req.onsuccess=function(e){
		var cursor=e.target.result;
		if(cursor){
			cursor.delete(); //delete object
			cursor.continue();
		}else{
			var callback=function(){
				Conversation.deleteFinalyze(arguments.callee.audience);
			};
			callback.audience=this.audience;
			CMOption.deleteAll(null,this.audience,callback);
		}
	};
	req.audience=uid;
	
	if(del_conversation){
		var request=Conversation.db.transaction(['convOS'],'readwrite').objectStore('convOS').delete(uid);
	}
};
Conversation.deleteFinalyze=function(audience)
{
	if(Messenger.targetUID==audience){
		Messenger.activeObject.exit();
		Messenger.onHome();
	}
	Libre.log('The conversation has been deleted.');
	if((conv=_("#conversation"+audience))){
		conv.source.parentElement.removeChild(conv.source);
	}
};
Conversation.searchMessage=function(param,uid,dl,count,option,callback)
{
	var keyrange=null;
	if(uid){
		var place=Conversation.db.transaction(['msgOS'],'readwrite').objectStore('msgOS').index("sortConv");
		keyrange=IDBKeyRange.bound([uid,0],[uid,parseInt(Date.now()/1000)]);
	}else{
		var place=Conversation.db.transaction(['msgOS'],'readwrite').objectStore('msgOS');
	}
	var req=place.openCursor(keyrange);
	req.onsuccess=function(e){
		var cursor=e.target.result;
		if(cursor && this.out_result.length<this.count){
			if((!this.audience || cursor.value.conv==this.audience)&&(!this.option || (cursor.value.options&this.option)>0)){
				if(cursor.value.value.indexOf(param)>-1)this.out_result.push(cursor.value);
			}
			cursor.continue();
		}else{
			if(this.callback)this.callback(this.out_result);
		}
	};
	req.audience=uid;
	req.param=param;
	req.count=count?count:10;
	req.out_result=[];
	req.callback=callback;
	req.option=option;
};

function ConvSetting(uid,skey)
{
	
	this.uid=null;
	this.skey=null;
	this.activeObject=null;
this.uid=uid; this.skey=skey;
};




ConvSetting.config=function()
{
	Jet.App.register('ConvSetting',ConvSetting);
	Jet.App.form.ConvSetting={};
	Jet.App.form.ConvSetting[1]="<div class=\"ContactSetting\"><img id=\"profilePic\"/></div><table><tr><td>Security Key</td><td><input class=\"textbox\" onchange=\"ConvSetting.onChangeKey(event);\" value=\"%skey%\"/></td></tr><tr><td></td><td><hr/></td></tr><tr><td>Storage</td><td><p><button class=\"blue btn\" onclick=\"Conversation.delete('%uid%',false);\"> Delete messages and keep the audience on the list </button></p><p><button class=\"red btn\" onclick=\"Conversation.delete('%uid%',true);Conversation.remove('%uid%');\"> Delete the conversation and all messages </button></p></td></tr></table>";
	Jet.App.form.ConvSetting[2]="";
	
	Jet.App.form.ConvSetting.userOperation="";
	Jet.App.form.ConvSetting.ownerOperation=Jet.App.form.ConvSetting.userOperation+
	"";
};
ConvSetting.buildForm=function(o,view,par)
{
	ConvSetting.activeObject=o;
	return Jet.App.buildForm(o,view,par,"ConvSetting");
};
ConvSetting.onChangeKey=function(evt)
{
	ConvSetting.activeObject.skey=evt.target.value.trim();
	localStorage.setItem(Messenger.currentUID+"_"+ConvSetting.activeObject.uid,evt.target.value.trim());
};
ConvSetting.onEdit=function(uid)
{
	Libre.work.show('');
	if(Messenger.activeObject)Messenger.activeObject.exit();
	var skey=localStorage.getItem(Messenger.currentUID+"_"+uid);
	if(!skey)skey="None";
	var o=new ConvSetting(uid,skey);
	ConvSetting.buildForm(o,1,"workPan");
	var conv=Conversation.listo[uid];
	if(conv){
		_("#audienceTxb").value("&#10145; "+conv.title);
	}
};
ConvSetting.bind=function(o,ctrl,view)
{
	if(view==1){
		
		_("#profilePic").attr('src',Conversation.listo[o.uid].picture);
	}
};
ConvSetting.onErrorImage=function(e)
{
	e.target.parentElement.removeChild(e.target);//remove image box if unable to load image
};

function CMOption()
{
	
	this.id=null;
	this.uid=null;
	this.option=null;
};



CMOption.table='cmopt';


CMOption.update=function(ids,option,uid)
{
	var n=new NetData();
	n.url="client/CMOption/update/";
	n.add('ids',JSON.stringify(ids),true).add('option',option).commit();
};
CMOption.deleteAll=function(uid,audience,callback)
{
	var n=new NetData();
	n.url="client/CMOption/deleteAll/";
	if(callback)n.callback=callback;
	n.add('audience',audience).commit();
};

function CMStatus()
{
	
	this.id=null;
	this.option=null;
	this.sentTime=null;
	this.receivedTime=null;
	this.seenTime=null;

};



CMStatus.table='cmstat';


CMStatus.update=function(ids,option,timing)
{
	var n=new NetData();
	n.url="client/CMStatus/update/";
	n.add('ids',JSON.stringify(ids),true).add('option',option).commit();
};

function ConvStat(uid,conversation,receive,seen)
{
	
	this.uid=null;
	this.conversation=null;
	this.lastReceive=null;
	this.lastSeen=null;
this.uid=uid?uid:null; this.conversation=conversation?conversation:0; this.lastReceive=receive?receive:0; this.lastSeen=seen?seen:0;
};



ConvStat.table='conestat';


ConvStat.status=function(uid,conversation,callback)
{
	var n=new NetData();n.onerror=null;
	n.url="client/ConvStat/status/";
	n.callback=callback?callback:Messenger.updateStatus;
	n.ifAdd(conversation,'conversation',conversation).add('uid',uid).commit();
};
ConvStat.update=function(moment,uid,conversation)
{
	var n=new NetData();n.onerror=null;
	n.url="client/ConvStat/update/";
	n.ifAdd(conversation,'conversation',conversation).add('uid',uid).add('moment',moment).commit();
};
ConvStat.get=function(uid1,uid2)
{
	var n=new NetData();n.onerror=null;
	n.url="client/ConvStat/get/";
	n.callback=Conversation.setId;
	n.add('uid1',uid1).add('uid2',uid2).commit();
};

function MSGSetting(receiveTime,seenTime)
{
	
	this.broadcastReceiveTime=true;
	this.broadcastSeenTime=true;
this.broadcastReceiveTime=typeof(receiveTime)!='undefined'?receiveTime:true; this.broadcastSeenTime=typeof(seenTime)!='undefined'?seenTime:true;
};



