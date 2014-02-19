console.log( "------------------------" );
console.log( "Hello!" );


var line = "------------------------";

function shadowPainter() {
  var doc = document;
  
  var classNames = {
    wrapper: ".l-wrapper",
    paintBox: ".b-box--paint",
    resultBox: ".b-box--result",
    resultDot: ".b-box--result .dot",
    palette: ".b-palette",
    steps: ".b-steps",

    codes: ".b-codes",
    codesToggle: ".b-codes__toggle",
    codesCss: ".textarea--css",
    codesHtml: ".textarea--html",
    
    durationInp: ".text--duration",
    sizeInp: ".text--size",
    dotsInp: ".text--dots"
  };

  var Elems = {};

  var Cell = {
    className: "cell",
    inputType: "checkbox",
    inputClass: "cell__inp",
    inputData: "data-hpos=\"{hpos}\"  data-vpos=\"{vpos}\" ",
    labelContent: "",
    dots: "<span class=\"dot dot--previous\"></span><span class=\"dot\"></span>"
  };

  var Color = {
    className: "color",
    inputType: "radio",
    inputClass: "color__inp",
    inputData: "data-color=\"{color}\" ",
    labelContent: "",
    
    list: ["#3FB8AF","#7FC7AF","#DAD8A7","#FF9E9D","#FF3D7F"],
    transparent: "rgba(255,255,255,0)",
    currentNum: 0,
  };
  Color.current = Color.list[0];
  Color.classCurrent = Color.className + "--" + Color.currentNum;
  Color.StyleTempl = "." + Color.className + "--{i} {background: {color};}\n";

  
  var Step = {
    className: "step",
    inputType: "radio",
    inputClass: "step__inp",
    inputData: "",
    labelContent: "{i+1}",
    controlClass: "steps-control",
    currentNum: 0
  };

  var templatesConfig = [Cell, Color, Step];

  var stylesClassNames = {
    config: "configBox",
    shadows: "stylesBox",
    colors: "colorsBox"
  };
  var Styles = {}

  var Output = {
    HtML: "",
    Css: "",
    Animation: "",
    comment: "Created in shadowPainter : )"
  };
  

  var Scene = {
     oneSide: 10,// dottes in line
     oneSideMax: 30,// dottes in line
     size: 250,
     dotSize: 30,// pixels
     padding: 20,// pixels. Don't change it
     border: 1// pixels
  };

  var Anim = {
    steps: 8,
    duration: "1s",
    name: "shadows"
  };

  var is_opened = false;// codes 
  var classIsRunning = "is-running";
  
  var Frames = {};
  var currentFrame = 0;
  
  

  this.init = function(){
    

    this.createTemplates();
    this.createStylesBoxes();

    this.initElements();
    this.addConfig();
    this.createInputsSet();
    this.createFramesSet();
    this.createPalette();
    this.createSteps();
    this.createCodes();
    this.createDurationInp();
    this.createSizeInp();
    this.createDotsInp();

  }
  
  // FUNCTIONS
  // -----------------------------------------
  
  
  function findKeyFrames(name){
    var sheets = doc.styleSheets[1].cssRules;
    var keyFrames;
    for (var i = 0; i < doc.styleSheets.length; i++) {
      var stylesList = doc.styleSheets[i].cssRules;

      for (var k = 0; k < stylesList.length; k++) {
        if ( stylesList[k].name == name ){
          keyFrames = stylesList[k];
        }
      };
    };

    return keyFrames;
  }

  // -----------------------------------------

  function getAnimStr() {
    return Anim.duration + " " + Anim.name + " linear infinite"
  }

  // -----------------------------------------

  this.initElements = function() {

    for ( var className in classNames ){
      Elems[className] = doc.querySelector(classNames[className]);
    }

  }

  // -----------------------------------------

  this.setParams = function() {

    Scene.dotSize = (Scene.size/Scene.oneSide);

    Scene.dotSize = Scene.dotSize.toFixed() 
    Scene.size = Scene.dotSize * Scene.oneSide;

    this.configElemParams = {
      ".l-wrapper": {
        "width": 660, //size * 2 + Scene.padding * 3 + border*6
        "height": 490, //size + Scene.padding * 2 + border*4
      },
      ".b-boxes": {
        "height": 340
      },
      ".l-zero-gravity": {
        "height": Scene.size + Scene.border
      },
      ".b-box": {
        "width": Scene.size + Scene.border,
        "height": Scene.size
      },
      ".cell__lbl": {
        "width": Scene.dotSize,
        "height": Scene.dotSize
      },
      ".dot": {
        "width": Scene.dotSize,
        "height": Scene.dotSize,
        "top": "-" + Scene.dotSize,
        "left": "-" + Scene.dotSize
      },
      ".is-running": {
        "-webkit-animation": getAnimStr(),
        "animation": getAnimStr()
      },
      ".b-box--paint": {
        "background-size": Scene.dotSize + " " + Scene.dotSize
      }
    };
  }

  // -----------------------------------------

  this.setOutputParams = function () {
    this.outputElemParams = {
      ".box": {
        "position": "absolute",
        "top": "0",
        "bottom": "0",
        "left": "0",
        "right": "0",
        "margin": "auto",
        "width": Scene.size,
        "height": Scene.size,
        "overflow": "hidden",
        "border": "1px solid #DDD"
      },
      ".dot": {
        "display": "block",
        "position": "absolute",
        "width": Scene.dotSize,
        "height": Scene.dotSize,
        "top": "-" + Scene.dotSize,
        "left": "-" + Scene.dotSize,
        "-webkit-animation": getAnimStr(),
        "animation": getAnimStr()
      }
    };
    
  }

  // -----------------------------------------

  this.addConfig = function(){

    this.setParams();

    var styles = "";
    for ( var elem in this.configElemParams ){
      var className = elem;
      var elemStyles = "";
      var params = this.configElemParams[elem];
      for (var item in params){
        var value = addUnits( params[item], item );
        elemStyles += item + ": " + value + ";\n";
      }
      styles += className + " {\n" + elemStyles + "}\n";
    }

    Styles.config.innerHTML = styles;
  }


  // -----------------------------------------
  
  function addStylesBox(elemClass){
    var elem = doc.createElement( "style" );  
    elem.classList.add( elemClass );
    var head = doc.querySelector( "head" );
    head.appendChild( elem );
    return elem;
  }

  // -----------------------------------------
  this.createStylesBoxes = function () {
     for ( var styleBox in stylesClassNames ){
        Styles[styleBox] = addStylesBox(stylesClassNames[styleBox]); 
     }
  }

  // -----------------------------------------

  this.createTemplates = function(){
    
    for (var i = 0; i < templatesConfig.length; i++) {

      item = templatesConfig[i];
      item.template = createTemplate ( item );

    }
  }

  // -----------------------------------------
  
  function createTemplate ( item ){

    var itemType = item.className;
    var inputType = item.inputType;
    var data_attr = item.inputData;
    var lblContent = item.labelContent

    var itemInpClass = itemType + "__inp";
    var itemLblClass = itemType + "__lbl";

    var replacements = {
      "{inputType}": inputType,
      "{itemType}": itemType,
      "{itemClass}": itemType,
      "{itemLblClass}": itemLblClass,
      "{itemInpClass}": itemInpClass,
      "{lblContent}": lblContent
    };

    var itemInputTempl = "<input type='{inputType}' id='{itemType}-{i}' class='" + itemInpClass +"' name='{itemType}' data-{itemType}-num='{i}' " + data_attr + ">";//
    var itemLabelTempl = "<label for='{itemType}-{i}' class='{itemLblClass} {itemType}--{i}'>{lblContent}</label>";
    var itemTempl = "<li class='{itemType}'>" + itemInputTempl + itemLabelTempl  +"</li>";

    var result = fillTemplate( itemTempl, replacements );

    return result;
  }

  // -----------------------------------------

  this.addDataDefautlt = function( elem, defaultValue){
    var defData = elem.getAttribute("data-default");
    if ( defData == null ){
      elem.setAttribute("data-default", defaultValue);
    }
  }

  // -----------------------------------------
  
  this.addEvents = function ( itemsClass, func ){

    itemsClass = checkDot ( itemsClass );
    var items = doc.querySelectorAll(itemsClass);
    var parent = this;
    
    for (var i = 0; i < items.length; i++) {
      items[i].onclick = function() {
        func.call(parent, this);
      }
    } 
  }

  // -----------------------------------------
  
  this.addOnChangeEvents = function ( itemsClass, func ){
    var items = doc.querySelectorAll(itemsClass);
    var parent = this;
    
    for (var i = 0; i < items.length; i++) {
      
      // items[i].onkeydown = function() {
      //   out("-- E: onkeydown-- ");
      //   setTimeout('out("прошла секунда")', 1000);

      //   out("Before IfNan: " + this.value);
      //   this.value = valueSetDefaultIfNAN(this);
      //   out("After: " + this.value);
        
      //   if ( event.keyCode == 38
      //     || event.keyCode == 40 ){
            
      //       //this.value = getValByKeyCode(this, event.keyCode, event.shiftKey);
      //       func.call(parent, this);
      //     }
      //   // else {
      //   //   out("-- Other keys --");
      //   //   //this.value = minMaxDef(this);
      //   //   out (this.value);
      //   //   func.call(parent, this);
      //   // }
      // }

      items[i].onchange = function() {
        out("-- E: onchange --");
        out("before: " + this.value);
        this.value = valueSetDefaultIfNAN(this);
        this.value = minMaxDef(this);
        out("after: " + this.value);
        func.call(parent, this);
      }
      items[i].onkeyup = function() {
        out("-- E: onkeyup-- ");
        
      }
      items[i].onblur = function() {
        out("-- E: blur --");
        this.value = valueSetDefaultIfNAN(this);
        this.value = minMaxDef(this);
        func.call(parent, this);
      }
    } 
  }

  
  // -----------------------------------------
  
  this.createInputsSet = function() {
    Elems.paintBox.innerHTML = Cell.dots;
    var output = "";

    for (var i = 0; i < Scene.oneSide * Scene.oneSide; i++) {
      var hpos = i % Scene.oneSide + 1;
      var vpos = Math.floor(i / Scene.oneSide) + 1;

      var replacements = {
        "{i}": i,
        "{hpos}": hpos,
        "{vpos}": vpos
      };
      var checkBox = fillTemplate( Cell.template, replacements );
      output += checkBox;
    }  
    Elems.paintBox.innerHTML += "<ul class=\"items items--dots\">" + output + "</ul>";
    this.addEvents( Cell.inputClass, this.onClickCell);
  }

  // -----------------------------------------
  
  this.createFramesSet = function() {
    
    for (var k = 0; k < Anim.steps; k++) {
      Frames[k] = { active: 0 };

      for (var hpos = 0; hpos < Scene.oneSideMax; hpos++) { // verticals
        Frames[k][hpos] = {};

        for (var vpos = 0; vpos < Scene.oneSideMax; vpos++) { // gorizontals
          //var hpos = i % Scene.oneSide + 1;
          //var vpos = Math.floor(i / Scene.oneSide) + 1;

          Frames[k][hpos][vpos] = {
            "hpos": hpos,
            "vpos": vpos,
            "color": Color.transparent
          };        
        }  // End gorizontals
      } // End verticals

    };

  }
  
  // -----------------------------------------
  
  this.onClickCell = function( elem ) {
    
    if( elem !== undefined ){
     var cellLbl = elem.nextSibling;
     this.updateFrames( elem );
    }
  }

  // -----------------------------------------
  
  this.toggleColorClass = function( elem ) {
   var findClass = Color.className + "--";
   var classes = elem.classList; 
    for (var i = 0; i < classes.length; i++) {
     
     if(classes[i].indexOf(findClass) >= 0 ){
       classes.remove(classes[i]);
       return;  
     }
    }
   classes.add(findClass + Color.currentNum);
  }

  // -----------------------------------------
  
  this.updateFrames = function( elem ) {

    var hpos = elem.getAttribute("data-hpos");
    var vpos = elem.getAttribute("data-vpos");

    var place = Frames[currentFrame];
    var color = Color.transparent;
    
    if ( elem.checked ){
      color = Color.current;
      place.active++;
      }
    else {
      place.active--;
    }  
    
    place[hpos][vpos].color = color;
    this.paintShadow();
   }

  // -----------------------------------------
  
  this.paintShadow = function(){
    
    var styles = "";
    var animName = "shadows";
    var animFrames = {};
    
    var framesLength = objLength(Frames);
    var perc = (100 / framesLength).toFixed(3);

    var dottes = Frames[currentFrame];
    var shadows = this.createShadow( dottes ); 
    
    styles = ".b-box--paint .dot {\n " + shadows + " \n}\n";
    
    dottes = Frames[0];
    shadows = this.createShadow( dottes ); 
    styles += classNames.resultDot + " {\n " + shadows + " -webkit-animation-duration: " + Anim.duration + "; \nanimation-duration: " + Anim.duration + ";\n}\n";

    if ( currentFrame > 0 ){
    
      dottes = Frames[currentFrame - 1];
      shadows = this.createShadow( dottes ); 
      styles += ".b-box--paint .dot--previous {\n " + shadows + " \n}\n";
    }
    
    Styles.shadows.innerHTML = styles;

    this.replaceAnimation({perc: perc});

    this.updateSteps();
  }

  // -----------------------------------------

  this.createShadow = function( dottes, is_value ){

    if ( dottes == undefined ){
      return;
    }

    var shadows = "";
    var if_first = true;
    
    //var cellsMax = Scene.oneSide * Scene.oneSide;

    for (var hpos = 0; hpos < Scene.oneSide + 1; hpos++) {
      for (var vpos = 0; vpos < Scene.oneSide + 1; vpos++) {
      
        var dot = dottes[hpos][vpos];
        
        var hpos_px = dot.hpos * Scene.dotSize + "px";
        var vpos_px = dot.vpos * Scene.dotSize + "px";
        var color = Color.transparent;


        if ( dot.color != Color.transparent ) {
          color = dot.color;
        }
        
        if ( if_first ){
          if_first = false;
        }
        else {
          shadows += ", ";
        }  

        shadows += hpos_px + " " + vpos_px + " 0 0 " + color;

      }
    }

    if ( !is_value ){
      shadows = "box-shadow: " + shadows + ";";
    }

    return shadows;
  }

  // -----------------------------------------

  this.replaceAnimation = function(animation){

    var keyframes = findKeyFrames("shadows");
    var rules = keyframes.cssRules;
    Output.Animation = "";
    
    if ( rules.length > 0 ){
      for ( var keyframe in rules ) {
        var keyText = rules[keyframe].keyText;
        keyframes.deleteRule(keyText);
      }
    }

    for ( var step in Frames ){

      if ( step == 0 ) continue;

      var anim_dottes = Frames[step];
      var anim_shadows = this.createShadow( anim_dottes ); 

      var frameRule = animation.perc*step + "% {" + anim_shadows + "}"
       
      keyframes.insertRule(frameRule);
      Output.Animation += frameRule + "\n";
    }

    var resultDot = doc.querySelector(classNames.resultDot);

    resultDot.classList.remove(classIsRunning);
    resultDot.offsetWidth = resultDot.offsetWidth;
    resultDot.classList.add(classIsRunning);
  }

  // -----------------------------------------
  
  this.createPalette = function () {
    var styles = "";
    var output = "";
    
    Elems.palette.innerHTML += "<h4 class='b-title'>Colors</h4> ";

    for (var i = 0; i < Color.list.length; i++) {
      var replacements = {
        "{i}": i,
        "{color}": Color.list[i]
      };
      var colorItem = fillTemplate( Color.template, replacements );
      var colorStyle = fillTemplate( Color.StyleTempl, replacements );
      Styles.colors.innerHTML += colorStyle;
      output += colorItem;
    }  

    Elems.palette.innerHTML += "<ul class=\"items items--colors\">" + output + "</ul>";

    var first = doc.querySelector( checkDot(Color.inputClass) );
    first.checked = true;
    
    this.addEvents( Color.inputClass, this.onClickColor );
  }

  // -----------------------------------------
  
  this.onClickColor = function( elem ){
    Color.current = elem.getAttribute("data-color");
    Color.currentNum = elem.getAttribute("data-color-num");
    Color.classCurrent = Color.className + "--" + Color.currentNum;
  }

  // -----------------------------------------
  
  this.createSteps = function(){
    var output = "";
    
    var controlPlus = "<span class=\"steps-control steps-control--plus\" data-action=\"plus\">+</span>";
    var controlMinus = "<span class=\"steps-control steps-control--minus\" data-action=\"minus\">&ndash;</span>";


    Elems.steps.innerHTML += "<h4 class='b-title'>" + controlMinus + " Frames" + controlPlus + "</h4> ";
    
    for (var i = 0; i < Anim.steps; i++) {
      var replacements = {
        "{i}": i,
        "{i+1}": i+1,
      };

      var stepItem = fillTemplate( Step.template, replacements );
      output += stepItem;
    } 
    
    Elems.steps.innerHTML += "<ul class=\"items items--steps\">" + output + "</ul>";

    var first = doc.querySelector(checkDot (Step.inputClass) );
    first.checked = true;

    this.addEvents( Step.inputClass, this.onClickStep );
    this.addEvents( Step.controlClass, this.onClickStepControl );
  }

  // -----------------------------------------
  
  this.onClickStep = function( elem ){
    currentFrame = elem.getAttribute("data-step-num");
    this.paintShadow();
    this.updateCells();
    
  }

  // -----------------------------------------
  
  this.onClickStepControl = function( elem ){
    var action = elem.getAttribute("data-action");
    out("steps control");  
    if ( action == "plus") {
       out("+"); 
       Anim.steps++;
    }
    else if ( action == "minus") {
       out("-"); 
       Anim.steps--;
    }
    
    // currentFrame = elem.getAttribute("data-step-num");
    // this.paintShadow();
    // this.updateCells();    
  }
  
  // -----------------------------------------
  
  this.updateSteps = function () {
    var radio = Elems.steps.querySelectorAll("input");
    
    for (var i = 0; i < radio.length; i++) {
      if ( Frames[i].active > 0){
        radio[i].classList.add("is--filled");
      }  
      else {
        radio[i].classList.remove("is--filled");
      }
    }

  }

  // -----------------------------------------

  this.updateCells = function() {
    var checkboxes = Elems.paintBox.querySelectorAll("input");
    var frameCells = Frames[currentFrame];
    var colored = 0;

    for (var i = 0; i < checkboxes.length; i++) {
      var cell = checkboxes[i];
      var id = cell.id;
      var hpos = cell.getAttribute("data-hpos");
      var vpos = cell.getAttribute("data-vpos");
      var color = frameCells[hpos][vpos].color;

      if ( color == Color.transparent ){
        cell.checked = false;
      }
      else {
        colored++;
        cell.checked = true; 
      }
    };

  }

  // -----------------------------------------
  
  this.createCodes = function() {
    this.addEvents( classNames.codesToggle, this.onClickCodes);
  }

  // -----------------------------------------

  this.onClickCodes = function() {
      var textInit = Elems.codesToggle.getAttribute("data-init");
      var textClose = Elems.codesToggle.getAttribute("data-opened");
      var text = textInit;

      if ( is_opened ){
        is_opened = false;
      }
      else {
        is_opened = true; 
        text = textClose;
      }
      Elems.codesToggle.innerText = text;

      Elems.codes.classList.toggle("is-open");
      
      Output.HtML = "<!-- " + Output.comment + " -->\n<div class='box'><span class='dot'></span></div>";
      
      Elems.codesCss.innerHTML = "/*-- " + Output.comment + " */\n" + this.createOutputCss();
      Elems.codesHtml.innerHTML = Output.HtML;
      
  }

  // -----------------------------------------


  this.createOutputCss = function(){
   var styles = "";
   
   dottes = Frames[0];
   shadows = this.createShadow( dottes, true ); 

   this.setOutputParams();
   this.outputElemParams[".dot"]["box-shadow"] = shadows;

   for ( var elem in this.outputElemParams ){
      var className = elem;
      var elemStyles = "";
      var params = this.outputElemParams[elem];
      for (var item in params){
        var value = addUnits( params[item], item );
        elemStyles += item + ": " + value + ";\n";
      }
      styles += className + " {\n" + elemStyles + "}\n";
    }

    styles += "\n/* Keyframes */\n";
    
    //out( Output.Animation );
    var animation = "\n@-webkit-keyframes shadows {\n" + Output.Animation + "\n}\n";
    animation += "@keyframes shadows {\n" + Output.Animation + "\n}\n";
    styles += animation;

    return styles;
  }

  // -----------------------------------------

  this.createDurationInp = function(){

    var durationInt = Anim.duration.split("s").join("");
    Elems.durationInp.value = durationInt;

    this.addDataDefautlt(Elems.durationInp, durationInt);
    
    this.addOnChangeEvents( classNames.durationInp, this.onChangeDuration);
  }

  // -----------------------------------------

  this.onChangeDuration = function(elem, key){
    Anim.duration = elem.value + "s";
    //this.addConfig();
    this.paintShadow();
  }

  // -----------------------------------------

  this.createSizeInp = function(){

    Elems.sizeInp.value = Scene.size;
    this.addDataDefautlt(Elems.sizeInp, Scene.size);

    this.addOnChangeEvents( classNames.sizeInp, this.onChangeSize);
  }

  // -----------------------------------------

  this.onChangeSize = function(elem){

    Scene.size = +elem.value;

    this.addConfig();
    this.paintShadow();
  }

  // -----------------------------------------

  this.createDotsInp = function(){

    Elems.dotsInp.value = Scene.oneSide;
    this.addDataDefautlt(Elems.dotsInp, Scene.oneSide);

    this.addOnChangeEvents( classNames.dotsInp, this.onChangeDots);
  }

  // -----------------------------------------

  this.onChangeDots = function(elem){

    Scene.oneSide = +elem.value;

    this.addConfig();
    this.createInputsSet();
    this.paintShadow();
  }

}// End Pixelator

// Common
// -----------------------------------------

function out ( data ) {
  console.log( data );
}

function checkDot ( className ){
  if ( className.indexOf(".") < 0 ){
    className = "." + className;
  }
  return className;
}

function strIsNAN(str){

  str = str.replace(/-|\./g,"");  //| 
  str = str.split(" ").join("");
  return isNaN(str);
}

function addUnits( str, property ){
  str = String(str);
  var arr = str.split(" ");

  if ( strIsNAN(str) ){
    return str;  
  }

  if ( arr.length > 1 
      && arr[0].indexOf("px") < 0
      && arr[0].indexOf("em") < 0
      && arr[0].indexOf("%") < 0 ){
      str = arr.join("px ") + "px"; 
      return str;  
  }
  
  if ( str.indexOf("px") < 0 
      && str.indexOf("em") < 0
      && arr[0].indexOf("%") < 0 ) {
    str += "px";
  }

  return str;
}


  function getValByKeyCode(elem, key, isShift ) {
    var value = +elem.value;
    var min = elem.getAttribute("data-min");
    var max = elem.getAttribute("data-max");

    var step = isShift ? 10 : 1;
      
    if ( key == 38 ) {
      if ( value >= 0 
           && value < 1 
           && min < 1 ){

        step = .1;
      }
      value += step;
    }
    else if ( key == 40 ) {
      if ( value > 0 
           && value <= 1
           && min < 1 ){

        step = .1;
      }
      value -= step;
    }

    if ( value < min ) {
      value = min;
      }
    else if ( max != null && value > max ) {
      value = max;
      }
    else {
      if ( value > 0 && value < 1 ){
        value = value.toFixed(1);
      }
      else {
        value = value.toFixed();
      }
    }
    

    return value;
  }

function valueSetDefaultIfNAN(elem){
  var value = elem.value;
  var defaultValue = elem.getAttribute("data-default");
  if ( isNaN( value ) ){
     return defaultValue;
  }
  out( "valueSetDefault" );
  out(value);
  return value;
}

function minMaxDef(elem) {
   var min = elem.getAttribute("data-min");
   min = min == null ? 0 : +min;
   
   var max = elem.getAttribute("data-max");
   max = max == null ? 100 : +max;

   var value = elem.value;

   value = value > max ? max : value < min ? min : value;
   return value;
}        

function fillTemplate( dataStr, replacements ) {
  for ( var key in replacements ){
    var findStr = key;
    var replaceWithStr = replacements[key];
    
    dataStr = dataStr.split(findStr).join(replaceWithStr);
  }
  return dataStr;  
}

function objLength( obj ) {
  var count = 0;
  for ( var key in obj ){
    count++;
  }
  return count;
}

// Init
// -----------------------------------------
var painter = new shadowPainter();

painter.init();


