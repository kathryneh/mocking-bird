
function author2url(author){
	var graphSearchName = 'http://graph.facebook.com/search?type=page&q=\"'+author+'\"'
	requestGraphNameSearch(graphSearchName);
}

function ajax(url, callbackFunction) {
    var request =  new XMLHttpRequest();
    request.open("GET", url, true);
    request.setRequestHeader("Content-Type",
      "application/x-www-form-urlencoded");

    request.onreadystatechange = function() {
      var done = 4, ok = 200;
      if (request.readyState == done && request.status == ok) {
        if (request.responseText) {
          callbackFunction(request.responseText);
        }
      }
    };
    request.send();
  }

  var requestGraphNameSearch = function (graphSearchTerm) {
    ajax(graphSearchTerm, getComplete);
  }
  var requestGraphIDSearch = function (graphSearchTerm) {
    ajax(graphSearchTerm, getComplete2);
  }

  var getComplete = function (text) {
    var idString = (text.match(/band",[\s]*"id": "[0-9]*"/gi)[0]);
	idString = idString.match(/[0-9]+/gi)[0];
	var graphSearchID = 'http://graph.facebook.com/'+idString;
	requestGraphIDSearch(graphSearchID);
  }
  
  var getComplete2 = function(text){

	var linkString = (text.match(/"link"\: "http\:\/\/www.facebook.com\/[^"]*"/gi)[0]);

	linkString = linkString.match(/http\:\/\/[^]*/gi)[0];
	
	linkString = linkString.match(/[^"]*/gi)[0];
	artistFound(linkString);
  }
  var artistFound = function(artist){
		artist = artist.replace(/\u/g, "%u");
		alert(unescape(artist));
		//window.location = unescape(artist);
  }

  //alert(unescape('%u0025C3'));
  
/*  
    http://www.facebook.com/pages/Sar%u0025C3%u0025BC-Whatthefuck-Official/287032691352293 program

  http://www.facebook.com/pages/Sar\u0025C3\u0025BC-Whatthefuck-Official/287032691352293 program
  http://www.facebook.com/pages/Sar%C3%BC-Whatthefuck-Official/287032691352293?fref=ts  facebook
  */
