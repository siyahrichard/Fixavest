var LU={};
Libre.portraitMode=false;
Libre.portraitLimit=1.2;

function __init__(){
  Libre.promptClass="blue";
  prompt=Libre.prompt;
  alert=Libre.alert;
  Jet.config();
  Libre.menu.clearItems();
  Libre.menu.clearTools();
  Libre.menu.addItem("<li onclick=\"Libre.sidebar.visible();\"><img id=\"sidebarBtn\" src=\"res/images/svg/white-menu.svg\"/></li>");
  Libre.menu.addItem("<li onclick=\"Libre.sidebar.pin();\"><img id=\"pinBtn\" src=\"res/images/svg/white-pin.svg\"/></li>");
  Libre.menu.addItem("<li class=\"hide\" id=\"closeAppBtn\" onclick=\"Messenger.closeApp()\"><img id=\"closeAppBtn\" src=\"res/images/png/close150.png\"/></li>");

  //Libre.menu.addTool("<li onclick=\"Libre\"><img id=\"settingsBtn\" src=\"res/images/svg/white-settings.svg\"/></li>");
  var search_events=" onkeyup=\"Conversation.search(event.target.value,null,true);\"";
  Libre.menu.addTool("<li id=\"searchPan\" onclick=\"Libre\" title=\"Close The App\"><input type=\"text\" placeholder=\"search...\" id=\"searchTxb\""+search_events+"/></li>");
  Libre.menu.addTool("<li id=\"audienceTxb\"></li>");
  Libre.sidebar.visible(false);
  Libre.sidebar.pin();

  LU.globalCallback=null;
  LU.login=false; LU.startedMessenger=false; LU.loadDeviceContact=false;//to avoid multiple configuration
  document.body.addEventListener("login",function(e){
      if(!LU.login){
        Libre.log('login...');
        _("#splash").addClass('hide');//hide splash screen after login
        Messenger.onHome();//show home dialog
        Messenger.currentUID=CAuth.activeObject.uid;
        FollowContact.uid=Messenger.currentUID;
        UserInfo.getDB(); //connect to database
        LU.peopleRoot=UniversalServer.getServer(3,
        FollowContact.parseUid(FollowContact.uid,true)).url;
        FollowContact.read();
        UserInfo.load();
        //Device
        if(typeof(device)!="undefined"){
          if(device.uuid){
            Libre.log('updating device info...')
            Device.cordova(Messenger.currentUID); //cordova jobs by jointab device
          }
        }
        LU.login=true;
      }
  });

  var startEvent="peopleready";
  contactEvent=null;
  if(typeof(cordova)!="undefined"){
    if(device){
      if(device.platform!="browser"){
        startEvent="contactchecked";
        contactEvent="peopleready";
      }
    }
  }
  document.body.addEventListener(startEvent,function(e){
    if(!LU.startedMessenger){
      Libre.log('Connected.');
      Messenger.config();
      Conversation.config();
      ConvSetting.config();
      //var msg=new Messenger(_("#workPan").source);
      Conversation.install();
      UserInfo.get(Messenger.currentUID,Messenger.showMeOnSidebar);
      LU.startedMessenger=true;
    }
  });
  if(contactEvent){
    document.body.addEventListener(contactEvent,function(e){
      if(!LU.loadDeviceContact){
        Libre.log('Loading device contacts...');
        //ContactCheck.config();//start to check contacts then trigger contactchecked to start messenger
        setTimeout(ContactCheck.config,200);//check contacts after 200 ms
        LU.loadDeviceContact=true;
      }
    });
  }

  //config bridges
  NetworkTransfer.bridge="client/Bridge/go/";
  NetworkTransfer.bridgers.push(/client\/FollowContact/);
  NetworkTransfer.bridgers.push(/client\/profile\/search/);
  NetworkTransfer.bridgers.push(/client\/Device\//);

  //CUAD commands
  Bon.cmd['shareMessage']=Conversation.cuadShareMessage;
  Bon.cmd['startChat']=Conversation.cuadStart;
  Bon.cmd['search']=Conversation.cuadSearch;

  //default apps
  Messenger.appList={
    201:Chess
  };

  window.addEventListener('orientationchange',Libre.onOrientation,false);
  Libre.onOrientation(null);
  if(typeof(CAuth)!="undefined")CAuth.isLogin(); //check the user has loged in or not then trigger login event to continue the app
}
Libre.images={
  'normalPin':'res/images/svg/white-pin.svg',
  'setPin':'res/images/svg/pink-pin.svg',
  'normalSidebar':'res/images/svg/white-menu.svg',
  'setSidebar':'res/images/svg/pink-menu.svg'
};
function stopProp(e){
  if(e.stopPropagation)e.stopPropagation();
  e.cancleBubble=true;
}

Libre.onResize=function(){
  Libre.onResizeMessenger();
};

Libre.onResizeMessenger=function(){
    var m=parseInt(_("#mainMenuPan").source.getBoundingClientRect().height);
    var s=parseInt(_("#statusPan").source.getBoundingClientRect().height);
    var sp=parseInt(document.querySelector(".sendArea").getBoundingClientRect().height);
    var separator=5;
    document.querySelector(".messageArea").style.height="calc(100vh - "+(m+s+sp+separator)+"px)";
};

Libre.checkOrientation=function(){
  Libre.portraitMode= (window.innerHeight/window.innerWidth)>Libre.portraitLimit;
  if(Libre.portraitMode){
    new JetHtml(document.body).removeClass('landscape');
    new JetHtml(document.body).addClass('portrait');
    Libre.sidebar.pin(false);
    Libre.sidebar.visible(false);//automatically hide sidebar
  }else{
    new JetHtml(document.body).removeClass('portrait');
    new JetHtml(document.body).addClass('landscape');
    Libre.sidebar.pin(true);
  }
};
Libre.onOrientation=function(e){
  setTimeout(Libre.checkOrientation,200);//check after render
};

Libre.logs=[];
Libre.logIndex=0;
Libre.logDelay=1500;
Libre.log=function(txt){
  Libre.logs[Libre.logs.length]=txt;
  console.log(txt); //live show on console logs
};
Libre.showLogs=function(){
  if(Libre.logs[Libre.logIndex]){
    Libre.status.show(Libre.logs[Libre.logIndex]);
    Libre.logIndex++;
  }
  setTimeout(Libre.showLogs,Libre.logDelay);
};
Libre.showLogs(); //start showing logs