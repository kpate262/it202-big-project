

/*
  Live delayed stock quotes by Alpha Vantage
  Link: https://www.alphavantage.co/
*/
var alphaApiKey = "RQ5M4GP7TOJYKTI4";
var alphEndpoint = "https://www.alphavantage.co/query?function="
var addSymbol = "&symbol=";
var addKeyword = "&keywords=";
var addAppkey = "&apikey=RQ5M4GP7TOJYKTI4";

var typeOfTimeSeries = { "everyFiveMin": "TIME_SERIES_INTRADAY", "daily":"TIME_SERIES_DAILY",
                          "dailyAdjusted":"TIME_SERIES_DAILY_ADJUSTED", "weekly":"TIME_SERIES_WEEKLY",
                          "weeklyAdjusted": "TIME_SERIES_WEEKLY_ADJUSTED", "monthly": "TIME_SERIES_MONTHLY",
                          "monthlyAdjusted": "TIME_SERIES_MONTHLY_ADJUSTED", "search": "SYMBOL_SEARCH"};

/*
  Example usages: alphEndpoint + typeOfTimeSeries(exclude search) + addSymbol + StockSymbol + addAppkey
                  alphEndpoint + typeOfTimeSeries[search] + addKeyword + StockSymbol + addAppkey

  Example search: https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&apikey=demo
                  https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=BA&apikey=demo
*/

/*
  News courtsy of News Api
  link: https://newsapi.org/
*/
var newsApiKey = "4db8c37440f448848c0ee203d91c5c42";
var newsApiEndpoint = "https://newsapi.org/v2/everything?q=";
var addApiKey = "&apiKey=4db8c37440f448848c0ee203d91c5c42";
var newsFromDate = "&from=";
var newsToDate = "&to="
/*
  Example usages: newsApiEndpoint + StockSymbol + addAppkey
                  newsApiEndpoint + newsFromDate + newsFromDate(ex: 2019-11-18) + newsToDate(ex: 2019-11-18) + addAppkey

  Example search: https://newsapi.org/v2/everything?q=apple&from=2019-11-18&to=2019-11-18&apiKey=4db8c37440f448848c0ee203d91c5c42
                  https://newsapi.org/v2/everything?q=apple&from=2019-11-18&to=2019-11-18&sortBy=popularity&apiKey=4db8c37440f448848c0ee203d91c5c42
                  https://newsapi.org/v2/everything?q=bitcoin&apiKey=4db8c37440f448848c0ee203d91c5c42
*/

var SpeechRecognition = window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();


var favoriteStocks = {"SBUX":["Starbucks Corporation"], "AAPL": ["Apple Inc."], "LYFT":["Lyft Inc."], "INTC":["Intel Corporation"],
                      "TWTR":["Twitter Inc."], "GOOGL":["Alphabet Inc."], "AMZN":["Amazon.com Inc."]};

var favoriteNews = {};

//const db = new Dexie('Stock_News');

//db.version(1).stores({
//	favStocks: '++id, stock, company'
//});

var onedDayStocks = ["SBUX", "AAPL", "Star"];
var stock = "";
var rowData = [];
var symbol = "";
var color = '';
var lastDate = "";

$(document).ready(function(){
  var keys = Object.keys(favoriteStocks);
  for(const key of keys){
    console.log(key);
    //db.favStocks.add({
		//stock: key,
		//company: favoriteStocks[key][0]
	  //});
    $(".home").append('<div class="mdc-card demo-card demo-ui-control stockCard" id="'+ key +'">' +
                        '<div class="mdc-card__primary-action demo-card__primary-action favCard" tabindex="0">' +
                          '<div class="demo-card__primary">'+
                            '<h2 class="demo-card__title mdc-typography mdc-typography--headline6 symbol">'+ key +'</h2>' +
                            '<h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2 companyName">'+ favoriteStocks[key][0] +'</h3>' +
                          '</div>' +
                          '<span class="mdc-tab-indicator mdc-tab-indicator--active">' +
                            '<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>' +
                          '</span>' +
                          '<span class="mdc-tab__ripple"></span>' +
                        '</div>' +
                      '</div>');

  }

  window.mdc.autoInit();
  //mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
  const tabs = document.querySelector('.mdc-tab-bar').MDCTabBar;
  //const textField = document.querySelector('.mdc-text-field').MDCTextField;

  $(".home").show();
  $(".fav").hide();
  $(".mic").hide();
  $(".search").hide();
  $("#chart_div").hide();
  $(".stockInfo").hide();
  $("#time").hide();
  $("#date").hide();
  $(".stockNews").hide();
  $("#addTohome").hide();

  $(".homeTab").on("click", function(){
    $('.home').empty();
    //console.log("kk"+ db.favStocks.where('SBUX').toArray()[0]);
    var keys = Object.keys(favoriteStocks);
    for(const key of keys){
      console.log(key);

      $(".home").append('<div class="mdc-card demo-card demo-ui-control stockCard" id="'+ key +'">' +
                          '<div class="mdc-card__primary-action demo-card__primary-action favCard" tabindex="0">' +
                            '<div class="demo-card__primary">'+
                              '<h2 class="demo-card__title mdc-typography mdc-typography--headline6 symbol">'+ key +'</h2>' +
                              '<h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2 companyName">'+ favoriteStocks[key][0] +'</h3>' +
                            '</div>' +
                            '<span class="mdc-tab-indicator mdc-tab-indicator--active">' +
                              '<span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>' +
                            '</span>' +
                            '<span class="mdc-tab__ripple"></span>' +
                          '</div>' +
                        '</div>');

    }
    tabs.activateTab(0);
    //document.getElementById("dateForm").reset();
    $(".home").show();
    $(".fav").hide();
    $(".mic").hide();
    $(".search").hide();
    $("#chart_div").hide();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();
    $(".stockNews").hide();
    $("#addTohome").hide();
  });

  $("body").on("click", "div.stockCard", function(){
    var stockSymbol = $(this).attr('id');
    console.log(":"+stockSymbol+":");
    clearStockInfo();
    stockInfoOnClick(stockSymbol);
  });

  $(".submitbutton").on("click", function(e){
    e.preventDefault();
    //console.log(textField.value);
    //console.log($("#text-field-hero-input").val());
    var stockSymbol = document.getElementById("stockname").value;
    console.log(stockSymbol);
    clearStockInfo();
    document.getElementById("queryForm").reset();
    stockInfoOnClick(stockSymbol);
  });

  $(".micbutton").on("click", function(e){
    e.preventDefault();
    recognition.stop();
    //console.log(textField.value);
    //console.log($("#text-field-hero-input").val());
    console.log(Content);
    clearStockInfo();
    document.getElementById("micForm").reset();
    stockInfoOnClick(Content);
    Content = '';
  });

  $(".favTab").on("click", function(){
    tabs.activateTab(1);
    $(".mic").hide();
    $(".fav").show();
    $(".home").hide();
    $(".search").hide();
    $("#chart_div").hide();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();
    $(".stockNews").hide();
    $("#addTohome").hide();
  });


  var Textbox = $('#stockmicname');
  var Content = '';
  var instructions = $('instructions');
  recognition.continuous = true;
  recognition.onresult = function(event) {

  var current = event.resultIndex;

  var transcript = event.results[current][0].transcript;

    Content += transcript;
    Textbox.val(Content);

  };

  recognition.onstart = function() {
    instructions.text('Voice recognition is ON.');
  }

  recognition.onspeechend = function() {
    instructions.text('No activity.');
  }

  recognition.onerror = function(event) {
    if(event.error == 'no-speech') {
      instructions.text('Try again.');
    }
  }
  Textbox.on('input', function() {
    Content = $(this).val();
  })


  $(".micTab").on("click", function(){
    tabs.activateTab(1);
    $(".home").hide();
    $(".fav").hide();
    $(".mic").show();
    $(".search").hide();
    $("#chart_div").hide();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();
    $(".stockNews").hide();
    $("#addTohome").hide();
    if (Content.length) {
      Content += ' ';
    }
    recognition.start();
  });

  $(".searchTab").on("click", function(){
    tabs.activateTab(2);
    $("#chart_div").hide();
    $(".home").hide();
    $(".fav").hide();
    $(".mic").hide();
    $(".search").show();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();
    $(".stockNews").hide();
    $("#addTohome").hide();
  });

  $("body").on("click", ".readButton", function(){
    var newsinfo = $(this).attr('id');
    console.log(newsinfo);
    var feva = newsinfo.split("_", 2);
    console.log(feva[0] + " ..." + feva[1]);
    favoriteNews[feva[0]] = [feva[1]];
    console.log(favoriteNews);
  });

  $("body").on("click", ".favNewsButton", function(){
    hide();
    var newsinfo = $(this).attr('id');
    console.log(newsinfo);
    var feva = newsinfo.split("_");
    console.log(feva[0] + " ..." + feva[1]);
    favoriteNews[feva[0]] = [feva[1]];
    console.log(favoriteNews);
  });

  $("body").on("click", "button.addtohome", function(){
    console.log("add to home click");
    var stockinfo = $(this).attr('id');
    console.log(stockinfo);
    var stocka = stockinfo.split("_");
    console.log(stocka[0] + " ..." + stocka[1]);
    favoriteStocks[stocka[0]] = [stocka[1]];
    console.log(favoriteStocks);
  });

  function clearStockInfo(){
    console.log("stockinfo");
    $("#chart_div").empty();
    $(".stockInfo").empty();
    $(".stockNews").empty();
    $("#addTohome").empty();
    $("#time").empty();
    $(".mic").hide();
    $(".fav").hide();
    $(".home").hide();
    $(".search").hide();
    $("#chart_div").show();
    $(".stockInfo").show();
    $("#time").show();
    $("#date").show();
    $(".stockNews").show();
    $("#addTohome").show();
  }

  function hide(){
    $("#chart_div").empty();
    $(".stockInfo").empty();
    $(".stockNews").empty();
    $("#addTohome").empty();
    $("#time").empty();
    $(".mic").hide();
    $(".fav").hide();
    $(".home").hide();
    $(".search").hide();
    $("#chart_div").hide();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();
    $(".stockNews").hide();
    $("#addTohome").hide();
  }

  function stockInfoOnClick(stockSymbol){
    console.log("stockInfo on click");
    stock = stockSymbol;
    var intraDayUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+ stockSymbol +"&interval=5min&outputsize=full&apikey=RQ5M4GP7TOJYKTI4";
    console.log(intraDayUrl);
    var compInfo = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+ stockSymbol +"&apikey=RQ5M4GP7TOJYKTI4";
    var companyName = "";

    //$.get(intraDayUrl, function(response){});
    $.get(intraDayUrl, function(response){
      var startTime = "09:35:00";
      lastDate = response["Meta Data"]["3. Last Refreshed"].replace(/ /g," ");
      var date = lastDate.split(" ")[0];
      var startDate = date + " " + startTime;

      $.get(compInfo, function(compname){
        companyName = compname["bestMatches"][0]["2. name"];
        $(".stockInfo").append("<div> " +
                                  "<h5 id='sym'>" + stock.toUpperCase() + "</h5>" +
                                  "<h2 id='comp'>" + compname["bestMatches"][0]["2. name"] + "</h2>" +
                                  "<h2 id='quote'>$" + parseFloat(response["Time Series (5min)"][response["Meta Data"]["3. Last Refreshed"]]["4. close"]) + "</h2>" +
                                "</div>");
      });
      //console.log(startDate);
      //console.log(lastDate);
      var counter = 0;
      $.each(response["Time Series (5min)"], function(i, v){
          var rowEl = [];
          rowEl.push(i);
          //console.log(">>" + v["1. open"])
          rowEl.push(parseFloat(v["1. open"]));
          //console.log("<<" + rowEl);
          rowData.push(rowEl);

        if(i == startDate){
          return false;
        }

        //console.log(v["1. open"]);
      });
      //console.log(rowData);
      rowData = rowData.reverse();
      console.log(rowData);
      //$.each()
      //console.log(stockSymbol);
      google.charts.load('current', {packages: ['corechart', 'line']});
      google.charts.setOnLoadCallback(drawLogScales);
      $("#time").append("<div class='oneDay'>Showing results for Date: " + date +" </div>");

      $.get(compInfo, window.load = function(compname){
        $("#addTohome").append('<button type="Submit" class="btn btn-primary addtohome" id="'+ stock.toUpperCase()+ "_"+ compname["bestMatches"][0]["2. name"] +'">Add '+ stock.toUpperCase()+' to home</button>');
      });
      var allStockNews = "https://newsapi.org/v2/everything?q="+ stock +"&from="+ date +"&sortBy=popularity&apiKey=4db8c37440f448848c0ee203d91c5c42";
      $.get(allStockNews, function(newsResponse){
        $.each(newsResponse["articles"], function(i,v){
          $(".stockNews").append('<div class="mdc-card demo-card demo-basic-with-header newsCards"> '+
                                  '<div class="demo-card__primary">' +
                                    '<h2 class="demo-card__title mdc-typography mdc-typography--headline6"><strong>'+ v["title"] +'</strong></h2>'+
                                    '<h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2">by '+ v["author"] +'</h3>'+
                                  '</div>'+
                                  '<div class="mdc-card__primary-action demo-card__primary-action" tabindex="0">' +
                                    '<div class="mdc-card__media mdc-card__media--16-9 demo-card__media" style="background-image: url(&quot;'+ v["urlToImage"] +'&quot;);"></div>'+
                                    '<div class="demo-card__secondary mdc-typography mdc-typography--body2">'+ v["description"] +'</div>'+
                                  '</div>'+
                                  '<div class="mdc-card__actions">'+
                                    '<div class="mdc-card__action-buttons">'+
                                    '<button class="mdc-button mdc-card__action mdc-card__action--button readButton" id="'+ v["title"]+ "_" + v["url"] +'">  <span class="mdc-button__ripple"></span> Read</button> '+
                                    '<button class="mdc-button mdc-card__action mdc-card__action--button favNewsButton" id="'+ v["title"]+ "_" + v["url"] +'">  <span class="mdc-button__ripple"></span> Favorite</button>'+
                                  '</div>'+
                                  '<div class="mdc-card__action-icons">'+
                                    '<button class="mdc-icon-button mdc-card__action mdc-card__action--icon--unbounded" aria-pressed="false" aria-label="Add to favorites" title="Add to favorites">' +
                                      '<i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">favorite</i>' +
                                      '<i class="material-icons mdc-icon-button__icon">favorite_border</i>'+
                                    '</button>'+

                                  '</div>'+
                                '</div>'+
                              '</div>');
        });

      });
    });


    console.log("done");
  }
});



function getStocks(symbol, url, startDate, endDate){
  $.get(intraDayUrl, function(response){
    var startTime = "09:35:00";
    lastDate = response["Meta Data"]["3. Last Refreshed"].replace(/ /g," ");
    var date = lastDate.split(" ")[0];
    var startDate = date + " " + startTime;
    $.get(compInfo, function(compname){
      $(".stockInfo").append("<div> " +
                                "<h5 id='sym'>" + onedDayStocks + "</h5>" +
                                "<h2 id='comp'>" + compname["bestMatches"][0]["2. name"] + "</h2>" +
                                "<h2 id='quote'>$" + parseFloat(response["Time Series (5min)"][response["Meta Data"]["3. Last Refreshed"]]["4. close"]) + "</h2>" +
                              "</div>");
    })
    //console.log(startDate);
    //console.log(lastDate);
    var counter = 0;
    $.each(response["Time Series (5min)"], function(i, v){
        var rowEl = [];
        rowEl.push(i);
        //console.log(">>" + v["1. open"])
        rowEl.push(parseFloat(v["1. open"]));
        //console.log("<<" + rowEl);
        rowData.push(rowEl);

      if(i == startDate){
        return false;
      }

      //console.log(v["1. open"]);
    });
    //console.log(rowData);
    rowData = rowData.reverse();
    console.log(rowData);
    //$.each()
    //console.log(stockSymbol);
    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawLogScales);
    $("#time").append("<button class='mdc-button'>" +
                        "<span class='mdc-button__ripple'></span>" +
                      "1D</button>" +
                      "<button class='mdc-button'>" +
                        "<span class='mdc-button__ripple'></span>" +
                      "1W</button>" +
                      "<button class='mdc-button'>" +
                        "<span class='mdc-button__ripple'></span>" +
                      "1M</button>" +
                      "<button class='mdc-button'>" +
                        "<span class='mdc-button__ripple'></span>" +
                      "3M</button>" +
                      "<button class='mdc-button'>" +
                        "<span class='mdc-button__ripple'></span>" +
                      "1Y</button>" +
                      "<button class='mdc-button'>" +
                        "<span class='mdc-button__ripple'></span>" +
                      "CT</button>" );
  });
}


//Used https://www.w3schools.com/howto/howto_js_autocomplete.asp for autocomplete feature
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });


  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });


  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}


autocomplete(document.getElementById("stockname"), onedDayStocks);
//autocomplete(document.getElementById("searchbox"), stocks);

/*if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}*/

function drawLogScales(){
  var data = new google.visualization.DataTable();
      data.addColumn('string');
      data.addColumn('number', symbol);

      console.log(rowData);
      data.addRows(rowData);

      var options = {
        backgroundColor: '#000000',

        hAxis: {
          textPosition: 'none',
          gridlines: {
              color: 'transparent'
          }
        },
        width: 375,
        chartArea: {  width: "100%", height: "80%" },
        colors: ['#a52714']
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
      rowData = [];
}
