function onLogedIn(watchdog){
	if(!LU.login){
		Libre.log('login...');
		_("#splash").addClass('hide');//hide splash screen after login
		Messenger.onHome();//show home dialog
		if(typeof(CAuth)!="undefined"){
		  Messenger.currentUID=CAuth.activeObject.uid;
		}
		//configMessenger();//in this file
		FollowContact.uid=Messenger.currentUID;
		UserInfo.getDB(); //connect to database
		LU.peopleRoot=UniversalServer.getServer(3,
		FollowContact.parseUid(FollowContact.uid,true)).url;
		FollowContact.read();
		//Device
		if(typeof(device)!="undefined"){
		  if(device.uuid){
		    Libre.log('updating device info...')
		    Device.cordova(Messenger.currentUID); //cordova jobs by jointab device
		  }
		}
		LU.login=true;
	}
}
function configMessenger(watchdog){//for test call on onLogedIn()
	if(!LU.startedMessenger){
      Libre.log('Connected.');
      Messenger.config();
      Conversation.config();
      ConvSetting.config();
      //var msg=new Messenger(_("#workPan").source);
      Conversation.install();
      LU.startedMessenger=true;
      UserInfo.get(Messenger.currentUID,onGetMeCompleted);//task ends on the onGetMeCompleted()
    }
}
function checkDeviceContacts(watchdog){
	if(!LU.loadDeviceContact){
		if(typeof(cordova)!="undefined"){
			if(device){
				if(device.platform!="browser"){
					Libre.log('Loading device contacts...');
					setTimeout(ContactCheck.config,200);//check contacts after 200 ms
					LU.loadDeviceContact=true;
					return;
				}
			}
		}
		Libre.loadWD.done('3',true);
	}
}
function onGetMeCompleted(uinfo){
	Messenger.showMeOnSidebar(uinfo);//show me on sidebar
	Libre.log('loading uinfo');console.log(uinfo);
	UserInfo.load(Object.keys(FollowContact.list));//load all contact users
	Libre.loadWD.done('2',true);
}

function onGesture(gs){
	var g=null;
	for(var i=0;i<gs.length;i++){
		g=gs[i];
		var d=Gesture.delta(g);
		if(Math.abs(d[Gesture.x])>50){
			if(Gesture.isLeft(g) && !Gesture.isToLeft(g)){
				Libre.sidebar.visible(true);
			}else if(Gesture.isLeft(g) && Gesture.isToLeft(g) && Math.abs(d[Gesture.x])>50){
				Libre.sidebar.visible(false);
			}
		}
	}
}