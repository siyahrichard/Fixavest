function FollowContact(owner,related,status,time)
{
	
	this.owner=null;
	this.related=null;
	this.time=null;
	this.status=null;
this.owner=owner; this.related=related; this.status=parseInt(status); this.time=time?parseInt(time):parseInt(Date.now()/1000);
};



FollowContact.net=null;
FollowContact.list=null;
FollowContact.servers=null;
FollowContact.uid=null;
FollowContact.index=null;
FollowContact.ORequest=1;
FollowContact.OFollow=2;
FollowContact.OFriend=4;
FollowContact.OBlock=8;
FollowContact.RRequest=16;
FollowContact.RFollow=32;
FollowContact.RFriend=64;
FollowContact.RBlock=128;
FollowContact.prefix='jtaht';
FollowContact.table='fcontactTb';
FollowContact.activeObject=null;
FollowContact.lastUpdate=null;
FollowContact.server=null;
FollowContact.isReady=false;
FollowContact.summeryServer='http://summery.abrapp3.ml/';
FollowContact.RDeviceContact=256;


FollowContact.save=function(fc)
{
	var n=new NetData();
	n.url="client/FollowContact/save/"; if(LU.peopleRoot)n.url=LU.peopleRoot+n.url;
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.add("data",JSON.stringify(o)).commit();
};
FollowContact.read=function(user,time)
{
	if(typeof(localStorage)!="undefined")
	{
	    if(!FollowContact.net)FollowContact.net=new NetworkTransfer();
	    //FollowContact.list={};
	    var fcs=localStorage.getItem("fc"+FollowContact.uid);
	    FollowContact.lastUpdate=localStorage.getItem("fcLastUpdate"+FollowContact.uid);
	    if(!FollowContact.lastUpdate)FollowContact.lastUpdate=0;
	    if(fcs)FollowContact.list=JSON.parse(fcs);
	    else FollowContact.list={};
	    //read news
	    if(!time)time=0;
	    var n=new NetData();
	    n.callback=FollowContact.readBack;
	    n.url="client/FollowContact/read/";
	    if(LU.peopleRoot)n.url=LU.peopleRoot+n.url;
	    n.add("param","readByTime").ifAdd(time,"time",time).ifAdd(!time,"time",FollowContact.lastUpdate).commit();
	}
};
FollowContact.reload=function(res)
{
	var keys=Object.keys(FollowContact.servers);
	if(typeof(arg)!="undefined")
	{
	    /*FollowContact.list=FollowContact.list.concat(FollowContact.parse(arg));
	    if(typeof(localStorage)!=="undefined")
	    {
	        localStorage.setItem(keys[FollowContact.index-1],arg);
	    }*/
	}
	else FollowContact.list={}; // this will run only first time
	
	if(FollowContact.index>=0 && FollowContact.index<keys.length)
	{
	    var n=new NetData();
	    n.url=FollowContact.servers[keys[FollowContact.index]]+"/client/fcontact/read/";
	    n.callback=FollowContact.reload;
	    n.commit();
	    FollowContact.index++;
	}
	else FollowContact.index=0;
};
FollowContact.parseUid=function(uid,server,id)
{
	if(typeof(server)=="undefined")server=false;
	if(typeof(id)=="undefined")id=false;
	
	pat=/([a-zA-Z]+)(\d+)/;
	matches=pat.exec(uid);
	if(server && id)return [matches[1],matches[2]];
	else if(server)return matches[1];
	else return matches[2];
};
FollowContact.exists=function(uid)
{
	for(var i in FollowContact.list)if(FollowContact.list[i].owner==uid || FollowContact.list[i].related==uid)return FollowContact.list[i];
	//if(FollowContact.list)if(FollowContact.list[uid])return FollowContact.list[uid];
	return null;
};
FollowContact.changeStatus=function(uid,stat)
{
	var o=FollowContact.exists(uid);
	var nova=false;
	if(o)
	{
	    o.status|=status;
	}
	else
	{
	    o=new FollowContact(FollowContact.uid,uid,status);
	    nova=true;
	}
	FollowContact.save(o,nova);
};
FollowContact.set=function(me,it,val,try_unset)
{
	var n=new  NetData();
	n.url="client/FollowContact/set/";if(LU.peopleRoot)n.url=LU.peopleRoot+n.url;
	n.callback=FollowContact.setBack;
	n.onerror=null;
	n.add("it",it).add("val",val).ifAdd(try_unset,"tryUnset",1).commit();
	
	var e=FollowContact.exists(it);
	if(!e)e=new FollowContact(FollowContact.uid,it,0,Date.now()/1000);
	//{
		var shift=0; var it_shift=4;
	    if(e.owner==FollowContact.uid)
	    {
	       //dont change shifts
	    }
	    else{shift=4; it_shift=0;}
	    e.time=Date.now()/1000;
		
		var stat=(e.status>>shift) ^ (e.status & 240); //simplify status value for current user
		var it_status=(e.status>>it_shift) ^ (e.status & 240); //simplify other user status
		
		if(val==2){stat = stat ^ (stat & 1); it_status=it_status ^ (it_status & 1);} //off request;
		if(val==8){stat = stat ^ (stat & 7); it_status=it_status ^ (it_status & 7);}//off friend ship bits and requests on block mode
		
		//add new values
		if(!try_unset)
		{
		    stat |=val;
		    if(val==4)it_status|=4;
		}
		else
		{
		    stat=stat ^ (stat & val);
		    if(val==4) it_status= it_status ^ (it_status & 4);
		}
		
		nstat=(stat<<shift) | (it_status<<it_shift);
		e.status=nstat;
		//FollowContact.list[it]=e;
	/*}
	else
	{
	    //FollowContact.list[it]=e;
	}*/
	FollowContact.activeObject=e;
	
};
FollowContact.setBack=function(res)
{
	var e=FollowContact.activeObject;
	FollowContact.list[e.related]=e;
	if(typeof(localStorage)!="undefined")
	{
	    var txt=JSON.stringify(FollowContact.list);
	    localStorage.setItem("fc"+FollowContact.uid,txt);
	}
};
FollowContact.readBack=function(res)
{
	if(typeof(localStorage)!="undefined")
	{
	    //var fcs=localStorage.getItem("fc"+FollowContact.uid);
	    var nfc=JSON.parse(res);
	    //if(fcs)res=fcs+"\n"+res;
	    //else FollowContact.list={};
	    if(typeof(FollowContact.list)!="object")FollowContact.list={};
	    //concat
	    var keys=Object.keys(nfc);
	    if(keys.length>0)UserInfo.loadUnavailables(keys); //keys are array of uids
	    else FollowContact.ready();
	    
	    for(var i=0;i<keys.length;i++){
	    	var related=nfc[keys[i]].owner==FollowContact.uid?nfc[keys[i]].related:nfc[keys[i]].owner;
	    	FollowContact.list[related]=nfc[keys[i]];
	    }
	    localStorage.setItem("fc"+FollowContact.uid,JSON.stringify(FollowContact.list));
	    if(keys.length>0)
	    {
	        FollowContact.lastUpdate=nfc[keys[keys.length-1]].time;
	        localStorage.setItem("fcLastUpdate"+FollowContact.uid,FollowContact.lastUpdate);
	    }
	}
};
FollowContact.ready=function()
{
	if(!FollowContact.isReady){
		FollowContact.isReady=true;
		(new JetHtml(document.body)).trigger('peopleready');
	}
};
FollowContact.parse=function(txt)
{
	var pat=/([a-zA-Z\d]+)\|([a-zA-Z\d]+)\|(\d+)\|(\d+)/g;
	var ret={};
	var related=null;
	var tmp=null;
	var m=null;
	while((m=pat.exec(txt)))
	{
	    tmp=new FollowContact(m[1],m[2],parseInt(m[3]),parseInt(m[4]));
	    related=(tmp.owner==FollowContact.uid)?tmp.related:tmp.owner;
	    ret[related]=tmp;
	}
	return ret;
};

function UserInfo(uid,title,picture,modified)
{
	
	this.uid=null;
	this.title=null;
	this.picture=null;
	this.lastAccess=null;
	this.modified=null;
this.uid=uid; this.title=title; this.picture=picture; this.lastAccess=parseInt(Date.now()/1000);
};



UserInfo.list=null;
UserInfo.loadList=null;
UserInfo.loadCallback=null;
UserInfo.loadIndex=0;
UserInfo.useIDB=true;
UserInfo.db=null;
UserInfo.getCallback=null;
UserInfo.activeUID=null;
UserInfo.requiredList=null;
UserInfo.table='UserInfoTb';
UserInfo.existingList=null;
UserInfo.autoLoadAll=true;
UserInfo.requestCount=25;


UserInfo.set=function(arg)
{
	if(arg instanceof Array)
	{
		var ret=[]; var tmp=null;
	    for(var i=0;i<arg.length;i++)
	    {
	        if(arg[i] instanceof UserInfo)
	            tmp=arg[i];
	        else if(arg[i] instanceof Profile)
	            tmp=new UserInfo(arg[i].uid,(arg[i].firstName+" "+arg[i].middleName+" "+arg[i].lastName).replace(/\s+/g,' '),arg[i].picture);
	        else
	        	tmp=new UserInfo(arg[i].uid,arg[i].title,arg[i].picture);//user summery object
	        
	        UserInfo.list[arg[i].uid]=tmp;
	        if(UserInfo.requiredList){
	        	var index=0;
	        	if((index=UserInfo.requiredList.indexOf(tmp.uid))>=0){
	        		UserInfo.requiredList[index]=tmp;
	        	}
	        }
	        ret.push(tmp);
	    }
	    return ret;
	}
	else
	{
	    UserInfo.list[arg.uid]=arg;
	    return [arg];
	}
};
UserInfo.get=function(uid,callback)
{
	if(callback)UserInfo.getCallback=callback;
	if(!UserInfo.loadList)UserInfo.loadList=[];
	if(!UserInfo.list)UserInfo.list={};
	
	if(uid instanceof Array){
		UserInfo.requiredList=uid;
		UserInfo.requiredIndex=0;
		UserInfo.get();
	}else if(uid){
		var ui=null;
		if((ui=UserInfo.list[uid])){
			if(UserInfo.requiredList){UserInfo.requiredList[UserInfo.requiredList.indexOf(uid)]=ui;UserInfo.requiredIndex++;UserInfo.get();}
			else return ui;
		}
		else {
			if(UserInfo.useIDB){
				UserInfo.activeUID=uid;
				var req=UserInfo.getDB().transaction('userinfo','readonly').objectStore('userinfo').get(uid);
				//req.onsuccess=UserInfo.dbGetBack;
				req.onsuccess=function(evt){
					var uid=arguments.callee.uid;
					
					
					var o=evt.target.result;
					if(o)UserInfo.list[uid]=o;//store in array to load back //update last access
					else{
						if(!UserInfo.loadList)UserInfo.loadList=[];
							UserInfo.loadList.push(uid);
							UserInfo.loadUnknowns();
							if(!UserInfo.requiredList)o=new UserInfo(uid,"other User",null);
					}
					if(UserInfo.requiredList){if(o)UserInfo.requiredList[UserInfo.requiredList.indexOf(o.uid)]=o;UserInfo.requiredIndex++;UserInfo.get();}
					else if(UserInfo.getCallback && o){
						UserInfo.getCallback(o);
						UserInfo.getCallback=null;//reset to avoid next calls
					}
					
					
				};
				req.onerror=function(e){console.log(e); console.log('error');};
				req.onsuccess.uid=uid;
			}else{
				UserInfo.loadList.push(uid);
				return new UserInfo(uid,"other User",null);
			}
		}
	}else{
		var uid=UserInfo.requiredList[UserInfo.requiredIndex];
		if(uid){
			UserInfo.get(uid);
		}else{
			var has_unknown=false;
			if(UserInfo.loadList)if(UserInfo.loadList.length>0)has_unknown=true;
			if(has_unknown){
				UserInfo.loadUnknowns(UserInfo.get);
			}else{
				if(UserInfo.getCallback){
					UserInfo.getCallback(UserInfo.requiredList);
					UserInfo.getCallback=null;//reset
				}
				UserInfo.requiredList=null;
			}
		}
	}
};
UserInfo.save=function(arg)
{
	if(UserInfo.useIDB){
		var slist=arg?arg:UserInfo.list;
		for(var i in slist){
			uinf=slist[i];
			var db=UserInfo.getDB();
			if(uinf.uid){
				db.transaction('userinfo','readwrite').objectStore('userinfo').put(uinf);
			}
		}
	}else if(typeof(localStorage)!="undefined" && arg===undefined)
	{
	    var l=UserInfo.toString(UserInfo.list);
	    localStorage.setItem("userinfo"+FollowContact.uid,l);
	}
	
};
UserInfo.load=function(uids)
{
	if(!UserInfo.list)UserInfo.list={};
	if(UserInfo.useIDB){
		if(uids instanceof Array)UserInfo.loadUnavailables(uids,true);//keep in memory
	}else if(typeof(localStorage)!="undefined")
	{
	    var sui=localStorage.getItem("userinfo"+FollowContact.uid);
	    if(sui)
	    {
	        var res=UserInfo.parse(sui);
	        if(sui.search("\n")>0)
	        {
	            var keys=Object.keys(res);
	            for(var i=0;i<keys.length;i++)UserInfo.list[keys[i]]=res[keys[i]];
	        }
	        else
	        {
	            UserInfo.list[res.uid]=res;
	        }
	    }
	}
};
UserInfo.toString=function(a)
{
	if(a instanceof Array)
	{
	    var ret="";
	    for(var i=0;i<a.length;i++)
	    {
	        ret+=UserInfo.toString(a[i])+"\n";
	    }
	    return ret;
	}
	else if(a instanceof UserInfo)
	{
	    return a.uid+"|"+a.title+"|"+a.picture;
	}
	else if(typeof(a)=="object")
	{
	    var keys=Object.keys(a);
	    var ret="";
	    for(var i=0;i<keys.length;i++)
	    {
	        ret+=UserInfo.toString(a[keys[i]])+"\n";
	    }
	    return ret;
	}
	else return "";
};
UserInfo.parse=function(a)
{
	if(a.search("\n")>=0)
	{
	    var lines=a.split("\n");
	    var ret={};
	    var tmp=null;
	    for(var i=0;i<lines.length;i++)// length-2 becuase the last element is just extra \n
	    {
	        if(lines[i])
	        {
	            tmp=UserInfo.parse(lines[i]);
	            ret[tmp.uid]=tmp;
	        }
	    }
	    return ret;
	}
	else
	{
	    var katy=a.split('|');
	    return new UserInfo(katy[0],katy[1],katy[2]);
	}
};
UserInfo.loadUnknowns=function(callback)
{
	if(callback)UserInfo.loadCallback=callback;
	if(!UserInfo.loadList)UserInfo.loadList=[];//avoid exception
	if(UserInfo.loadList.length>0){
		/*
		UserInfo.loadIndex=0;
		var servers=UniversalServer.getServer(0);
		var pat=/\w+(\d+)/;var id=NaN;
		for(var i=0;i<servers.length;i++){
			var clist=[];
			var prefix=servers[i].prefix;
			for(var j=0;j<UserInfo.loadList.length;j++){
				if(UserInfo.loadList[j]){
					id=parseInt(UserInfo.loadList[j].replace(prefix,''));
					if(!isNaN(id)){
						clist.push(id);
					}
				}
			}
			
			if(clist.length>0){
				var n=new NetData();
				n.url=servers[i].url+"client/profile/search/";
			    n.add("ids",clist.join(','));
			    n.callback=UserInfo.loadUnknownsCallback;
			    UserInfo.loadIndex++;
			    _ajaxQ.add(n);
			    _ajaxQ.run();
			}
		}
		UserInfo.loadList.length=0;
		*/
		var clist=[];
		while(UserInfo.loadList.length>0 && clist.length<=UserInfo.requestCount){
			clist.push(UserInfo.loadList.pop());
		}
		if(clist.length>0){
			var n=new NetData();
			n.url=FollowContact.summeryServer+"client/UserSummery/search/";
			n.method="POST";
		    n.callback=UserInfo.loadUnknownsCallback;
		    n.add("data",clist.join(',')).commit();
		    //UserInfo.loadIndex++;
		}
	}
};
UserInfo.loadUnknownsCallback=function(res)
{
	/*var pat=/Server\sPrefix\:\s(\w+)/;
	var prefix_res=pat.exec(res);
	Profile.activePrefix=prefix_res[1];
	
	var profiles=Profile.parseXml(res);
	*/
	var profiles=JSON.parse(res);
	var res=UserInfo.set(profiles);
	UserInfo.save(res);
	//UserInfo.loadIndex--;
	/*
	if(UserInfo.loadIndex===0){
		if(!UserInfo.useIDB)UserInfo.save();
		if(UserInfo.requiredList)UserInfo.get();//continue to get or run callback
		if(UserInfo.loadCallback)UserInfo.loadCallback();
	}*/
	if(UserInfo.loadList.length>0){
		UserInfo.loadUnknows();
	}else{
		UserInfo.get();//continue to get or run callback
		FollowContact.ready();//trigger people ready to continue the apps
	}
};
UserInfo.getDB=function()
{
	if(UserInfo.db)return UserInfo.db;
	else{
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
		var req=window.indexedDB.open('people',1);
		req.onupgradeneeded=function(e){
			var db=e.target.result;
			var uistore=db.createObjectStore('userinfo',{keyPath:'uid'});
			uistore.createIndex('title','title');
			if(typeof(ContactCheck)!="undefined")ContactCheck.onUpgradeNeeded(e);
		};
		req.onsuccess=function(e){
			UserInfo.db=e.target.result;
		};
		return null;
	}
};
UserInfo.dbGetBack=function(evt)
{
	var o=evt.target.result;
	if(o){
		UserInfo.list[o.uid]=o;//store in array to load back //update last access
		//o.lastAccess=parseInt(Date.now()/1000);
		//UserInfo.save([o]);
	}else{
		if(!UserInfo.loadList)UserInfo.loadList=[];
			UserInfo.loadList.push(UserInfo.activeUID);
			if(!UserInfo.requiredList)o=new UserInfo(UserInfo.activeUID,"other User",null);
	}
	if(UserInfo.requiredList){if(o)UserInfo.requiredList[UserInfo.requiredList.indexOf(o.uid)]=o;UserInfo.requiredIndex++;UserInfo.get();}
	else if(UserInfo.getCallback && o)UserInfo.getCallback(o);
};
UserInfo.loadUnavailables=function(ls,keep)
{
	var req=UserInfo.getDB().transaction('userinfo','readonly').objectStore('userinfo').openCursor();
	
	req.onsuccess=function(e){
		var cursor=e.target.result;
		var ls=this.ls;
		if(cursor){
			var index=ls.indexOf(cursor.value.uid);
			if(index>-1){
				ls[index]=null;
				if(this.keep)UserInfo.list[cursor.value.uid]=cursor.value;
			}
			cursor.continue();
		}else{
			if(!UserInfo.loadList)UserInfo.loadList=[];
			for(var i=0;i<ls.length;i++)if(ls[i])UserInfo.loadList.push(ls[i]);
			UserInfo.loadUnknowns();
		}
	};
	req.ls=ls;
	req.keep=keep;//to load requested users to memory
};
UserInfo.loadNoneExists=function()
{
	var allUsers=Object.keys(FollowContact.list);
	UserInfo.loadList=[];
	for(var i=0;i<allUsers.length;i++){
		if(UserInfo.existingList.indexOf(allUsers[i])<0){
			UserInfo.loadList.push(allUsers[i]);
		}
	}
	if(User.loadList.length>0)UserInfo.loadUnknowns(); //use this condition to skip looping
};

function ContactCheck(field,uid,time)
{
	
	this.field=null;
	this.uid=null;
	this.time=null;
this.field=field?field:''; this.uid=uid?uid:''; this.time=time?time:0;
};



ContactCheck.listo=null;
ContactCheck.checkSize=25;
ContactCheck.to_save=null;
ContactCheck.loadCallback=null;
ContactCheck.refreshing=false;
ContactCheck.uidList=null;
ContactCheck.watched=null;


ContactCheck.getDB=function()
{
	return UserInfo.getDB();
};
ContactCheck.onUpgradeNeeded=function(e)
{
	var db=e.target.result;
	var uistore=db.createObjectStore('contactcheck',{keyPath:'field'});
	uistore.createIndex('time','time');
};
ContactCheck.loadContacts=function()
{
	if(ContactCheck.watched===0)return; //Watchdog stoped the process tree
	ContactCheck.watched=Date.now();
	
	Libre.log('Reading device contacts...');
	var onSuccess=function(contacts){
		if(ContactCheck.watched===0)return; //Watchdog stoped the process tree
		ContactCheck.watched=Date.now();
		
	    if(!ContactCheck.checkList)ContactCheck.checkList=[];//create if not exists
	    ContactCheck.to_save=[];
	    var country_code=localStorage.country;
	    for(var i=0;i<contacts.length;i++){
	        for(var j=0;j<contacts[i].phoneNumbers.length;j++){
	            var number=contacts[i].phoneNumbers[j].value.replace(/[\s\+\-]+/g,'');
	            if(number[0]=="0")number=country_code+number.substr(1);
	            if(!ContactCheck.listo[number]){//not stored on db and not checked
		            if(ContactCheck.checkList.indexOf(number)<0){//not duplicated on checklist
		                ContactCheck.checkList.push(number);//add to check list
		                ContactCheck.listo[number]=new ContactCheck(number,null,null);
		                ContactCheck.to_save.push(ContactCheck.listo[number]);//add last ContactCheck Object to save que
		            }
	            }
	        }
	    }
	    ContactCheck.run();
	};
	var onError=function(e){
		if(ContactCheck.watched===0)return; //Watchdog stoped the process tree
		ContactCheck.watched=Date.now();
		
		Libre.logi('Unable to access contacts');
		ContactCheck.forward();
	};
	
	var options      = new ContactFindOptions();
	options.filter   = "";
	options.multiple = true;
	//options.desiredFields = [navigator.contacts.fieldType.id,navigator.contacts.fieldType.displayName];
	options.hasPhoneNumber = true;
	var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
	navigator.contacts.find(fields, onSuccess, onError, options);
};
ContactCheck.load=function()
{
	if(ContactCheck.watched===0)return; //Watchdog stoped the process tree
	ContactCheck.watched=Date.now();
	var req=ContactCheck.getDB().transaction(['contactcheck'],'readonly').objectStore('contactcheck').openCursor();
	ContactCheck.listo={};
	ContactCheck.uidList=[];
	req.onsuccess=function(e){
		var cursor=e.target.result;
		if(cursor){
			ContactCheck.listo[cursor.value.field]=cursor.value;
			cursor.continue();
		}else{
			if(ContactCheck.loadCallback)ContactCheck.loadCallback();
			else ContactCheck.loadContacts();
		}
	};
	req.onerror=function(e){
		alert('unable to access contact\'s database.');
		ContactCheck.forward();
	};
};
ContactCheck.run=function()
{
	if(ContactCheck.watched===0)return; //Watchdog stoped the process tree
	ContactCheck.watched=Date.now();
	
	Libre.log('Checking...');
	var list=[];
	var checkList=ContactCheck.checkList;
	for(var i=0;i<checkList.length && i<ContactCheck.checkSize;i++){
		list.push(checkList.pop());
	}
	if(list.length>0){
		var n=new NetData();
		n.url=FollowContact.summeryServer+"/client/UserSummery/search/";
		n.method="POST"; n.callback=ContactCheck.runBack;
		n.onerror=function(e){Libre.log('run error');};
		n.add('data',list.join(','),true).commit();
	}else{
		ContactCheck.forward();
	}
};
ContactCheck.forward=function()
{
	try{
		var keys=Object.keys(ContactCheck.listo);
		if(ContactCheck.to_save.length>0)ContactCheck.save(ContactCheck.to_save);
		var uid=null; var fc=null;
		for(var i=0;i<keys.length;i++){
			if(ContactCheck.listo[keys[i]]){//if not null
				if((uid=ContactCheck.listo[keys[i]].uid)){
					if(FollowContact.list[uid]){
						FollowContact.list[uid].status|=FollowContact.RDeviceContact;	
					}else{
						fc=new FollowContact(FollowContact.uid,uid,FollowContact.RDeviceContact);
						FollowContact.list[uid]=fc;
					}
				}
			}
		}
	}catch(ex){
		Libre.log('Error checking contacts!');
	}
	(new JetHtml(document.body)).trigger('contactchecked');
	ContactCheck.listo={};//clear listo
	//UserInfo.get(Object.keys(FollowContact.list));
	Libre.log(ContactCheck.uidList.length+" new contact(s) extracted.");
};
ContactCheck.runBack=function(res)
{
	if(ContactCheck.watched===0)return; //Watchdog stoped the process tree
	ContactCheck.watched=Date.now();
	
	var ls=JSON.parse(res);
	//Libre.work.show(res);
	var o=null; var to_save=[]; var Uinfos=[]; var tmp=null;
	if(!UserInfo.list)UserInfo.list={};
	for(var i=0;i<ls.length;i++){
		o=null;
		if(ContactCheck.listo[ls[i].phone]){
			ContactCheck.listo[ls[i].phone].uid=ls[i].uid;
			ContactCheck.uidList.push(ls[i].uid);
		}
		else if(ContactCheck.listo[ls[i].email]){
			ContactCheck.listo[ls[i].email].uid=ls[i].uid;
			ContactCheck.uidList.push(ls[i].uid);
		}
		tmp=new UserInfo(ls[i].uid,ls[i].title,ls[i].picture);
		Uinfos.push(tmp);
		UserInfo.list[ls[i].uid]=tmp;
	}
	if(Uinfos.length>0){
		UserInfo.save(Uinfos);
	}
	if(ContactCheck.checkList.length>0)ContactCheck.run();
	else ContactCheck.forward();
};
ContactCheck.save=function(o)
{
	var objectStore=ContactCheck.getDB().transaction(["contactcheck"],"readwrite").objectStore('contactcheck');
	var stfn=function(obj){
		if(obj){/* not null msg */
			objectStore.put(obj);
		}
	};
	if(o instanceof Array)o.forEach(stfn);
	else stfn(o); //if messages is a single message object
	Libre.log('Constacts updated.');
};
ContactCheck.config=function()
{
	//configure watchdog
	ContactCheck.watched=Date.now();
	ContactCheck.watchdog(); //start watchdog
	ContactCheck.loadCallback=null;
	ContactCheck.load();
};
ContactCheck.refresh=function()
{
	var loaded=false;
	var keys=null;
	if(ContactCheck.listo){
		keys=Object.keys(ContactCheck.listo);
		if(keys.length>0)loaded=true;
	}
	
	if(loaded){
		Libre.log('refreshing contacts...');
		ContactCheck.checkList=[];
		for(var i=0;i<keys.length;i++){
			if(!ContactCheck.listo[keys[i]].uid)ContactCheck.checkList.push(keys[i]);
		}
		ContactCheck.loadContacts();
		
	}else{
		if(!ContactCheck.refreshing){
			ContactCheck.refreshing=true; //avoid looping
			ContactCheck.loadCallback=ContactCheck.refresh;
			ContactCheck.load();
		}
	}
};
ContactCheck.watchdog=function()
{
	if(ContactCheck.watched<(Date.now()-10000)){
		Libre.log('un-hanging by watch dog, a problem with device or internet connection.');
		ContactCheck.forward();
		ContactCheck.watched=0;
	}else{
		setTimeout(ContactCheck.watchdog,10000);
	}
};
