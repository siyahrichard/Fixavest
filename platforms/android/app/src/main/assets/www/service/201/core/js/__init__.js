function __init__(){
  Libre.promptClass="blue";
  prompt=Libre.prompt;
  alert=Libre.alert;
  Jet.config();
  Libre.menu.clearItems();
  Libre.menu.clearTools();


  Libre.menu.addItem("<li onclick=\"Libre.sidebar.visible();\"><img id=\"sidebarBtn\" src=\"res/images/svg/white-menu.svg\"/></li>");
  Libre.menu.addItem("<li onclick=\"Libre.sidebar.pin();\"><img id=\"pinBtn\" src=\"res/images/svg/white-pin.svg\"/></li>");
  Libre.sidebar.show(Libre.menuBuilder());
  //Libre.menu.addTool("<li onclick=\"Libre\"><img id=\"settingsBtn\" src=\"res/images/svg/white-settings.svg\"/></li>");
  Libre.menu.addTool("<li id=\"searchPan\" onclick=\"Libre\"><input type=\"text\" placeholder=\"search...\" id=\"searchTxb\"/></li>");
  //Libre.sidebar.visible(false);

}
Libre.images={
  'normalPin':'res/images/svg/white-pin.svg',
  'setPin':'res/images/svg/pink-pin.svg',
  'normalSidebar':'res/images/svg/white-menu.svg',
  'setSidebar':'res/images/svg/pink-menu.svg'
};

Libre.menuBuilder=function(){
  var ret="<ul>";
  var menus=[
    {"title":"newMatch","action":"Match.onCreate();"},
    {"title":"openMatches","action":"Match.onListOpens();"},
    {"title":"history","action":"Match.onHistory();"},
    {"title":"spacer","action":""},
    {"title":"profile","action":"GProfile.onShow();"},
    {"title":"spacer","action":""},
    {"title":"achievements","action":""},
    {"title":"medals","action":""},
    {"title":"worldRate","action":"Match.onWorldRate();"},
    {"title":"countryRate","action":"Match.onCountryRate();"}
  ];
  for(var i=0;i<menus.length;i++){
    var mn=menus[i];
    ret+="<li onclick=\""+mn.action+"\">"+StrRes[mn.title]+"</li>";
  }
  ret+="</ul>";
  return ret;
}