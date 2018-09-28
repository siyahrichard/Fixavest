function People()
{
	
	this.zufoc=null;
	
	this.searchResultBtn=function(show)
	{
		var btnList=document.getElementById("sbBtnPan");
		if(show)
		{
		    if(!People.searchBtn)
		    {
		        People.searchBtn=document.createElement("li");
		        People.searchBtn.innerHTML="search people result";
		        People.searchBtn.setAttribute("onclick","");
		    }
		    btnList.appendChild(People.searchBtn);
		}
		else
		{
		    try
		    {
		        btnList.removeChild(People.searchBtn);
		    }
		    catch(ex){}
		}
	};
};



People.servers=null;
People.buttonList=null;
People.searchBtn=null;
People.currentIndex=0;
People.net=null;
People.list=null;
People.loadingTitles=null;
People.loadingPictures=null;
People.cuadSender=null;
People.peopleAppId=3;
People.messengerAppId=6;
People.feedAppId=7;


People.search=function(param)
{
	var keys=Object.keys(People.servers);
	if(param)People.activeParam=param;
	var p=param?param:People.activeParam;
	if(keys[People.currentIndex])
	{
	    var prefix=keys[People.currentIndex];
	    Profile.activePrefix=prefix;// in parsing xml from server this prefix is require
	    var server=People.servers[prefix];
	    var n=new NetData();
	    n.callback=People.continueSearch;
	    n.url=server+"client/profile/search/";
	    n.add("param",p).commit();
	    People.currentIndex++;
	}
	else
	{
	    People.currentIndex=0;
	}
	
};
People.continueSearch=function(res)
{
	var res=Profile.parseXml(res);
	if(!People.result)People.result=res;
	else People.result=People.result.concat(res);
	People.search();
	People.showProfile(res);
	
};
People.showProfile=function(profile)
{
	if(profile instanceof Array)
	{
	    if(UserInfo)
	    {
	        UserInfo.set(profile);
	        UserInfo.save();
	    }
	    for(var i=0;i<profile.length;i++)
	    {
	    	if(profile[i].uid!=FollowContact.uid)
	        People.showProfile(profile[i]);
	    }
	}
	else
	{
		var ds="<div class=\"side1\"><img onerror=\"People.profileImageError(event,%gender%)\" src=\"%src%\"/></div><div class=\"side2\"><span>%title%</span><div id=\"profile%uid%Bc\"><img class=\"more\" src=\"res/images/png/more.png\" onclick=\"People.more('%uid%',0,event.target)\"/></div></div>";
		if(!People.loadingTitles)People.loadingTitles={};
		if(!People.loadingPictures)People.loadingPictures={};
	    var u=FollowContact.list[profile.uid];
	    if(u)profile.permision|=
	    	(u.status & FollowContact.OFollow | u.status & FollowContact.OFollow?1:0)|
	    	(u.status & FollowContact.ORequest | u.status & FollowContact.RRequest?2:0);//repair permissions
	    var pan=document.getElementById("workPan");
	    var dlg=document.createElement("div");
	    dlg.setAttribute("class","profileCard");
	    ds=ds.replace(/\%title\%/g,profile.firstName+" "+profile.middleName+" "+profile.lastName);
	    var img=null;
	    if(profile.picture && CloudFile)
	    {
	        img=CloudFile.getUrlByCode(profile.picture);
	        if(img)img+="&x=50&y=50";
	    }
	    if(!img)img="res/gender"+profile.gender+".png";
	    ds=ds.replace(/\%src\%/g,img);
	    ds=ds.replace(/\%uid\%/g,profile.uid);
	    ds=ds.replace(/\%gender\%/g,profile.gender);
	    dlg.innerHTML=ds;
	    var btn=0;
	    if(profile.permision&1){
	        btn++;
	        var fbtn=new ActiveButton("Follow","Following","followBtn right"+btn,"followingBtn right"+btn);
	        fbtn.activeParam="follow|"+profile.uid+"|2";
	        fbtn.param="unfollow|"+profile.uid+"|2";
	        fbtn.onclick=People.oncfbutton;
	        ActiveButton.buildForm(fbtn,dlg);
	        if(u)if(
	        	(u.owner==FollowContact.uid && (u.status & FollowContact.OFollow)) ||
	        	(u.related==FollowContact.uid && (u.status & FollowContact.RFollow))
	        	)ActiveButton.toggle(fbtn);
	        	
	    }else if(profile.permision&2){
	        btn++;
	        var rbtn=new ActiveButton("Request","Requested","requestBtn right"+btn,"requestedBtn right"+btn);
	        rbtn.activeParam="request|"+profile.uid+"|1";
	        rbtn.param="unrequest|"+profile.uid+"|1";
	        rbtn.onclick=People.oncfbutton;
	        ActiveButton.buildForm(rbtn,dlg);
	        if(u)if(
	        	(u.owner==FollowContact.uid && (u.status & FollowContact.ORequest)) ||
	        	(u.related==FollowContact.uid && (u.status & FollowContact.RRequest))
	        	)ActiveButton.toggle(rbtn);
	    }
	    pan.appendChild(dlg);
	    /*if(profile.firstName=="other User"){
	    	title.innerHTML="-";
	    	People.loadingTitles[profile.uid]=title;
	    	People.loadingPictures[profile.uid]=pic;
	    }*/
	}
};
People.clearContentPan=function()
{
	var pan=document.getElementById("workPan");
	pan.innerHTML="";
};
People.startSearch=function(param)
{
	People.currentIndex=0;
	People.clearContentPan();
	People.result=[];
	People.search(param);
};
People.oncfbutton=function(btn)
{
	if(btn.active)
	{
	    var p=btn.activeParam.split("|");
	    switch(p[0])
	    {
	        case 'follow':case 'request':
	            FollowContact.set("",p[1],p[2]);
	            break;
	        default:
	            break;
	    }
	}
	else
	{
	    var p=btn.param.split("|");
	    switch(p[0])
	    {
	        case 'unfollow': case 'unrequest':
	            FollowContact.set("",p[1],p[2],1);
	            break;
	        default:
	            break;
	    }
	}
};
People.showContact=function(arg,mode)
{
	if(!arg)return;
	if(arg instanceof Array)
	{
		People.loadingTitles={};
		People.loadingPictures={};
	    for(var i=0;i<arg.length;i++)
	    {
	        if(!mode)People.showContact(arg[i]);
	    }
	}
	else if(arg instanceof FollowContact || (arg.owner && arg.related))
	{
	    var related=arg.owner==FollowContact.uid?arg.related:arg.owner;
	    var tmp=UserInfo.get(related,People.showContact);
	    if(tmp)People.showContact(tmp);
	}
	else if(typeof(arg)=="object")
	{
		if(arg.title && arg.uid){
			var p=new Profile(arg.uid,arg.title,"","","",2,0,arg.picture,"");//it will repaire the pemissions
	    	People.showProfile(p);
		}else{
			People.loadingTitles={};
			People.loadingPictures={};
		    var keys=Object.keys(arg);
		    for(var i=0;i<keys.length;i++)
		    {
		        
		        if(!mode)People.showContact(arg[keys[i]]);
		        else
		        {
		            switch(mode)
		            {
		                case FollowContact.OFollow:
		                   if(arg[keys[i]].owner==FollowContact.uid && (arg[keys[i]].status & FollowContact.OFollow))People.showContact(arg[keys[i]]);
		                    else if(arg[keys[i]].related==FollowContact.uid && (arg[keys[i]].status & FollowContact.RFollow))People.showContact(arg[keys[i]]);
		                    break;
		                case FollowContact.RFollow:
		                    if(arg[keys[i]].owner==FollowContact.uid && (arg[keys[i]].status & FollowContact.RFollow))People.showContact(arg[keys[i]]);
		                    else if(arg[keys[i]].related==FollowContact.uid && (arg[keys[i]].status & FollowContact.OFollow))People.showContact(arg[keys[i]]);
		                     break;
		                case FollowContact.OBlock:
		                    if(arg[keys[i]].owner==FollowContact.uid && (arg[keys[i]].status & FollowContact.OBlock))People.showContact(arg[keys[i]]);
		                    else if(arg[keys[i]].related==FollowContact.uid && (arg[keys[i]].status & FollowContact.RBlock))People.showContact(arg[keys[i]]);
		                    break;
		                default:
		                    break;
		            }
		        }
		    }
		    UserInfo.loadUnknowns(People.completeUnknownsProfile);
		}
	}
};
People.clearArea=function()
{
	People.clearContentPan();
};
People.completeUnknownsProfile=function()
{
	var userinfo=null;
	for(var i in People.loadingTitles){
		userinfo=UserInfo.get(i);
		People.loadingTitles[i].innerHTML=userinfo.title;
		var img=CloudFile.getUrlByCode(userinfo.picture)+"&x=50&y=50";
		People.loadingPictures[i].style.backgroundImage="url('"+img+"')";
	}
};
People.onCuadGet_Hidden=function(msg)
{
	if(msg){
		People.cuadParam=msg.value;
		People.cuadSender=msg.senderApp;
		People.currentAppId=msg.receiverApp;
	}
	var ret=[]; var c=null; var u=null;
	for(var i in UserInfo.list){
		u=UserInfo.list[i];
		if(u instanceof UserInfo){
			if(u.title.search(People.cuadParam)>=0 && FollowContact.list[u.uid]){
				c=FollowContact.list[u.uid];
				if(!(c.status & FollowContact.OBlock || c.status & FollowContact.RBlock))ret.push(u.uid+'|'+u.title);
			}
		}
	}
	var fsm=new FSMessage("useFollowContact",ret.join(','),0,0,People.currentAppId,People.cuadSender);
	Bon.send(FSMessage.toXml(fsm));
	//return ret;
};
People.profileImageError=function(e,gender)
{
	e.target.src="res/gender"+gender+".png";
};
People.more=function(uid,network,ctrl)
{
	var items=[];
	var fc=FollowContact.list[uid];
	if(!((fc.status & 8) || (fc.status & 128))){
		items.push(new PopupItem("Chat",People.onChatMenu,null,{network:0,uid:uid}));
		items.push(new PopupItem("Page",People.onPageMenu,null,{network:0,uid:uid}));
		items.push(new PopupItem("Block",People.onBlockMenu,null,{network:0,uid:uid}));
	}
	var p=new Popup(true);
	p.items=items;
	p.relatedControl=ctrl;
	p.show(document.body);
};
People.onChatMenu=function(item)
{
	var fsm=new FSMessage("sideStartChat",item.tag.uid,0,0,People.peopleAppId,People.messengerAppId);
	Bon.send(fsm);
};
People.onPageMenu=function(item)
{
	var fsm=new FSMessage("showPage",item.tag.uid,0,0,People.peopleAppId,People.feedAppId);
	Bon.send(fsm);
};
People.onBlockMenu=function(item)
{
	if(confirm("Are you sure to block '"+UserInfo.get(item.tag.uid).title+"'?")){
		console.log('fakly blocked');
	}
};
People.config=function()
{
	UserInfo.list={};
	UserInfo.loadList=[];
};
