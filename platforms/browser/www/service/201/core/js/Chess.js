function Board()
{
	
	this.id=null;
	this.history=null;
	this.pieces=null;
	this.dialog=null;
	this.cells=null;
	this.clientColor=White;
	this.turn=White;
	this.locked=false;
	this.flyColor=-1;
this.cells={};
this.history=[];
this.pieces=[
	//white
	new Piece(Rook,White,'a1',0,1),
	new Piece(Knight,White,'b1',0,2),
	new Piece(Bishop,White,'c1',0,3),
	new Piece(Queen,White,'d1',0,4),
	new Piece(King,White,'e1',0,5),
	new Piece(Bishop,White,'f1',0,6),
	new Piece(Knight,White,'g1',0,7),
	new Piece(Rook,White,'h1',0,8),
	//pawns
	new Piece(Pawn,White,'a2',0,9),
	new Piece(Pawn,White,'b2',0,10),
	new Piece(Pawn,White,'c2',0,11),
	new Piece(Pawn,White,'d2',0,12),
	new Piece(Pawn,White,'e2',0,13),
	new Piece(Pawn,White,'f2',0,14),
	new Piece(Pawn,White,'g2',0,15),
	new Piece(Pawn,White,'h2',0,16),
	
	//black
	new Piece(Rook,Black,'a8',0,17),
	new Piece(Knight,Black,'b8',0,18),
	new Piece(Bishop,Black,'c8',0,19),
	new Piece(Queen,Black,'d8',0,20),
	new Piece(King,Black,'e8',0,21),
	new Piece(Bishop,Black,'f8',0,22),
	new Piece(Knight,Black,'g8',0,23),
	new Piece(Rook,Black,'h8',0,24),
	//pawns
	new Piece(Pawn,Black,'a7',0,25),
	new Piece(Pawn,Black,'b7',0,26),
	new Piece(Pawn,Black,'c7',0,27),
	new Piece(Pawn,Black,'d7',0,28),
	new Piece(Pawn,Black,'e7',0,29),
	new Piece(Pawn,Black,'f7',0,30),
	new Piece(Pawn,Black,'g7',0,31),
	new Piece(Pawn,Black,'h7',0,32),
];

//add soldiers
if(!Board.flyBoard){
	Board.activeObject=this;
	this.turn=White;
}
	
	this.setWin=function(color)
	{
		if(color===White){
			//white wins
			alert("White wins");
		}else if(color===Black){
			//black wins
			alert("Black wins");
		}else{
			//drawn
			alert("Drawn");
		}
	};
};



Board.activeObject=null;
Board.checked=null;
Board.flyBoard=false;


Board.config=function()
{
	Jet.App.register('Board',Board);
	Jet.App.form.Board={};
	Jet.App.form.Board[1]="<div class=\"Board\"><div class=\"OpponentCemetry\"></div><div class=\"BoardBody\"><div class=\"chRow\"><div class=\"noneAdrs\">&nbsp;</div><div class=\"Area\">a</div><div class=\"Area\">b</div><div class=\"Area\">c</div><div class=\"Area\">d</div><div class=\"Area\">e</div><div class=\"Area\">f</div><div class=\"Area\">g</div><div class=\"Area\">h</div><div class=\"noneAdrs\">&nbsp;</div></div><div class=\"BoardArea\"></div><div class=\"chRow\"><div class=\"noneAdrs\">&nbsp;</div><div class=\"Area\">a</div><div class=\"Area\">b</div><div class=\"Area\">c</div><div class=\"Area\">d</div><div class=\"Area\">e</div><div class=\"Area\">f</div><div class=\"Area\">g</div><div class=\"Area\">h</div><div class=\"noneAdrs\">&nbsp;</div></div></div><div id=\"piecesSelector\" status=\"close\"><div id=\"piecesPan\"></div></div><div class=\"MyCemetry\"></div></div>";
	Jet.App.form.Board[2]="";
	
	Jet.App.form.Board.userOperation="";
	Jet.App.form.Board.ownerOperation=Jet.App.form.Board.userOperation+
	"";
};
Board.buildForm=function(o,view,par)
{
	var ctrl=Jet.App.buildForm(o,view,par);
	par=ctrl.parentElement;
	o.dialog=ctrl;
	var board=ctrl.querySelector(".Board");
	if(o.flyColor>-1){
		board.setAttribute("clientColor",o.flyColor);
	}else board.setAttribute("clientColor",o.clientColor);
	if(view==1){
		//var max_width=par.offsetWidth-20; var max_height=par.offsetHeight-20;
		//var size=max_width<max_height?max_width:max_height;
		//var vertical=max_width<max_height?true:false;
		//(new JetHtml(board)).addClass(vertical?"vertical":"horizontal");
		var boardArea=ctrl.querySelector(".BoardArea"); //cell_float="right";
		//var boardBody=ctrl.querySelector(".BoardBody"); //cell_float="right";
		boardArea.setAttribute("client",o.ClientColor);
		var row_step=1; var row_start=0; var y=8; total_y=8;
		if((o.clientColor==White && o.flyColor<0) || o.flyColor==White){
			row_step=-1; row_start=7; y=0; //cel_float="left"
		}
		var x=8; var row=null; var cell=null; var address=null;
		var xnames=['a','b','c','d','e','f','g','h'];
		for( var i=row_start;i>-1 && i<total_y;i+=row_step){
			row=document.createElement('div');
			row.setAttribute('class','chRow');
			var leftAdrs=document.createElement("div"); leftAdrs.innerHTML=""+(i+1); var rightAdrs=document.createElement("div"); rightAdrs.innerHTML=""+(i+1);
			leftAdrs.setAttribute("class","Adrs"); rightAdrs.setAttribute("class","Adrs");
			//leftAdrs.style.float=rightAdrs.style.float=cell_float;
			row.appendChild(leftAdrs);
			for(var j=0;j<x;j++){
				cell=document.createElement('div');
				cell.setAttribute('class','cell');
				cell.setAttribute("onclick","Board.cellClick(event);");
				cell.onmousemove=jetXtra.drMove; //enable drag mouse over for all cells
				//cell.style.float=cell_float;
				address=xnames[j]+(i+1);
				if(((i+1)%2===0 && (j+1)%2===0) || ((i+1)%2==1 && (j+1)%2==1)){
					cell.setAttribute('color','black');
				}else cell.setAttribute('color','white');
				cell.setAttribute('title',address);
				//cell.setAttribute("onmouseover","Board.cellMouseOver(event);");
				row.appendChild(cell);
				o.cells[address]=cell;
			}
			row.appendChild(rightAdrs);
			boardArea.appendChild(row);
		}
		//boardBody.style.height=size+"px";
		//boardBody.style.width=size+"px";
		
		var bresize=function(e){
			var board=arguments.callee.board;
			Board.resize(board);
		};
		bresize.board=o;
		document.body.onresize=bresize;
		bresize(null);
		
		for(var k=0;k<o.pieces.length;k++){
			if(o.pieces[k].place)Piece.buildForm(o.pieces[k],1,o.cells[o.pieces[k].place]);
			else{ Piece.buildForm(o.pieces[k],1); Piece.kill(o.pieces[k]); }
			//Piece.moveTo(o.pieces[k],o.pieces[k].place);
		}
	}
	
};
Board.getCell=function(e)
{
	//get top-left cell if(player white) a1 else h8
	var board=Board.activeObject;
	var fcell= board.clientColor==White?board.cells.a8:board.cells.h1;
	var f_bounding=fcell.getBoundingClientRect();
	
	var width=f_bounding.width; var height=f_bounding.height;
	var x=e.screenX-f_bounding.left; var y=e.screenY-f_bounding.top;
	
	var left_index=parseInt(x/width); var top_index=parseInt(y/height);
	var xnames=['a','b','c','d','e','f','g','h'];
	var adrs=null;
	if(board.clientColor==White){
		var adrs=xnames[left_index]+(1+8-top_index);
	}else{
		var adrs=xnames[8-left_index-1]+top_index;
	}
	return board.cells[adrs];
};
Board.getPieceOf=function(place)
{
	var b=Board.activeObject;
	/*if(b.cells[place].childNodes.length>0){
		return b.cells[place].childNodes[0].lObj;
	}*/
	for(var i=0;i<b.pieces.length;i++)if(b.pieces[i].place==place)return b.pieces[i];
	return null;
};
Board.getPiecesWith=function(color,type)
{
	var b=Board.activeObject;
	var ret=[];
	for(var i=0;i<b.pieces.length;i++)if(b.pieces[i].type===type && b.pieces[i].color===color)ret.push(b.pieces[i]);
	return ret;
};
Board.cellClick=function(e)
{
	var o=Piece.activeObject;
	if(e.target.getAttribute("class")!="cell"){e.target.parentElement.click();return;}
	if(o){
		var ctrl=o.dialog;
		ctrl.setAttribute('class',"Piece");
		ctrl.style.left=""; ctrl.style.top="";
		
		if(Board.activeObject.turn==o.color){
		var oldParent=ctrl.parentElement;
		var newParent=e.target;
		var adrs=newParent.getAttribute("title");
		
		if(!Piece.validateMove(adrs)){
			console.log('invalid move.'); Piece.hideSuggests();
			return;
		}
		if(oldParent!=newParent){
			
			var move_option=0;
			var move_conv=0;
			
			if(newParent.childNodes.length>0){
				var fpiece=Board.getPieceOf(adrs);
				if(fpiece){
					if(fpiece.color!=o.color && fpiece.type!=King){
						Piece.kill(fpiece);
						newParent.innerHTML="";
					}else{
						console.log("invalid move."); Piece.hideSuggests();
						return;//discard move
					}
				}
			}
			o.moved=true;
			var wayType=newParent.getAttribute("way");
			if(wayType==3){
				var sg=Piece.currentSuggests; var s=null; for(var i=0;i<sg.length;i++){if(adrs==sg[i].place){s=sg[i]; break;}}
				if(s && s.callback)move_conv=s.callback(s);
			}
			
			if(move_conv)move_option|=Math.pow(2,MoveOptionPieces.indexOf(move_conv));
			var movement=new ChMove(o,adrs,parseInt(Date.now()/1000),move_conv);
			Board.activeObject.history.push(movement);
			
			
			oldParent.removeChild(ctrl);
			newParent.appendChild(ctrl);
			o.place=newParent.getAttribute('title');
			Board.activeObject.turn= o.color==White?Black:White;
			Piece.isChecked(); //check any king is in check
			Piece.isMate(Board.activeObject.turn); //check mate
			Chess.onTurnChanged();//send changes to server
		}
		//console.log(e);
		}else{
			console.log("It's not your turn.");
		}
		Piece.activeObject=null;
		e.cancelBubble=true;
		e.stopPropagation();
		Piece.hideSuggests();
	}
};
Board.resize=function(o)
{
	
	var par=o.dialog.parentElement;
	if(par){//the board is showing
		//var ctrl=o.dialog;
		var oc=o.dialog.querySelector(".OpponentCemetry");
		var mc=o.dialog.querySelector(".MyCemetry");
		var board=o.dialog.querySelector(".Board");
		var max_width=par.offsetWidth-20; var max_height=par.offsetHeight-20;
		var size=max_width<max_height?max_width:max_height;
		var vertical=max_width<max_height?true:false;
		(new JetHtml(board)).attr('class','Board '+(vertical?"vertical":"horizontal"));
		//var boardArea=o.dialog.querySelector(".BoardArea"); //cell_float="right";
		var boardBody=o.dialog.querySelector(".BoardBody"); //cell_float="right";
		
		boardBody.style.height=size+"px";
		boardBody.style.width=size+"px";
		if(!vertical){
			mc.style.height=oc.style.height="calc("+size+"px - 2vh)";
			oc.style.width=oc.style.width="";
		}else{
			mc.style.height=oc.style.height="";
			oc.style.width=oc.style.width="calc("+size+"px - 2vh)";
		}
	}
};
Board.toString=function(o)
{
	//format=> clientColor,turn:pieces
	return o.clientColor+","+o.turn+":"+Piece.toString(o.pieces);
};
Board.parse=function(arg)
{
	Board.flyBoard=true;//skip to set new Board object as activeObject
	var parts=arg.split(':');
	var bparts=parts[0].split(',');
	var board=new Board();
	board.clientColor=parseInt(bparts[0]);
	board.turn=parseInt(bparts[1]);
	board.pieces=Piece.parse(parts[1]);
	Board.flyBoard=false;
	return board;
};
function Piece(type,color,place,status,id)
{
	
	this.id=null;
	this.type=null;
	this.color=null;
	this.place=null;
	this.status=null;
	this.rotatable=true;
	this.moved=false;
	this.board=null;
	this.dialog=null;
this.type=type; this.color=color; this.place=place; this.status=status;
if(id)this.id=id;
else{
	this.id=1;
}
this.moved=false;
};



Piece.currentSuggests=null;
Piece.pathFuncs=null;
Piece.checkMode=false;
Piece.activePawn=null;
Piece.dragPieceEnable=false;
Piece.activeObject=null;
Piece.clickBound=500;
Piece.mouseDownTime=null;


Piece.inDanger=function(piece)
{
	var ret=[]; var fp=null;
	var b=Board.activeObject;
	Piece.checkMode=true;
	for(var i=0;i<b.pieces.length;i++){
		fp=b.pieces[i];
		if(fp.color!=piece.color && fp.place){
			var sg=Piece.pathFuncs[fp.type](fp);
			for(var j=0;j<sg.length;j++){
				if(sg[j].target==piece){
					ret.push(fp);
					break;
				}
			}
		}
	}
	Piece.checkMode=false;
	return ret;
};
Piece.showSuggests=function()
{
	var sg=Piece.currentSuggests; var s=null; var cell=null;
	for(var i=0;i<sg.length;i++){
		s=sg[i]; cell=Board.activeObject.cells[s.place];
		if(s.callback){
			cell.setAttribute("way","3");
		}else if(s.target && s.target.color!=Board.activeObject.turn){
			s.target.dialog.setAttribute("danger","1");
			cell.setAttribute("way","2");
		}else{
			cell.setAttribute("way","1");
		}
	}
};
Piece.validateMove=function(place)
{
	var sg=Piece.currentSuggests;
	for(var i=0;i<sg.length;i++)if(sg[i].place==place)return true;
	return false;
};
Piece.canMask=function(piece,target)
{
	
	var par=o.dialog.parentElement;
	if(par){//the board is showing
		//var ctrl=o.dialog;
		var oc=o.dialog.querySelector(".opponentcemetry");
		var mc=o.dialog.querySelector(".mycemetry");
		var board=o.dialog.querySelector(".Board");
		var max_width=par.offsetWidth-20; var max_height=par.offsetHeight-20;
		var size=max_width<max_height?max_width:max_height;
		var vertical=max_width<max_height?true:false;
		(new JetHtml(board)).attr('class','Board '+(vertical?"vertical":"horizontal"));
		//var boardArea=o.dialog.querySelector(".BoardArea"); //cell_float="right";
		var boardBody=o.dialog.querySelector(".BoardBody"); //cell_float="right";
		
		boardBody.style.height=size+"px";
		boardBody.style.width=size+"px";
		if(!vertical){
			mc.style.height=oc.style.height="calc("+size+"px - 2vh)";
			oc.style.width=oc.style.width="";
		}else{
			mc.style.height=oc.style.height="";
			oc.style.width=oc.style.width="calc("+size+"px - 2vh)";
		}
	}
};
Piece.pawnPath=function(o)
{
	var xnames=['a','b','c','d','e','f','g','h'];
	
	var b=Board.activeObject;
	var res=/([a-z])(\d)/.exec(o.place);
	var x=xnames.indexOf(res[1]); var y=parseInt(res[2]);
	var moves=[]; var attacks=[]; var ret=[]; var tmpAdrs=null; var fpiece=null;
	
	if(y<8){
		var step=1; var max=8;
		if(o.color===Black){
			step=-1; max=1;
		}
		var adrs=null;
		var nx=x; var ny=y+step; adrs=xnames[nx]+""+ny;//1 forward
		//attacks
		if(x<7){
			tmpAdrs=xnames[nx+1]+""+ny;
			if((fpiece=Board.getPieceOf(tmpAdrs))){
				if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode)){
					if(ny==max) ret.push(new Suggest(o,tmpAdrs,fpiece,Piece.convertCallback));
					else ret.push(new Suggest(o,tmpAdrs,fpiece));
				}
			}
		}
		if(x>0){
			tmpAdrs=xnames[nx-1]+""+ny;
			if((fpiece=Board.getPieceOf(tmpAdrs))){
				if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode)){//ret.push(new Suggest(o,tmpAdrs,fpiece));
					if(ny==max) ret.push(new Suggest(o,tmpAdrs,fpiece,Piece.convertCallback));
					else ret.push(new Suggest(o,tmpAdrs,fpiece));
				}
			}
		}
		
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode)){
				/*if(x<8){
					tmpAdrs=xnames[nx+1]+""+ny;
					if(!Board.getPieceOf(tmpAdrs)){
						ret.push(new Suggest(o,tmpAdrs,fpiece));
					}
				}
				if(x>1){
					tmpAdrs=xnames[nx-1]+""+ny;
					if(!Board.getPieceOf(tmpAdrs)){
						ret.push(new Suggest(o,tmpAdrs,fpiece));
					}
				}*/
			}
		}
		else{
			if(ny==max) ret.push(new Suggest(o,adrs,null,Piece.convertCallback));
			else ret.push(new Suggest(o,adrs));
			
			if(((y==2 && o.color==White) || (y==7 && o.color==Black)) && !o.moved){//if pawn is not moved yet
				ny+=step; 
				adrs=xnames[nx]+""+ny;
				if(!(fpiece=Board.getPieceOf(adrs)))ret.push(new Suggest(o,adrs));
			}
		}
		return ret;
	}
	return [];
};
Piece.rookPath=function(o)
{
	var xnames=['a','b','c','d','e','f','g','h'];
	
	var b=Board.activeObject;
	var res=/([a-z])(\d)/.exec(o.place);
	var x=xnames.indexOf(res[1]); var y=parseInt(res[2]);
	var moves=[]; var attacks=[]; var ret=[]; var tmpAdrs=null; var fpiece=null;
	
	for(var i=x+1;i<8;i++){
		adrs=xnames[i]+""+y;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	
	for(i=x-1;i>-1;i--){
		adrs=xnames[i]+""+y;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	
	for(var j=y+1;j<9;j++){
		adrs=xnames[x]+""+j;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	
	for(var j=y-1;j>0;j--){
		adrs=xnames[x]+""+j;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	return ret;
};
Piece.knightPath=function(o)
{
	var xnames=['a','b','c','d','e','f','g','h'];
	
	var b=Board.activeObject;
	var res=/([a-z])(\d)/.exec(o.place);
	var x=xnames.indexOf(res[1]); var y=parseInt(res[2]);
	var moves=[]; var attacks=[]; var ret=[]; var tmpAdrs=null; var fpiece=null;
	
	for(var i=1;i<3;i++){
		for(var j=1;j<3;j++){
			if(i!=j){
				if(x+i<8){
					if(y+j<9){
						adrs=xnames[x+i]+""+(y+j);
						fpiece=Board.getPieceOf(adrs);
						if(fpiece){
							if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));
						}else ret.push(new Suggest(o,adrs));
					}
					if(y-j>0){
						adrs=xnames[x+i]+""+(y-j);
						fpiece=Board.getPieceOf(adrs);
						if(fpiece){
							if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));
						}else ret.push(new Suggest(o,adrs));
					}
				}
				if(x-i>-1){
					if(y+j<9){
						adrs=xnames[x-i]+""+(y+j);
						fpiece=Board.getPieceOf(adrs);
						if(fpiece){
							if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));
						}else ret.push(new Suggest(o,adrs));
					}
					if(y-j>0){
						adrs=xnames[x-i]+""+(y-j);
						fpiece=Board.getPieceOf(adrs);
						if(fpiece){
							if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));
						}else ret.push(new Suggest(o,adrs));
					}
				}
				
			}
		}
	}
	return ret;
};
Piece.bishopPath=function(o)
{
	var xnames=['a','b','c','d','e','f','g','h'];
	
	var b=Board.activeObject;
	var res=/([a-z])(\d)/.exec(o.place);
	var x=xnames.indexOf(res[1]); var y=parseInt(res[2]);
	var moves=[]; var attacks=[]; var ret=[]; var tmpAdrs=null; var fpiece=null;
	
	for(i=x+1,j=y+1;i<8 && j<9;i++,j++){
		adrs=xnames[i]+""+j;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	
	for(i=x-1,j=y+1;i>-1 && j<9;i--,j++){
		adrs=xnames[i]+""+j;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	
	for(i=x+1,j=y-1;i<8 && j>0;i++,j--){
		adrs=xnames[i]+""+j;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	
	for(i=x-1,j=y-1;i>-1 && j>0;i--,j--){
		adrs=xnames[i]+""+j;
		fpiece=Board.getPieceOf(adrs);
		if(fpiece){
			if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
			break;
		}else ret.push(new Suggest(o,adrs)); //move
	}
	return ret;
};
Piece.queenPath=function(o)
{
	return Piece.rookPath(o).concat(Piece.bishopPath(o));
};
Piece.kingPath=function(o)
{
	var xnames=['a','b','c','d','e','f','g','h'];
	
	var b=Board.activeObject;
	var res=/([a-z])(\d)/.exec(o.place);
	var x=xnames.indexOf(res[1]); var y=parseInt(res[2]);
	var moves=[]; var attacks=[]; var ret=[]; var tmpAdrs=null; var fpiece=null;
	
	for(var i=x-1;i<x+2;i++){
		for(var j=y-1;j<y+2;j++){
			if(i>-1 && i<8 && j>0 && j<9){
				if(x==i && y==j)continue;
				adrs=xnames[i]+""+j;
				fpiece=Board.getPieceOf(adrs);
				if(fpiece){
					if(fpiece.color!=o.color && (fpiece.type!=King || Piece.checkMode))ret.push(new Suggest(o,adrs,fpiece));//attack
					continue;
				}else ret.push(new Suggest(o,adrs)); //move
			}
		}
	}
	if(!o.moved){
		ret=ret.concat(Piece.castleMoveOf(o));
	}
	return ret;
};
Piece.kill=function(o)
{
	//calculate score
	o.place=null;//remove the piece from list of checkings
	var cls="OpponentCemetry";
	if(Board.activeObject.clientColor==White){
		if(o.color==White)cls="MyCemetry";
	}else if(o.color==Black){
		cls="MyCemetry";
	}
	var cemetery=Board.activeObject.dialog.querySelector("."+cls);
	cemetery.appendChild(o.dialog);
};
Piece.hideSuggests=function()
{
	var sg=Piece.currentSuggests; var s=null; var cell=null;
	if(sg)for(var i=0;i<sg.length;i++){
		s=sg[i]; cell=Board.activeObject.cells[s.place];
		if(s.target){
			s.target.dialog.removeAttribute("danger");
			cell.removeAttribute("way");
		}else{
			cell.removeAttribute("way");
		}
	}
};
Piece.getSafeMovesFor=function(moves,p)
{
	var ret=[]; var piece=null; var currentPosition=null; var res=null; var opponentPosition=null;
	for(var i=0;i<moves.length;i++){
		piece=moves[i].piece;
		currentPosition=piece.place;//backup for current position
		opponentPosition=null; //clear backup area for new attack place
		piece.place=moves[i].place; //change the place to test
		if(moves[i].target){
			opponentPosition=moves[i].target.place;
			moves[i].target.place=null; //skip check the danger of the piece
		}
		res=Piece.inDanger(p);
		if(res.length===0)ret.push(moves[i]);
		piece.place=currentPosition;//restore the position of the piece
		if(opponentPosition && moves[i].target)moves[i].target.place=opponentPosition; //reset the place of the opponent piece
	}
	return ret;
};
Piece.isChecked=function()
{
	var whiteKing=Board.getPiecesWith(White,King)[0];
	var res=Piece.inDanger(whiteKing);
	if(res.length>0){
		whiteKing.dialog.setAttribute("danger",'1');
		Board.activeObject.checked=White;
		return;
	}else{
		whiteKing.dialog.removeAttribute("danger");
		
		//now check black king
		var blackKing=Board.getPiecesWith(Black,King)[0];
		var res=Piece.inDanger(blackKing);
		if(res.length>0){
			blackKing.dialog.setAttribute("danger",'1');
			Board.activeObject.checked=Black;
			return;
		}else{
			blackKing.dialog.removeAttribute("danger");
		}
	}
	Board.activeObject.checked=null;
};
Piece.isMate=function(color)
{
	var b=Board.activeObject;
	var checked=Board.activeObject.checked;
	var king=Board.getPiecesWith(color,King)[0];
	for(var i=0;i<b.pieces.length;i++){
		if(b.pieces[i].color==color && b.pieces[i].place){
			var sg=Piece.pathFuncs[b.pieces[i].type](b.pieces[i]);
			if(checked===color){
				sg=Piece.getSafeMovesFor(sg,king);
				if(sg.length>0)return;
			}else{
				if(sg.length>0)return;
			}
		}
	}
	if(checked!==null)Board.activeObject.setWin(color==White?Black:White);
	else Board.activeObject.setWin(null);
};
Piece.castleMoveOf=function(o)
{
	ret=[];
	if(!o.moved){
		if(o.color==White){
			var r1way=['f1','g1']; var r1place='h1'; var k1way='g1';
			var r2way=['b1','c1','d1']; var r2place='a1'; var k2way='c1';
		}else{//black
			var r1way=['f8','g8']; var r1place='h8'; var k1way='g8';
			var r2way=['b8','c8','d8']; var r2place='a8'; var k2way='c8';
		}
		var king=null; var rook1=null; var rook2=null;
		if(o.type==King){
			king=o;
			var rook1=Board.getPieceOf(r1place);
			var rook2=Board.getPieceOf(r2place);
			if(rook1){
				if(!rook1.moved){
					var way1free=true;
					for(var i=0;i<r1way.length;i++){
						if(Board.getPieceOf(r1way[i])){
							way1free=false;
							break;
						}
					}
					if(way1free){
						ret.push(new Suggest(o,k1way,rook1,Piece.castleCallback));
					}
				}
			}
			if(rook2){
				if(!rook2.moved){
					var way2free=true;
					for(var i=0;i<r2way.length;i++){
						if(Board.getPieceOf(r2way[i])){
							way2free=false;
							break;
						}
					}
					if(way2free){
						ret.push(new Suggest(o,k2way,rook2,Piece.castleCallback));
					}
				}
			}
		}else if(o.type==Rook){
			
		}
	}
	return ret;
};
Piece.castleCallback=function(suggest)
{
	if(suggest.piece.color==White){
		var r1way='f1'; var r1place='h1'; var k1place='g1';
		var r2way='d1'; var r2place='a1'; var k2place='c1';
	}else{//black
		var r1way='f8'; var r1place='h8'; var k1place='g8';
		var r2way='d8'; var r2place='a8'; var k2place='c8';
	}
	if(suggest.place==k1place){
		var rook=suggest.target;
		old_rp=rook.place;
		var cell=Board.activeObject.cells[old_rp];
		var new_cell=Board.activeObject.cells[r1way];
		cell.removeChild(rook.dialog);
		rook.place=r1way;
		new_cell.appendChild(rook.dialog);
	}else{
		var rook=suggest.target;
		old_rp=rook.place;
		var cell=Board.activeObject.cells[old_rp];
		var new_cell=Board.activeObject.cells[r2way];
		cell.removeChild(rook.dialog);
		rook.place=r2way;
		new_cell.appendChild(rook.dialog);
	}
	return false;
	
};
Piece.convertCallback=function(suggest)
{
	Piece.activePawn=suggest.piece;
	var new_pieces=[
		new Piece(Rook,suggest.piece.color,null),
		new Piece(Knight,suggest.piece.color,null),
		new Piece(Bishop,suggest.piece.color,null),
		new Piece(Queen,suggest.piece.color,null)
	];
	_("#piecesPan").source.innerHTML="";
	_("#piecesSelector").attr("status","open");
	for(var i=0;i<new_pieces.length;i++){
		Piece.buildForm(new_pieces[i],2,_("#piecesPan").source);
	}
	return false;
};
Piece.onConvert=function(piece)
{
	if(Piece.activePawn){
		_("#piecesSelector").attr("status","close");
		var pawn=Piece.activePawn;
		Piece.activePawn=null;
		pawn.dialog.parentElement.removeChild(pawn.dialog);
		pawn.type=piece.type;
		Piece.buildForm(pawn,1,Board.activeObject.cells[pawn.place]);
		return piece.type;
	}
	return null;
};
Piece.buildForm=function(o,view,par)
{
	var p=document.createElement('div');
	p.lObj=o;
	o.dialog=p;
	Piece.bind(o,p,view);
	
	if(view==1){
		if(Piece.dragEnabled){
			p.setAttribute("onmousedown","Piece.onMouseDown(event);");
			p.setAttribute("onmouseup","Piece.onMouseUp(event);");
		}
		p.setAttribute("onclick","Piece.onClick(event);");
	}else if(view==2){
		p.setAttribute("onclick","Piece.onConvert(event.target.lObj);");
	}
	
	if(par){
		par.appendChild(p);
		if(view==1 && Piece.dragEnabled)jetXtra.moveable(p);
	}
};
Piece.bind=function(o,ctrl,view)
{
	ctrl.setAttribute("color",o.color===White?"white":"black");
	ctrl.setAttribute("type",o.type);
	ctrl.setAttribute("class","Piece");
};
Piece.moveStart=function(e)
{
	var ctrl=e.target;
	var o=ctrl.lObj;
	var fn=Piece.pathFuncs[o.type];
	var sgs=fn(o);
	var king=Board.getPiecesWith(o.color,King)[0];
	Piece.currentSuggests=Piece.getSafeMovesFor(sgs,king);
	Piece.showSuggests();
	var cls=ctrl.getAttribute('class');
	ctrl.setAttribute('class',cls+" moving");
	//console.log(e);
};
Piece.moveEnd=function(e)
{
	var ctrl=e.target;
	var o=ctrl.lObj;
	ctrl.setAttribute('class',"Piece");
	ctrl.style.left=""; ctrl.style.top="";
	Piece.hideSuggests();
	
	if(Board.activeObject.turn==o.color){
	var oldParent=ctrl.parentElement;
	var newParent=Board.getCell(e,Board.activeObject);
	var adrs=newParent.getAttribute("title");
	
	if(!Piece.validateMove(adrs)){
		console.log('invalid move.');
		return;
	}
	if(oldParent!=newParent){
		if(newParent.childNodes.length>0){
			var fpiece=Board.getPieceOf(adrs);
			if(fpiece){
				if(fpiece.color!=o.color && fpiece.type!=King){
					Piece.kill(fpiece);
					newParent.innerHTML="";
				}else{
					console.log("invalid move.");
					return;//discard move
				}
			}
		}
		o.moved=true;
		oldParent.removeChild(ctrl);
		newParent.appendChild(ctrl);
		o.place=newParent.getAttribute('title');
		Board.activeObject.turn= o.color==White?Black:White;
		Piece.isChecked(); //check any king is in check
		Piece.isMate(Board.activeObject.turn); //check mate
	}
	//console.log(e);
	}else{
		console.log("It's not your turn.");
	}
};
Piece.config=function()
{
	Piece.pathFuncs={};
	Piece.pathFuncs[Pawn]=Piece.pawnPath;
	Piece.pathFuncs[Rook]=Piece.rookPath;
	Piece.pathFuncs[Knight]=Piece.knightPath;
	Piece.pathFuncs[Bishop]=Piece.bishopPath;
	Piece.pathFuncs[Queen]=Piece.queenPath;
	Piece.pathFuncs[King]=Piece.kingPath;
};
Piece.onClick=function(e)
{
	if(!Board.activeObject.locked){
		var ctrl=e.target;
		var o=ctrl.lObj;
		
		if(o.color==Board.activeObject.turn){
			Piece.activeObject=o;
			Piece.hideSuggests();
			var fn=Piece.pathFuncs[o.type];
			var sgs=fn(o);
			var king=Board.getPiecesWith(o.color,King)[0];
			Piece.currentSuggests=Piece.getSafeMovesFor(sgs,king);
			Piece.showSuggests();
			ctrl.setAttribute('class',"Piece solidMoving");
			//console.log(e);
			
			
			e.cancelBubble=true;
			e.stopPropagation();
		}
	}
};
Piece.onMouseDown=function(e)
{
	if(!Board.activeObject.locked){
		var ctrl=e.target;
		var o=ctrl.lObj;
		if(o.color==Board.activeObject.turn){
			Piece.mouseDownTime=Date.now();
			Piece.hideSuggests();
			var fn=Piece.pathFuncs[o.type];
			var sgs=fn(o);
			var king=Board.getPiecesWith(o.color,King)[0];
			Piece.currentSuggests=Piece.getSafeMovesFor(sgs,king);
			Piece.showSuggests();
			ctrl.setAttribute('class',"Piece moving");
			//console.log(e);
			
			e.cancelBubble=true;
			e.stopPropagation();
		}
	}
};
Piece.onMouseUp=function(e)
{
	var ctrl=e.target;
	var o=ctrl.lObj;
	if(o.color==Board.activeObject.turn){
		if(Date.now()>Piece.mouseDownTime+Piece.clickBound){
			ctrl.setAttribute('class',"Piece");
			ctrl.style.left=""; ctrl.style.top="";
			
			if(Board.activeObject.turn==o.color){
			var oldParent=ctrl.parentElement;
			var newParent=Board.getCell(e,Board.activeObject);
			var adrs=newParent.getAttribute("title");
			
			if(!Piece.validateMove(adrs)){
				console.log('invalid move.'); Piece.hideSuggests();
				return;
			}
			if(oldParent!=newParent){
				var move_option=0;
				var add_history_here=true;
				if(newParent.childNodes.length>0){
					var fpiece=Board.getPieceOf(adrs);
					if(fpiece){
						if(fpiece.color!=o.color && fpiece.type!=King){
							Piece.kill(fpiece);
							newParent.innerHTML="";
							move_option|=1;
						}else{
							console.log("invalid move."); Piece.hideSuggests();
							return;//discard move
						}
					}
				}
				var wayType=newParent.getAttribute("way");
				if(wayType==3){
					var sg=Piece.currentSuggests; var s=null; for(var i=0;i<sg.length;i++){if(adrs==sg[i].place){s=sg[i]; break;}}
					if(s && s.callback)add_history_here=s.callback(s);//only has result on pawn conversion
				}
				
				if(add_history_here){
					var movement=new ChMove(o,adrs,parseInt(Date.now()/1000),move_conv);
					Board.activeObject.history.push(movement);
				}
				
				o.moved=true;
				oldParent.removeChild(ctrl);
				newParent.appendChild(ctrl);
				o.place=newParent.getAttribute('title');
				Board.activeObject.turn= o.color==White?Black:White;
				Piece.isChecked(); //check any king is in check
				Piece.isMate(Board.activeObject.turn); //check mate
				Chess.onTurnChanged();//update server
			}
			//console.log(e);
			}else{
				console.log("It's not your turn.");
			}
		}
		e.cancelBubble=true;
		e.stopPropagation();
		Piece.hideSuggests();
	}
};
Piece.toString=function(o)
{
	if(o instanceof Array){
		var ret=[];
		for(var i=0;i<o.length;i++)ret.push(Piece.toString(o[i]));
		return ret.join('-');
	}else return o.id+','+o.type+','+o.color+','+o.place;
};
Piece.parse=function(arg)
{
	var pat=/(\d+),(\d),(\d),([a-z\d]+)/g;
	var ret=[];
	while((r=pat.exec(arg))){
		ret.push(new Piece(parseInt(r[2]),parseInt(r[3]),(r[4]=="null"?null:r[4]),0,parseInt(r[1])));
	}
	return ret;
};
function League()
{
	
	this.id=null;
	this.title=null;
	this.type=null;
	this.matchTime=null;
	this.matches=null;
};



League.allowIn=false;

function Match(whitePlayer,blackPlayer,board,result,id)
{
	
	this.id=null;
	this.whitePlayer=null;
	this.blackPlayer=null;
	this.board=null;
	this.result=null;
this.whitePlayer=whitePlayer; this.blackPlayer=blackPlayer; this.board=board; this.result=result; this.id=id?id:0;
};




Match.save=function(o)
{
	var n=new NetData();
	n.url="client/Match/save/";
	n.callback=LU.globalCallback?LU.globalCallback:null;
	n.onerror=null;
	n.add("o",JSON.stringify(o),true).
	commit();
};
function Suggest(piece,place,target,callback)
{
	
	this.piece=null;
	this.place=null;
	this.target=null;
	this.callback=null;
this.piece=piece; this.place=place; this.target=target; this.callback=callback;
};



function Chess()
{
};



Chess.title='Chess';
Chess.activeCMessage=null;
Chess.currentUID=null;
Chess.loaded=false;
Chess.resources=null;
Chess.loadResourceCallback=null;
Chess.loadResourceIndex=0;


Chess.create=function()
{
	var b=new Board();
	b.clientColor=parseInt(Math.random()*2);
	return Board.toString(b);
};
Chess.openByCuad=function(msg,par)
{
	if(msg){
		Chess.activeCMessage=msg;
	}else{
		if(Chess.activeCMessage){
			msg=Chess.activeCMessage;
		}
	}
	
	if(Chess.loaded){
		if(msg){
			par.innerHTML="";
			var b=Board.parse(msg.value);
			if(msg.sender==Chess.currentUID){
				b.flyColor= b.clientColor==White?White:Black;
			}else{
				b.flyColor= b.clientColor==White?Black:White;
			}
			Board.activeObject=b;
			Board.buildForm(b,1,par);
			Piece.isChecked();
			Piece.isMate(White); Piece.isMate(Black);
			Chess.checkTurn();
		}else console.log("Message is not available");
	}else{
		Chess.loadResourceCallback=Chess.openByCuad;
		Chess.loadResources();
	}
};
Chess.reloadByCuad=function(msg,par)
{
	if(Chess.activeCMessage){
		if(Chess.activeCMessage.id==msg.id){
			Chess.activeCMessage=msg;
			var msg_board=Board.parse(msg.value);
			var pieces=msg_board.pieces;
			var board=Board.activeObject;
			board.turn=msg_board.turn;
			board.pieces=pieces;
			var adrses=Object.keys(board.cells);
			for(var i=0;i<adrses.length;i++)board.cells[adrses[i]].innerHTML="";
			var myCemetery=board.dialog.querySelector(".MyCemetry"); myCemetery.innerHTML="";
			var opCemetery=board.dialog.querySelector(".OpponentCemetry"); opCemetery.innerHTML="";
			for(var k=0;k<pieces.length;k++){
				if(pieces[k].place)Piece.buildForm(pieces[k],1,Board.activeObject.cells[pieces[k].place]);
				else{ Piece.buildForm(pieces[k],1); Piece.kill(pieces[k]); }
				//Piece.moveTo(o.pieces[k],o.pieces[k].place);
			}
			Piece.isChecked();
			Piece.isMate(White); Piece.isMate(Black);
			Chess.checkTurn();
			return;
		}
	}
	Chess.openByCuad(msg,par);
};
Chess.onTurnChanged=function()
{
	if(Chess.activeCMessage && typeof(Messenger)!="undefined"){
		var msg=Chess.activeCMessage;
		msg.value=Board.toString(Board.activeObject);
		Messenger.onEditAppData(msg);
		Chess.checkTurn();
	}
};
Chess.loadResources=function(path)
{
	if(!Chess.resources){
		if(!path)path="";
		Chess.resources=[
			{type:"css",url:path+"res/style/defaultTheme-dynamic.css"},
			{type:"js",url:path+"res/meta/const.js"}
			];
		Chess.loadResourceIndex=0;
		Chess.loadResources();
	}else{
		var res=Chess.resources[Chess.loadResourceIndex];
		if(res){
			Chess.loadResourceIndex++;
			Jet.loadResource(res.url,res.type,Chess.loadResources);
		}else{
			Chess.loaded=true;
			 Board.config(); Piece.config();
			if(Chess.loadResourceCallback)Chess.loadResourceCallback();
			Chess.loadResourceCallback=null;//reset the flag
		}
	}
};
Chess.checkTurn=function()
{
	var msg=Chess.activeCMessage;
	var b=Board.activeObject;
	if(msg.sender==Chess.currentUID){
		if(b.clientColor==b.turn){
			b.locked=false;//turn for the user
		}else{
			b.locked=true;//turn for opponenet
		}
	}else{
		if(b.clientColor==b.turn){
			b.locked=true;//turn for opponenet
		}else{
			b.locked=false;//turn for the user
		}
	}
};
function ChMove(piece,place,time,option)
{
	
	this.piece=null;
	this.place=null;
	this.time=null;
	this.option=null;
this.piece=piece; this.place=place; this.time=parseInt(Date.now()/1000); this.option=option?option:0;
};



function GProfile(uid,nikname,country,code)
{
	
	this.uid=null;
	this.nikname=null;
	this.country=null;
	this.code=null;
	this.rates=null;
this.uid=uid; this.nikname=nikname; this.country=country; this.code=code;
};



GProfile.table='gprofile';
GProfile.activeObject=null;


GProfile.save=function(o)
{
	var n=new NetData();
	n.url="client/GProfile/save/";
	n.callback=LU.globalCallback?LU.globalCallback:null;
	LU.globalCallback=null;
	n.onerror=null;
	n.add("o",JSON.stringify(o),true).
	commit();
};
GProfile.read=function(uid)
{
	var n=new NetData();
	n.url="client/GProfile/read/";
	n.callback=LU.globalCallback?LU.globalCallback:null;
	LU.globalCallback=null;
	n.onerror=null;
	n.commit();
};
GProfile.config=function()
{
	Jet.App.register('GProfile',GProfile);
	Jet.App.form.GProfile={};
	Jet.App.form.GProfile[1]="<table class=\"infobox\"><tr><td>%nikname%</td><td><input id=\"niknameTxb\" type=\"text\" value=\"%nikname%\"/></td></tr><tr><td>%country%</td><td><select id=\"countryCmb\"></select></td></tr><tr><td>%national_code%</td><td><input id=\"codeTxb\" type=\"text\" value=\"%code%\"/></td></tr><tr><td></td><td><button class=\"green btn\" onclick=\"GProfile.onSave()\">%save-lbl%</button></td></tr></table>";
	Jet.App.form.GProfile[2]="<span><img src=\"res/image/jpg/countryFlag/%country%.jpg\"/>&nbsp; <b>%nikname%</b></span>";
	
	Jet.App.form.GProfile.userOperation="";
	Jet.App.form.GProfile.ownerOperation=Jet.App.form.GProfile.userOperation+
	"";
};
GProfile.buildForm=function(o,view,par)
{
	return Jet.App.buildForm(o,view,par,"GProfile");
	
};
GProfile.bind=function(o,ctrl,view)
{
	if(view==1){
		var countryCmb=document.getElementById("countryCmb");
		countryCmb.innerHTML="";
		for(var i=0;i<countries.length;i++){
			var opt=document.createElement('option');
			opt.setAttribute("value",i);
			opt.innerHTML=countries[i].name;
			countryCmb.appendChild(opt);
		}
	}
};
GProfile.onShow=function(res)
{
	if(res && res!="no call"){
		
		if((GProfile.activeObject=JSON.parse(res))){
			GProfile.onShow("no call"); //recall to show the activeObject, avoid the looping of read-onShow
		}
	}else{
		if(GProfile.activeObject){
			Libre.work.clear();
			Libre.show(GProfile.buildForm(GProfile.activeObject,1,null));
		}else if(res!="no call"){ //avoid to loop the function
			LU.globalCallback=GProfile.onShow;
			GProfile.read();
		}
	}
};
GProfile.onSave=function()
{
	var o=GProfile.activeObject;
	o.nikname=_("#niknameTxb").value();
	o.country=_("#countryCmb").value();
	o.code=_("#codeTxb").value();
	
	GProfile.save(o);
};
function MatchRequest(game,from,to,time,option,id)
{
	
	this.id=null;
	this.from=null;
	this.to=null;
	this.time=null;
	this.option=null;
	this.game=null;
this.game=game; this.id=id?id:null; this.from=from?from:null; this.to=to?to:null; this.time=time?time:null; this.option=option?option:null;
};



MatchRequest.table='mrequest';

function GameRate(game,uid,rate)
{
	
	this.game=null;
	this.uid=null;
	this.rate=null;
this.game=game?game:null; this.uid=uid?uid:null; this.rate=rate?rate:null;
};



GameRate.table='grate';

function LU()
{
};



LU.globalCallback=null;

