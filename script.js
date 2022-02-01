
function SetColour(color) {
	document.documentElement.setAttribute("theme", color);
}
function GetPreferredColorScheme() {
  if (window.matchMedia) {
    // Check if the dark-mode Media-Query matches
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      current = "dark";
    } else {
      current = "light";
    }
  }
  SetColour(current);
}


if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    current = e.matches ? "dark" : "light";
    SetColour(current);
	});
}
GetPreferredColorScheme();
function CodeColor(elmnt, mode) {
  var lang = (mode || "adk");
  var elmntObj = (document.getElementById(elmnt) || elmnt);
  var elmntTxt = elmntObj.innerHTML.replaceAll("\n", "<br>");
  var tagcolor = "mediumblue";
  var tagnamecolor = "brown";
  var attributecolor = "red";
  var attributevaluecolor = "mediumblue";
  var commentcolor = "green";
	var directivecolor = "var(--dynamic-blue)";
	var opcolor = "var(--shadow-color)";
  var cssselectorcolor = "brown";
  var csspropertycolor = "red";
  var csspropertyvaluecolor = "mediumblue";
  var cssdelimitercolor = "black";
  var cssimportantcolor = "red";  
  var jscolor = "black";
  var jskeywordcolor = "purple";
	var jsopcolor = "orange";
	var jsidcolor = "lightblue";
  var jsstringcolor = "brown";
  var jsnumbercolor = "red";
  var jspropertycolor = "darkgrey";
  if (!lang) {lang = "adk"; }
  if (lang == "adk") {elmntTxt = adkMode(elmntTxt);}
  elmntObj.innerHTML = elmntTxt;

  function extract(str, start, end, func, repl) {
    var s, e, d = "", a = [];
    while (str.search(start) > -1) {
      s = str.search(start);
      e = str.indexOf(end, s);
      if (e == -1) {e = str.length;}
      if (repl) {
        a.push(func(str.substring(s, e + (end.length))));      
        str = str.substring(0, s) + repl + str.substr(e + (end.length));
      } else {
        d += str.substring(0, s);
        d += func(str.substring(s, e + (end.length)));
        str = str.substr(e + (end.length));
      }
    }
    this.rest = d + str;
    this.arr = a;
  }
  function attributeValueMode(txt) {
    return "<span style=color:" + attributevaluecolor + ">" + txt + "</span>";
  }
  function commentMode(txt) {
    return "<span style=color:" + commentcolor + ">" + txt + "</span>";
  }
	function directiveMode(txt) {
    return "<span style=color:" + directivecolor + ">" + txt + "</span>";
  }
  function adkMode(txt) {
    var rest = txt, done = "", esc = [], i, cc, tt = "", sfnuttpos, dfnuttpos, comlinepos, keywordpos, numpos, mypos, dotpos, y, compos, directive, oppos, idpos;
    for (i = 0; i < rest.length; i++)  {
      cc = rest.substr(i, 1);
      if (cc == "\\") {
        esc.push(rest.substr(i, 2));
        cc = "W3JSESCAPE";
        i++;
      }
      tt += cc;
    }
    rest = tt;
    y = 1;
    while (y == 1) {
      sfnuttpos = getPos(rest, "'", "'", jsStringMode);
      dfnuttpos = getPos(rest, '"', '"', jsStringMode);
      compos = getPos(rest, "\\\\", "", commentMode);
      comlinepos = getPos(rest, "//", "<br>", commentMode);   
			directive = getPos(rest, "#", " ", directiveMode);   
      numpos = getNumPos(rest, jsNumberMode);
      keywordpos = getKeywordPos(rest, jsKeywordMode);
			oppos = getKeywordPos(rest, jsOPMode, ["++", "--","+", "-", "/", "*", "^", "%", "(", ")", "=", "+=", "-=", "*=", "/=", "|=", "<", ">", "<=", ">=", "!=", "and", "not", "or", "xor", "||", "x|", "&&"]);
			idpos = getKeywordPos(rest, jsIDMode, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_");
      dotpos = getDotPos(rest, jsPropertyMode);
      if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], comlinepos[0], keywordpos[0], compos[0], dotpos[0], directive[0], oppos[0], idpos[0]) == -1) {break;}
      mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, comlinepos, keywordpos, dotpos, compos, directive, oppos, idpos);
      if (mypos[0] == -1) {break;}
      if (mypos[0] > -1) {
        done += rest.substring(0, mypos[0]);
        done += mypos[2](rest.substring(mypos[0], mypos[1]));
        rest = rest.substr(mypos[1]);
      }
    }
    rest = done + rest;
    for (i = 0; i < esc.length; i++) {
      rest = rest.replace("W3JSESCAPE", esc[i]);
    }
    return "<span>" + rest + "</span>";
  }
  function jsStringMode(txt) {
    return "<span style=color:" + jsstringcolor + ">" + txt + "</span>";
  }
  function jsKeywordMode(txt) {
    return "<span style=color:" + jskeywordcolor + ">" + txt + "</span>";
  }
	function jsOPMode(txt) {
    return "<span style=color:" + jsopcolor + ">" + txt + "</span>";
  }
	function jsIDMode(txt) {
    return "<span style=color:" + jsidcolor + ">" + txt + "</span>";
  }
  function jsNumberMode(txt) {
    return "<span style=color:" + jsnumbercolor + ">" + txt + "</span>";
  }
  function jsPropertyMode(txt) {
    return "<span style=color:" + jspropertycolor + ">" + txt + "</span>";
  }
  function getDotPos(txt, func) {
    var x, i, j, s, e, arr = [".","<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%"];
    s = txt.indexOf(".");
    if (s > -1) {
      x = txt.substr(s + 1);
      for (j = 0; j < x.length; j++) {
        cc = x[j];
        for (i = 0; i < arr.length; i++) {
          if (cc.indexOf(arr[i]) > -1) {
            e = j;
            return [s + 1, e + s + 1, func];
          }
        }
      }
    }
    return [-1, -1, func];
  }
  function getMinPos() {
    var i, arr = [];
    for (i = 0; i < arguments.length; i++) {
      if (arguments[i][0] > -1) {
        if (arr.length == 0 || arguments[i][0] < arr[0]) {arr = arguments[i];}
      }
    }
    if (arr.length == 0) {arr = arguments[i];}
    return arr;
  }
  function getKeywordPos(txt, func, words) {
    var i, pos, rpos = -1, rpos2 = -1, patt;
      words = words || ["funct", "class", "return", "yeild", "static", "for", "while", "if", "else", "match", "case", "default", "true", "false", "none", "null", "as", "in", "break", "continue", "reference", "private", "await", "getter", "String", "Array", "Number", "Set", "Matrix", "Pair", "Object", "Tuple", "Type", "Boolean", "Function", "File", "Error", "Bytes", "RegEx", "try", "except", "and", "or", "xor", "not"];
    for (i = 0; i < words.length; i++) {
      pos = txt.indexOf(words[i]);
      if (pos > -1) {
        patt = /\W/g;
        if (txt.substr(pos + words[i].length,1).match(patt) && txt.substr(pos - 1,1).match(patt)) {
          if (pos > -1 && (rpos == -1 || pos < rpos)) {
            rpos = pos;
            rpos2 = rpos + words[i].length;
          }
        }
      } 
    }
    return [rpos, rpos2, func];
  }
  function getPos(txt, start, end, func) {
    var s, e;
    s = txt.search(start);
    e = txt.indexOf(end, s + (end.length));
		if (e == -1) {e = txt.length};
    return [s, e + (end.length), func];
  }
  function getNumPos(txt, func) {
    var arr = ["<br>", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "/" ,"-", "*", "|", "%", "="], i, j, c, startpos = 0, endpos, word;
    for (i = 0; i < txt.length; i++) {
      for (j = 0; j < arr.length; j++) {
        c = txt.substr(i, arr[j].length);
        if (c == arr[j]) {
          if (c == "-" && (txt.substr(i - 1, 1) == "e" || txt.substr(i - 1, 1) == "E")) {
            continue;
          }
          endpos = i;
          if (startpos < endpos) {
            word = txt.substring(startpos, endpos);
            if (!isNaN(word)) {return [startpos, endpos, func];}
          }
          i += arr[j].length;
          startpos = i;
          i -= 1;
          break;
        }
      }
    }  
    return [-1, -1, func];
  }  
}
window.onload = function() {
	list = document.getElementsByTagName("code")
	for (i in list) {
		c=list[i]
		if (c.innerHTML==undefined) {continue};
		if (!(c.innerHTML.includes("<h1>") || c.innerHTML.includes("<h2>") || c.innerHTML.includes("<h3>") || c.innerHTML.includes("<h4>") || c.innerHTML.includes("<h5>") ||
c.innerHTML.includes("<h6>"))) {
			CodeColor(c)
		}
	}
}