function Device(uuid,title,info,uid,option,status,expiration,id)
{
	
	this.id=null;
	this.uid=null;
	this.uuid=null;
	this.title=null;
	this.info=null;
	this.option=null;
	this.status=null;
	this.expiration=null;
	this.type=null;
this.id=id?id:0; this.uid=uid?uid:null; this.uuid=uuid?uuid:null; this.title=title?title:null; this.info=info?info:null;
this.option=option?option:0; this.status=status?status:0; this.expiration=expiration?expiration:0;
};



Device.table='device';
Device.currentStatus=1;
Device.activeDelay=120000;
Device.passiveDelay=600;
Device.continuesStatusUpdate=true;
Device.server='';
Device.activeObject=null;


Device.getId=function(o,callback)
{
	var n=new NetData();
	n.url=Device.server+"client/Device/getId/";
	if(callback)n.callback=callback;
	n.add('o',JSON.stringify(o),true).commit();
};
Device.setStatus=function(o,callback)
{
	if(!o)o=Device.activeObject;
	if(o){
		o.status=Device.currentStatus;
		if(o.status==1)o.expiration=Device.activeDelay;
		else if(o.status==2)o.expiration=Device.passiveDelay;
		else return;
		
		var n=new NetData();
		n.url=Device.server+"client/Device/setStatus/";
		if(callback)n.callback=callback;
		n.add('o',JSON.stringify(o),true).commit();
		
		if(Device.continuesStatusUpdate){
			setTimeout(Device.setStatus,o.expiration);
		}
	}
};
Device.search=function(uid,o,dl,ul,callback)
{
	var n=new NetData();
	n.url=Device.server+"client/Device/search/";
	if(callback)n.callback=callback;
	n.ifAdd(uid,'uid',uid,true).ifAdd(o,'o',JSON.stringify(o),true).commit();
};
Device.rename=function(o,title,callback)
{
	var n=new NetData();
	n.url=Device.server+"client/Device/rename/";
	if(callback)n.callback=callback;
	n.add('o',JSON.stringify(o),true).add('title',title,true).commit();
};
Device.cordova=function(uid)
{
	if((!Device.server) && uid){
		var prefix=/[a-z]+/i.exec(uid)[0];
		var server=UniversalServer.getServer(6,prefix);
		Device.server=server.url;
	}
	var o=Device.activeObject;
	if(!o){
		var id=0;
		if(localStorage.device_id)id=parseInt(localStorage.device_id);
		var o=new Device(
			device.uuid, device.mode /* for default title*/ ,  new DeviceInfo(
				device.manufacturer,
				device.platform,
				device.model,
				device.serial
			),
			null,
			0,//option
			1,
			120, //120 seconds for live status
			id
		);
		Device.activeObject=o;
	}
	
	if(o.id===0){
		Device.getId(o,function(res){
			res=parseInt(res);
			if(res>0){
				localStorage.setItem('device_id',res);
				Device.activeObject.id=res;
				setTimeout(Device.setStatus,Device.activeDelay);
			}
		});
	}else{
		Device.setStatus(o,1);
	}
};
function DeviceInfo(manufacture,os,model,serial,device)
{
	
	this.device=null;
	this.manufacture=null;
	this.os=null;
	this.model=null;
	this.serial=null;
this.device=device?device:null; this.manufacture=manufacture?manufacture:null; this.os=os?os:null; this.model=model?model:null; this.serial=serial?serial:null;
};



DeviceInfo.table='device_info';

