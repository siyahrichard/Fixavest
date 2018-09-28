function Profile(uid,fname,mname,lname,birth,gender,permision,picture,cover)
{
	
	this.uid=null;
	this.firstName=null;
	this.middleName=null;
	this.lastName=null;
	this.birthDate=null;
	this.gender=null;
	this.permision=null;
	this.picture=null;
	this.cover=null;
	this.ccard=null;
this.uid=uid; this.firstName=fname; this.middleName=mname; this.lastName=lname; this.birthDate=birth; this.gender=gender; this.permision=parseInt(permision); this.picture=picture;
this.cover=cover; this.ccard="";
};



Profile.net=null;
Profile.activePrefix=null;


Profile.save=function(o)
{
	if(!Profile.net)Profile.net=new NetworkTransfer();
	var n=Profile.net;
	n.clear();
	n.target="//client/profile/save/";
	n.add("fname",o.firstName);
	n.add("mname",o.middleName);
	n.add("lname",o.lastName);
	n.add("birth",o.birthDate);
	n.add("gender",o.gender);
	n.add("permision",o.permision);
	n.add("picture",o.picture);
	n.add("cover",o.cover);
	if(o.ccard)n.add("ccard",o.ccard,true);
	n.send();
};
Profile.search=function()
{
	var query=window.location.href.split('?');
	if(query.length>1){
		query="?"+query[1];//last part after ? mark
	}else query="";
	if(res.length>10)window.location.href=(res+query).replace(/\?*/g,"?").replace(/\/*/g,"/");
	
	var query=window.location.href.split('?');
	if(query.length>1){
		query="?"+query[1];//last part after ? mark
	}else query="";
	if(res.length>10)window.location.href=(res+query).replace(/\?*/g,"?").replace(/\/*/g,"/");
	
};
Profile.parseXml=function(arg)
{
	if(typeof(arg)=="string")
	{
	    if(window.DOMParser)
	    {
	        var parser=new DOMParser();
	        var doc=parser.parseFromString(arg,"text/xml");
	    }
	    else
	    {
	        doc=new ActiveXObject("Microsoft.XMLDOM");
	        doc.async=false;
	        doc.loadXML(arg);
	    }
	    profs=doc.getElementsByTagName("Profile");
	    ret=[];
	    for(var i=0;i<profs.length;i++)
	    {
	        ret[i]=Profile.parseXml(profs[i]);
	    }
	    return ret;
	}
	else
	{
	    var ccard=null;
	    var tmp= new Profile(Profile.activePrefix+arg.getAttribute("id"),arg.getAttribute("fName"),arg.getAttribute("mName"),arg.getAttribute("lName"),arg.getAttribute("birth"),
	        arg.getAttribute("gender"),arg.getAttribute("permission"),arg.getAttribute("picture"),arg.getAttribute("cover"));
	    if((ccard=arg.getAttribute('ccard')))tmp.ccard=ccard;
	    return tmp;
	}
};
