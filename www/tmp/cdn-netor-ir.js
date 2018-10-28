function Jet()
{};Jet.get=function(cond)
{co=cond.substr(1,cond.length);var ret=null;switch(cond[0])
{case'#':ret=document.getElementById(co);if(ret)ret=new JetHtml(ret);break;case'.':ret=document.getElementsByClassName(cond.substr(1,cond.length));if(ret)ret=new JetList(ret);break;case'@':if(typeof(Polaris)!="undefined"){if(cond.length==1)return PolarApp.activeObject.currentForm;else return PolarApp.activeObject.currentForm.get(co);}
break;default:ret=document.getElementsByTagName(cond);if(ret)ret=new JetList(ret);break;}
if(ret)ret.selector=cond;return ret;};Jet.inner=function(source,arg)
{try
{if(typeof(source.attr)!="undefined")
{src=source.source;}
else
{src=source;}}
catch(ex)
{return null;}
if(typeof(src.innerHTML)!="undefined")
{if(src.nodeName.toLowerCase()=="input"||src.nodeName.toLowerCase()=="textarea"||src.nodeName.toLowerCase()=="select")
{switch(src.type.toLowerCase())
{case'checkbox':case'radio':if(typeof(arg)=="undefined")return src.checked;else src.checked=arg;break;default:if(typeof(arg)=="undefined")return src.value;else src.value=arg;break;}}
else if(typeof(arg)!=="undefined")
{if(typeof(arg)=="object")
{src.appendChild(arg);}
else if(typeof(arg)=="string")
{src.innerHTML=arg;}}
else
{return src.innerHTML;}
return null;}};Jet.show=function(source,arg,eleminate)
{try
{if(typeof(source.attr)!="undefined")
{src=source.source;}
else
{src=source;}}
catch(ex)
{return null;}
if(typeof(src.innerHTML)!="undefined")
{if(arg)
{src.style.visibility="visible";if(src.lastPosition)src.style.position=source.lastPosition;src.lastPosition=null;}
else
{src.style.visibility="hidden";if(eleminate||typeof(eleminate)=="undefined")
{src.lastPosition=(src.style.position)?src.style.position:"static";src.style.position="absolute";}}}};Jet.attr=function(source,name,value)
{try
{if(typeof(source.attr)!="undefined")
{src=source.source;}
else
{src=source;}}
catch(ex)
{return null;}
if(typeof(src.innerHTML)!="undefined")
{if(typeof(value)!='undefined')src.setAttribute(name,value);else return src.getAttribute(name);}
return null;};Jet.config=function()
{_=Jet.get;if(typeof(NetSchedule)!='undefined')
{_ajaxQ=NetSchedule;_ajaxQ.command=[];_ajaxQ.list=[];}
if(typeof(Utility)!="undefined")
{_util=Utility;}
if(typeof(JetAnimation)!="undefined")
{_A=JetAnimation;JetS=JetScene;JetSG=SceneGroup;}
if(typeof(JetApp)!="undefined")
{Jet.App=JetApp;JetApp.config();}
String.prototype.captalize=function(){return this.substring(0,1).toUpperCase()+this.substring(1,this.length);};};Jet.loadResource=function(file,type,callback)
{var node=null;switch(type)
{case'css':case'style':node=document.createElement('link');node.setAttribute('rel','stylesheet');node.setAttribute('type','text/css');node.setAttribute('href',file);break;case'javascript':case'js':case'script':node=document.createElement('script');node.setAttribute('type','text/javascript');node.setAttribute('src',file);break;default:break;}
if(node)
{if(callback)
{if(typeof(callback)=="string")node.setAttribute("onload",callback);else node.onload=callback;}
document.body.appendChild(node);}};Jet.setClass=function(obj,className,add)
{var ocl=obj.getAttribute('class');if(!ocl)ocl="";var pat=new RegExp("\\b"+className+"\\b","g");var res=ocl.search(pat);if(add===undefined){if(res!=-1)add=false;else add=true;}
if(add)
{if(res>=0)return true;else
{if(ocl!=="")ocl+=" ";ocl+=className;}}
else
{ocl=ocl.replace(pat,"");}
ocl=ocl.replace(/\s+/,' ');obj.setAttribute("class",ocl);};function JetHtml(source)
{this.source=null;this.selector=null;this.source=source;this.inner=function(arg)
{if(typeof(arg)=="undefined")return Jet.inner(this);else Jet.inner(this,arg);};this.show=function(arg,eleminate)
{if(typeof(eleminate)!="undefined")Jet.show(this,arg,eleminate);else Jet.show(this,arg);};this.attr=function(name,value)
{if(typeof(value)!="undefined")Jet.attr(this,name,value);else return Jet.attr(this,name);};this.value=function(arg)
{if(typeof(arg)=="undefined")return Jet.inner(this);else Jet.inner(this,arg);};this.a=function(effect,tag,speed,callback)
{return JetAnimation.do(effect,this.selector,tag,speed,-1,callback);};this.addClass=function(className)
{Jet.setClass(this.source,className,true);};this.removeClass=function(className)
{Jet.setClass(this.source,className,false);};this.toggleClass=function(className)
{Jet.setClass(this.source,className);};this.trigger=function(type)
{if(window.CustomEvent){this.source.dispatchEvent(new CustomEvent(type));}else if(document.createEvent){var ev=document.createEvent('HTMLEvents');ev.initEvent(type,true,false);this.source.dispatchEvent(ev);}else{this.source.fireEvent('on'+type);}};};function JetList(list)
{this.sources=null;this.length=0;this.selector=null;if(typeof(list)!="undefined")
{for(var i=0;i<list.length;i++)
{if(typeof(list[i].attr)!="undefined")this[i]=list[i];else this[i]=new JetHtml(list[i]);}
this.length=i;}
this.inner=function(arg)
{if(typeof(arg)!="undefined")for(var i in this)Jet.inner(this[i],arg);else
{var ret=[];var r=null;for(var i in this)
{if(r=Jet.inner(this[i]))
{ret[i]=r;}}
return ret;}};this.show=function(eleminate,arg)
{for(i in this)Jet.show(this[i],arg,eleminate);};this.attr=function(name,value)
{if(typeof(value)!="undefined")for(var i in this)Jet.attr(this[i],name,value);else
{var ret=[];var r=null;for(i in this)
{if(this[i])
if(r=Jet.attr(this[i],name))
{ret[i]=r;}}
return ret;}};this.push=function(jh)
{this.length++;this[this.length]=jh;};this.value=function(arg)
{if(typeof(arg)!="undefined")for(var i in this)Jet.inner(this[i],arg);else
{var ret=[];var r=null;for(var i in this)
{if(r=Jet.inner(this[i]))
{ret[i]=r;}}
return ret;}};this.addClass=function(className)
{for(var i in this)
if(this[i]instanceof JetHtml)this[i].addClass(className);};this.removeClass=function(className)
{for(var i in this)
if(this[i]instanceof JetHtml)this[i].removeClass(className);};this.toggleClass=function(className)
{for(var i in this)
if(this[i]instanceof JetHtml)this[i].toggleClass(className);};};function NetSchedule()
{this.repeat=false;};NetSchedule.list=null;NetSchedule.command=null;NetSchedule.net=null;NetSchedule.currentCommand=null;NetSchedule.processing=false;NetSchedule.watchList=null;NetSchedule.add=function(netData,command)
{if(!NetSchedule.list)NetSchedule.list=[];if(!command){command=netData.command||netData.callback;}
NetSchedule.list.push({'command':command,'netData':netData});if(netData.watchdog){if(!NetSchedule.watchList)NetSchedule.watchList={};NetSchedule.watchList[netData.watchdog]=netData;}
return NetSchedule;};NetSchedule.run=function(force)
{if(!NetSchedule.processing||force)
{if(!NetSchedule.net)NetSchedule.net=new NetworkTransfer();var task=NetSchedule.list[0];NetSchedule.currentTask=task;if(task)
{NetSchedule.list.splice(0,1);NetSchedule.processing=true;NetSchedule.currentCommand=task.command;NetSchedule.net.data=task.netData.data;NetSchedule.net.target=task.netData.url;NetSchedule.net.method=task.netData.method;NetSchedule.net.callback=NetSchedule.callback;NetSchedule.net.onerror=NetSchedule.errorCallback;NetSchedule.net.send();}
else{NetSchedule.processing=false;NetSchedule.watchdogRun();if(NetSchedule.repeat)setTimeout(NetSchedule.run,5000);}}};NetSchedule.callback=function(res)
{try{var n=NetSchedule.currentTask.netData;if(n.callback)n.callback(res,n.lObj);else if(NetSchedule.currentTask.netData.lObj)NetSchedule.currentCommand(res,NetSchedule.currentTask.netData.lObj);else NetSchedule.currentCommand(res);NetSchedule.watched(n.watchdog);}
catch(ex)
{}
NetSchedule.run(true);};NetSchedule.errorCallback=function(arg)
{if(NetSchedule.currentTask.netData.onerror)NetSchedule.currentTask.netData.onerror(arg,NetSchedule.currentTask.netData.lObj);NetSchedule.run(true);};NetSchedule.watched=function(arg)
{if(NetSchedule.watchList[arg])delete NetSchedule.watchList[arg];};NetSchedule.watchdogRun=function()
{for(var i in NetSchedule.watchList)
{if(NetSchedule.watchList[i]instanceof NetData){var n=NetSchedule.watchList[i];delete NetSchedule.watchList[i];n.watchdog=null;n.review=true;NetSchedule.add(n).run();}}};function NetData(url,data,method)
{this.url=null;this.data=null;this.method=null;this.lObj=null;this.callback=null;this.watchdog=null;this.review=null;this.url=url;this.method=method?method.toUpperCase():"GET";if(typeof(data)=="undefined")
{this.data=[];}
else if(typeof(data)=="string")
{}
else if(data instanceof Array)
{this.data=data;}
this.watchdog=null;this.review=false;this.add=function(param,value,encode)
{if(encode)this.data[param]=encodeURIComponent(value);else this.data[param]=value;return this;};this.commit=function()
{_ajaxQ.add(this).run();};this.ifAdd=function(condition,param,value,encode)
{if(condition)this.add(param,value,encode);return this;};};NetData.get=function(net)
{this.url=net.target;this.data=net.data;this.method=net.method;};function Utility()
{};Utility.parseXml=function(xml)
{if(window.DOMParser)
{var parser=new window.DOMParser();var doc=parser.parseFromXML(xml,"text/xml");}
else
{var doc=new ActiveXObject("Microsoft.DOMXML");doc.async=false;doc.load(xml);}
return doc;};Utility.StringForm=function(format,data)
{var result=format;if(data instanceof Array)
{}
else if(data instanceof Object)
{for(var i in data)
{result=result.replace(new RegExp("\%"+i+"\%","g"),data[i]);}
return result;}
return format;};function JetApp()
{};JetApp.form=null;JetApp.classRegister=null;JetApp.dictionary=null;JetApp.currentClass=null;JetApp.uid=null;JetApp.groupId=null;JetApp.register=function(className,classType)
{if(!JetApp.classRegister)JetApp.classRegister={};JetApp.classRegister[className]=classType;};JetApp.buildForm=function(o,view,par,defClassName)
{for(var cls in JetApp.classRegister)
{if(o instanceof JetApp.classRegister[cls]){var className=cls;}}
if(!className&&defClassName)className=defClassName;JetApp.currentClass=className;if(view==2&&JetApp.classRegister[className].buildItem)
JetApp.classRegister[className].buildItem(o);else
var dlg=JetApp.form[className][view];if(view==2)
{var ownResult=false;if(JetApp.classRegister[className].checkPrivilege)ownResult=JetApp.classRegister[className].checkPrivilege(o);var owner=o.owner||o.uid;var groupId=o.groupId?o.groupId:"NO GROUP ID";if((owner=JetApp.uid||groupId==JetApp.groupId||ownResult)&&JetApp.form[className].ownerOperation)
{dlg=dlg.replace("%operation%",JetApp.form[className].ownerOperation);}
else if(JetApp.form[className].userOperation)
{dlg=dlg.replace("%operation%",JetApp.form[className].userOperation);}
else
{dlg=dlg.replace("%operation%","");}}
dlg=JetApp.bindToObject(o,dlg,JetApp.dictionary);var c=null;if(JetApp.form[className+view+"par"])
{c=document.createElement(JetApp.form[className+view+"par"]);}
else if((view%2)!==0)c=document.createElement('div');else if(view==2)var c=document.createElement('tr');if(c){c.innerHTML=dlg;if(JetApp.form[className+view+"cssClass"])c.setAttribute('class',JetApp.form[className+view+"cssClass"]);}
else c=dlg;if(par)
{par=typeof(par)=="string"?document.getElementById(par):par;if(typeof(c)=="string")par.innerHTML+=c;else par.appendChild(c);}
var fn=null;if((fn=JetApp.classRegister[className].bind))
{if(fn.length==2)
fn(o,c);else if(fn.length==3)
fn(o,c,view);}
return c;};JetApp.buildItems=function(items,view,par,idPrefix)
{};JetApp.bindToObject=function(o,dlg,dic)
{var objPat=null;var lbl=/\%(\w+)\-lbl\%/g;if(o)for(var i in o)
{if(typeof(o[i])=="object")
{}
else
{objPat=new RegExp("\%"+i+"\%","g");dlg=dlg.replace(objPat,o[i]);}}
if(dic)
{while((r=lbl.exec(dlg)))
{dlg=dlg.replace(r[0],dic[r[1]]);}}
return dlg;};JetApp.config=function()
{JetApp.form={};};JetApp.listItems=function(arr,view,par,className)
{if(!view)view=2;if(arr instanceof Array)
{var c=(view==2)?document.createElement('table'):document.createElement('ul');var id="";if(typeof(par)=="string")
{id=par+"Items";par=document.getElementById(par);}
else if(par)
{id=par.getAttribute('id')+"Items";}
else
{if(typeof(LU))
{par=document.getElementById(LU.painterArea);id=LU.painterArea+"Items";}}
c.setAttribute('id',id);if(view==2){var header=document.createElement('tr');header.setAttribute('class','header');c.appendChild(header);}
if(par)par.appendChild(c);for(var i=0;i<arr.length;i++)
{JetApp.buildForm(arr[i],view,c,className);}
if(view==2){var hdlg=JetApp.form[JetApp.currentClass||className][view];hdlg=JetApp.bindToObject(StrRes,hdlg);header.innerHTML=hdlg;}
return c;}};var NetworkTransferList=[];var NetworkTransferIndex=0;function NetworkTransfer(target,credential)
{this.target=target;this.handle=null;this.data={};this.method="GET";this.done=false;this.callback=null;this.useXml=false;this.error=false;this.onerror=false;this.unsafe=false;this.xml=null;this.text=null;this.middleUrl=null;this.credential=true;this.uploadMode=false;this.onprogress=null;if(typeof(credential)!="undefined")
{this.credential=credential;}
this.index=NetworkTransferIndex;NetworkTransferIndex++;if(window.XMLHttpRequest)this.handle=new XMLHttpRequest();else if(window.ActiveXObject)this.handle=new ActiveXObject("Microsoft.XMLHTTP");this.clear=function(clearCallbacks)
{this.data=[];this.method="GET";if(clearCallbacks)
{this.callback=null;this.onerror=false;}};this.send=function()
{if(NetworkTransfer.alternativeSend){NetworkTransfer.alternativeSend(this);return;}
var url="";if(this.middleUrl&&this.target.indexOf('http')===0){url=this.middleUrl;this.add("turlbnt",this.target,true);this.target=url;}else{url=this.target;}
if(NetworkTransfer.bridge&&url.indexOf('http')===0){for(var bi=0;bi<NetworkTransfer.bridgers.length;bi++){if(url.match(NetworkTransfer.bridgers[bi])){this.add("turlbnt",url,true);url=NetworkTransfer.bridge;this.target=url;}}}
if(NetworkTransfer.beforeSend)NetworkTransfer.beforeSend(this);url=this.target;var urlData="";var otype="";for(var i in this.data)
{otype=typeof(this.data[i]);if(otype=="string"||otype=="number"){if(urlData)urlData+="&";urlData+=i+"="+this.data[i];}else if(this.data[i]instanceof HTMLInputElement){this.uploadMode=true;this.method="POST";break;}}
this.done=false;try{if(this.method.toUpperCase()=="GET")
{if(urlData){if(url.indexOf('?')>0)url+="&";else url+="?";url+=urlData;}
this.handle.open("GET",url,true);/*---debug---*/console.log(url);/*---debug---*/this.handle.withCredentials=this.credential;this.handle.send(null);}
else
{if(this.uploadMode){this.handle.onprogress=this.onprogresschanged;urlData=new FormData();for(var i in this.data){urlData.append(i,this.data[i]);}}
this.handle.open("POST",this.target,true);this.handle.withCredentials=this.credential;this.handle.setRequestHeader("Content-type",(this.uploadMode?"multipart/form-data":"application/x-www-form-urlencoded;charset=utf-8"));if(this.unsafe&&!this.uploadMode)
{this.handle.setRequestHeader("Content-length",urlData.length);this.handle.setRequestHeader("Connection","close");}
this.handle.send(urlData);}}catch(ex){if(this.onerror)this.onerror("no connection");}
this.handle.ntindex=this.index;if(!this.uploadMode){this.handle.onreadystatechange=function()
{if(this.readyState==4&&this.status==200)
{if(NetworkTransferList[this.ntindex].callback)NetworkTransferList[this.ntindex].callback(this.responseText);if(NetworkTransferList[this.ntindex].useXml)
NetworkTransferList[this.ntindex].xml=this.responseXML;else
NetworkTransferList[this.ntindex].text=this.responseText;NetworkTransferList[this.ntindex].done=true;NetworkTransferList[this.ntindex].error=false;}
else if((this.readyState==4&&this.status!=200)||this.status>300)
{NetworkTransferList[this.ntindex].done=true;NetworkTransferList[this.ntindex].error=true;if(NetworkTransferList[this.ntindex].onerror)
NetworkTransferList[this.ntindex].onerror(this.status);}};}else{this.handle.onload=function(){if(this.status==200){NetworkTransferList[this.ntindex].done=true;NetworkTransferList[this.ntindex].error=true;if(NetworkTransferList[this.ntindex].callback)
NetworkTransferList[this.ntindex].callback(this.responseText);}};}};this.add=function(key,value,encode)
{if(encode)this.data[key]=encodeURIComponent(value);else this.data[key]=value;};this.openByPost=function()
{form=document.getElementById("nt5lastForm");if(form)document.body.removeChild(form);form=document.createElement("form");form.setAttribute("action",this.target);form.setAttribute("method","POST");form.setAttribute("target","_blank");form.setAttribute("enctype","multipart/form-data");form.setAttribute("id","nt5lastForm");for(i in this.data)
{h=document.createElement("input");h.setAttribute("type","hidden");h.setAttribute("name",i);h.setAttribute("value",this.data[i]);form.appendChild(h);}
document.body.appendChild(form);form.submit();};this.onprogresschanged=function(e){if(e.lengthComputable){var percentComplete=(e.loaded / e.total)*100;if(this.onprogress)this.onprogress(percentComplete);}}
NetworkTransferList[this.index]=this;}
NetworkTransfer.alternativeSend=null;NetworkTransfer.bridgers=[];NetworkTransfer.bridge=null;NetworkTransfer.beforeSend=null;function Popup(itemMode,inner,css)
{this.x=0;this.y=0;this.dialog=null;this.title=null;this.maxWidth=250;this.maxHeight=350;this.relatedControl=null;this.showScrollY=true;this.showScrollX=false;this.items=null;this.itemMode=null;this.index=null;this.focusOutMode=false;this.css=null;this.activeIndex=0;this.keyIndex=0;this.defaultEvent=null;this.items=[];this.itemMode=itemMode?true:false;this.css=css?css:null;if(!Popup.list)Popup.list=[];var nindex=Popup.list.length;Popup.list[nindex]=this;this.index=nindex;this.defaultEvent=null;this.show=function(parent,force)
{Popup.closeAll();if(!this.isOpen){document.body.appendChild(Popup.buildForm(this),force);if(this.focusOutMode){document.body.addEventListener("click",Popup.closeAll);}
if(document.body.onscroll){Popup.bodyScroll=document.body.onscroll;}
document.body.onscroll=function(e){Popup.closeAll();if(Popup.bodyScroll)Popup.bodyScroll(e);};Popup.setBound(this);Popup.activeObject=this;this.isOpen=true;if(this.relatedControl){Popup.oldOnKey=null;if(this.relatedControl.onkeyup&&this.relatedControl.onkeyup!=Popup.onKey){Popup.oldOnKey=this.relatedControl.onkeyup;Popup.onkeyup=function(event){Popup.oldOnKey(event);Popup.onKey(event);};}
else{this.relatedControl.onkeyup=Popup.onKey;}
if(this.dialog.ul){var minWidth=this.relatedControl.offsetWidth;this.dialog.ul.style.minWidth=minWidth+"px";}}}};this.addItem=function(item)
{var nindex=this.items.length;this.items[nindex]=item;item.index=nindex;item.popupIndex=this.index;if(this.dialog)
{this.dialog.ul.appendChild(PopupItem.buildForm(item));}};this.onClose=function()
{if(this.relatedControl){this.relatedControl.onkeyup=Popup.oldOnKey;Popup.oldOnKey=null;PopupItem.diselectAll(this.items);}};};Popup.list=null;Popup.isOpen=false;Popup.mouseX=0;Popup.mouseY=0;Popup.eventObject=null;Popup.activeObject=null;Popup.oldOnKey=null;Popup.bodyScroll=null;Popup.buildForm=function(o,force)
{o.keyIndex=-1;if(!o.dialog||force)
{for(var i=0;i<o.items.length;i++){o.items[i].popupIndex=o.index;o.items[i].index=i;}
o.output=null;var d=document.createElement("div");d.setAttribute("class","popupDialog");var back=document.createElement("div");o.dialog=d;o.backDialog=back;back.setAttribute("class","backDialog");if(!o.focusOutMode)
{back.appendChild(d);o.output=o.backDialog;o.backDialog.oncontextmenu=Popup.backEvent;o.backDialog.onclick=Popup.closeAll;}
else
{o.output=o.dialog;}
if(o.css)o.output.setAttribute("class",o.css);if(o.maxHeight)d.style.height=o.maxHeight;else
{var h=window.innerHeight-o.y;d.style.height=h+"px";}
if(o.maxWidth)d.style.width=o.maxWidth;else
{var w=window.innerWidth-o.x;d.style.width=w+"px";}
if(o.itemMode)
{d.ul=document.createElement("ul");for(var i=0;i<o.items.length;i++)
{d.ul.appendChild(PopupItem.buildForm(o.items[i]));}
d.appendChild(d.ul);}}
else
{var d=o.dialog;if(o.itemMode)
{var ul=d.ul;ul.innerHTML="";for(var i=0;i<o.items.length;i++)
{if(o.items[i].dialog)ul.appendChild(o.items[i].dialog);else ul.appendChild(PopupItem.buildForm(o.items[i]));}}}
return o.output;};Popup.closeAll=function(e)
{if(Popup.bodyScroll){document.body.onscroll=Popup.bodyScroll;Popup.bodyScroll=null;}
var o=null;for(var i=0;i<Popup.list.length;i++)
{o=Popup.list[i];if(o.dialog&&o.isOpen)
{document.body.removeChild(o.output);o.onClose();o.isOpen=false;}}
if(o.focusOutMode||true){document.body.removeEventListener("click",Popup.closeAll);}};Popup.onclickpopup=function(evt)
{if(evt.stopPropagation)evt.stopPropagation();if(evt.cancelBubble)evt.cancelBubble=true;};Popup.getMouse=function(evt)
{Popup.mouseX=evt.clientX;Popup.mouseY=evt.clientY;};Popup.backEvent=function(e)
{return false;};Popup.set=function(obj,popup)
{obj.popupMenu=popup;obj.oncontextmenu=function(e)
{var p=e.target;Popup.getMouse(e);while(p){if(p.popupMenu){Popup.eventObject=p;p.popupMenu.show();break;}else if(p.stopPopup)break;p=p.parentElement;}
return false;};};Popup.clearItems=function(popup)
{if(popup.dialog)
{popup.dialog.ul.innerHTML="";popup.items.length=0;}};Popup.setBound=function(o)
{if(o.relatedControl)
{var b=o.relatedControl.getBoundingClientRect();o.y=(b.height+b.top);o.x=b.left;if(o.focusOutMode)
{o.relatedControl.addEventListener("focusout",Popup.delayedCloseAll,false);o.relatedControl.addEventListener("blur",Popup.delayedCloseAll,false);}}
else
{o.x=Popup.mouseX;o.y=Popup.mouseY;if(o.x+o.dialog.offsetWidth>window.innerWidth)o.x=window.innerWidth-o.dialog.offsetWidth;if(o.y+o.dialog.offsetHeight>window.innerHeight)o.y=window.innerHeight-o.dialog.offsetHeight;}
o.dialog.style.top=o.y+"px";o.dialog.style.left=o.x+"px";};Popup.onKey=function(event)
{var p=Popup.activeObject;switch(event.keyCode)
{case 13:Popup.closeAll();if(PopupItem.runCommand(p.index,p.keyIndex)){return;}else{if(p.defaultEvent)p.defaultEvent();}
break;case 27:Popup.closeAll();break;case 37:break;case 38:try{if(p.items[p.keyIndex].dialog.getAttribute("class").indexOf('selected')>=0){if(p.keyIndex>-1)p.keyIndex--;else p.keyIndex=p.items.length-1;}}catch(ex){p.keyIndex=p.items.length-1;}
PopupItem.select(p.items,p.keyIndex);break;case 39:break;case 40:try{if(p.items[p.keyIndex].dialog.getAttribute("class").indexOf('selected')>=0){if(p.keyIndex<p.items.length-1)p.keyIndex++;else p.keyIndex=0;}}catch(ex){p.keyIndex=0;}
PopupItem.select(p.items,p.keyIndex);break;}};Popup.delayedCloseAll=function()
{setTimeout(Popup.closeAll,200);};Popup.fireContextMenu=function(par)
{if(window.CustomEvent){par.dispatchEvent(new CustomEvent('contextmenu'));}else if(document.createEvent){var ev=document.createEvent('HTMLEvents');ev.initEvent('contextmenu',true,false);par.dispatchEvent(ev);}else{par.fireEvent('oncontextmenu');}};function PopupItem(title,cmd,icon,tag,styleName)
{this.index=null;this.title=null;this.icon=null;this.command=null;this.popupIndex=null;this.dialog=null;this.tag=null;this.title=title;this.command=cmd;this.icon=icon;this.tag=tag;this.styleName=styleName;};PopupItem.styleName=null;PopupItem.buildForm=function(o)
{if(!o.dialog)
{var li=document.createElement("li");if(o.styleName)li.setAttribute("class",o.styleName);o.dialog=li;if(o.icon)
{var img=document.createElement("img");img.src=o.icon;li.appendChild(img);}
if(o.title)
{var span=document.createElement("span");span.innerHTML=o.title;li.appendChild(span);}
if(typeof(o.command)=="string")
{li.setAttribute("onclick",o.command);}
else if(typeof(o.command)!="undefined")
{li.setAttribute("popupIndex",o.popupIndex);li.setAttribute("itemIndex",o.index);li.onclick=PopupItem.onClick;}}
return o.dialog;};PopupItem.runCommand=function(popupIndex,itemIndex)
{var item=Popup.list[popupIndex].items[itemIndex];if(item)if(item.command)item.command(item);Popup.closeAll();};PopupItem.diselectAll=function(items)
{for(var i=0;i<items.length;i++){items[i].dialog.setAttribute('class','');}};PopupItem.select=function(items,index)
{PopupItem.diselectAll(items);if(index>-1)items[index].dialog.setAttribute('class','selected');};PopupItem.onClick=function(event)
{if(event.target.nodeName.toLowerCase()=="li"){Popup.closeAll();var popupIndex=event.target.getAttribute("popupIndex");var itemIndex=event.target.getAttribute("itemIndex");var item=Popup.list[popupIndex].items[itemIndex];if(item)if(item.command)item.command(item);event.cancelBubble=true;event.stopPropagation();}else{if(event.target.parentElement)event.target.parentElement.click();}};function CloudFile(title,code,owner,size,created,modified,parent,type,mode,share,offline,id)
{this.title=null;this.code=null;this.promotion=null;this.owner=null;this.size=null;this.created=null;this.modified=null;this.parent=null;this.type=null;this.id=null;this.offline=null;this.mode=0;this.share=0;this.privacy=null;this.url=null;this.owner=owner;this.title=title;this.code=code;this.size=size?size:0;this.created=created?created:0;this.modified=modified?modified:0;this.parent=parent?parent:0;this.type=type?parseInt(type):1;this.mode=mode?mode:0;this.share=share?share:0;this.offline=offline?offline:0;this.id=id?id:0;this.url="";};CloudFile.net=null;CloudFile.server=null;CloudFile.table='cfTb';CloudFile.list=null;CloudFile.dedicated=false;CloudFile.net2=null;CloudFile.activeObject=null;CloudFile.save=function(file,job)
{var n=CloudFile.net;n.clear();if(typeof(job)!="undefined")n.target=CloudFile.server+"/client/file/"+job+"/";n.target=CloudFile.server+"client/file/save";var xml="<CloudFile>\n";if(file instanceof Array)
{for(var i in file)
{if(file[i]instanceof CloudFile)
{xml+=CloudFile.toXml(file[i]);xml+="\n";}}}
else
{xml+=CloudFile.toXml(file);xml+="\n";}
xml+="</CloudFile>";n.add("xml",xml,true);n.callback=null;n.send();};CloudFile.rename=function(file)
{var n=CloudFile.net;n.clear();n.target=CloudFile.server+"client/rename/";n.add("type",file.type);n.add("id",file.id);n.add("title",file.title);n.onError=null;n.callback=null;n.send();};CloudFile.delete=function(uid,ids,trash,type)
{if(type==1)
var n=CloudFile.net;else
var n=CloudFile.net2;n.clear();n.target=CloudFile.server+"client/file/delete/";n.add("ids",ids,true);n.add("trash",trash?trash:0);n.add("type",type?type:0);n.onError=null;n.callback=null;n.send();};CloudFile.search=function(parent,param,type,uid)
{var n=CloudFile.net;n.clear();n.target=CloudFile.server+"client/file/search/";if(typeof(parent)=="string")parent=parent.replace("dir","");n.add("parent",parent);if(param)n.add("param",param,true);if(typeof(type)!="undefined")n.add("type",type);else n.add("type",2);n.callback=FileManager.listFiles;n.send();};CloudFile.install=function(owner)
{var n=CloudFile.net;n.clear();n.target=CloudFile.server+"client/install/";n.onError=null;n.callback=null;n.send();};CloudFile.getFileData=function()
{if(res)
{var files=res.split(",");var fp=null;FileUploader.filesData=[];for(var i in files)
{fp=files[i].split(":");fname=fp[0];fname=fname.replace(/\%coma\%/g,",");fname=fname.replace(/\%colon\%/g,":");FileUploader.filesData.push({'title':fname,'code':fp[1],'size':fp[2],'time':fp[3]});}
if(FileUploader.uploadCallback)
FileUploader.uploadCallback();}
else if(res!=="")
{var n=CloudFile.net;n.clear();n.callback=FileUploader.getFileData;n.onerror=null;n.target=FileUploader.mirror+"client/file/getData/";n.send();}};CloudFile.toXml=function(cf)
{var pr=0;if(cf.mode)pr|=1;if(cf.share)pr|=2;if(cf.offline)pr|=4;var id=cf.id;if(typeof(id)=="string")id=id.replace("dir","");if(cf.type==1)
return"<File type=\"1\" url=\""+encodeURIComponent(cf.url)+"\" title=\""+cf.title+"\" owner=\""+cf.owner+"\" code=\""+cf.code+"\" size=\""+cf.size+"\" created=\""+cf.created+"\" modified=\""+cf.modified+"\" parent=\""+cf.parent+"\" privacy=\""+pr+"\" id=\""+id+"\"/>";else
return"<File type=\"0\" title=\""+cf.title+"\" owner=\""+cf.owner+"\" code=\"0\" size=\"0\" created=\""+cf.created+"\" modified=\""+cf.created+"\" parent=\""+cf.parent+"\" privacy=\""+pr+"\" id=\""+id+"\"/>";};CloudFile.parseXml=function(xml)
{if(typeof(xml)=="string")
{var doc=null;if(window.DOMParser)
{var parser=new DOMParser();doc=parser.parseFromString(xml,"text/xml");}
else
{doc=new ActiveXObject("microsoft.XMLDOM");doc.async=false;doc.loadXML(xml);}
if(doc)
{var fnodes=doc.getElementsByTagName("File");var res=[];CloudFile.list={};var tmp=null;var mode=0;var share=0;var offline=0;var pr=0;for(var i=0;i<fnodes.length;i++)
{if(fnodes[i].nodeType==1)
{cur=fnodes[i];pr=parseInt(cur.getAttribute("privacy"));mode=pr&1?1:0;share=pr&2?1:0;offlien=pr&4?1:0;if(cur.getAttribute("type")==1)
tmp=new CloudFile(cur.getAttribute("title"),cur.getAttribute("code"),cur.getAttribute("owner"),cur.getAttribute("size"),cur.getAttribute("created"),cur.getAttribute("modified"),cur.getAttribute("parent"),1,mode,share,offline,cur.getAttribute("id"));if(cur.getAttribute("type")=="0")
tmp=new CloudFile(cur.getAttribute("title"),0,cur.getAttribute("owner"),0,cur.getAttribute("created"),cur.getAttribute("created"),cur.getAttribute("parent"),0,mode,share,offline,"dir"+cur.getAttribute("id"));tmp.privacy=pr;tmp.url=decodeURIComponent(cur.getAttribute('url'));res.push(tmp);CloudFile.list[tmp.id]=tmp;}}
return res;}}
else if(typeof(xml)=="object")
{var tmp=null;var cur=xml;var pr=parseInt(cur.getAttribute("privacy"));var mode=pr&1?1:0;var share=pr&2?1:0;var offlien=pr&4?1:0;if(cur.getAttribute("type")==1)
tmp=new CloudFile(cur.getAttribute("title"),cur.getAttribute("code"),cur.getAttribute("owner"),cur.getAttribute("size"),cur.getAttribute("created"),cur.getAttribute("modified"),cur.getAttribute("parent"),1,mode,share,offline,cur.getAttribute("id"));if(cur.getAttribute("type")=="0")
tmp=new CloudFile(cur.getAttribute("title"),0,cur.getAttribute("owner"),0,cur.getAttribute("created"),cur.getAttribute("created"),cur.getAttribute("parent"),0,mode,share,offline,"dir"+cur.getAttribute("id"));tmp.privacy=pr;tmp.url=decodeURIComponent(cur.getAttribute('url'));tmp.privacy=pr;return tmp;}
return null;};CloudFile.getExtention=function(name)
{var pat=/\.(\w+)$/;var res=pat.exec(name);if(res[1])return res[1];else return"";};CloudFile.getUrlByCode=function(cfile)
{
	try
	{
	    var pat=/(\w+)_(\w+).(\w+)/;
	    var code=(cfile.code)?cfile.code:cfile;
	    var pr=(cfile.privacy)?cfile.privacy:1;
	    var share_param=cfile.shareKey?"&share_key="+cfile.shareKey:"";
	    var res=pat.exec(code);
	    var server=UniversalServer.getServer(1,res[1]);
	    return server.url+"client/file/go/?p="+pr+"&code="+code+share_param;
	}
	catch(ex)
	{
	    return null;
	}
	
};