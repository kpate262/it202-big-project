

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

var favoriteStocks = {"SBUX":["Starbucks Corporation"], "AAPL": ["Apple Inc."], "LYFT":["Lyft Inc."], "INTC":["Intel Corporation"],
                      "TWTR":["Twitter Inc."], "GOOGL":["Alphabet Inc."], "AMZN":["Amazon.com Inc."]};

var stocks = ["SBUX", "AAPL", "Star"];
var rowData = [];
var symbol = "";
var color = '';

$(document).ready(function(){
  const keys = Object.keys(favoriteStocks);
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

  window.mdc.autoInit();
  //mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
  const tabs = document.querySelector('.mdc-tab-bar').MDCTabBar;
  const textField = document.querySelector('.mdc-text-field').MDCTextField;

  $(".home").show();
  $(".fav").hide();
  $(".mic").hide();
  $(".search").hide();
  $("#chart_div").hide();
  $(".stockInfo").hide();
  $("#time").hide();
  $("#date").hide();

  $(".homeTab").on("click", function(){
    tabs.activateTab(0);
    $(".home").show();
    $(".fav").hide();
    $(".mic").hide();
    $(".search").hide();
    $("#chart_div").hide();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();
  });

  $(".stockCard").on("click", function(){
    //remove old stockCardInfo--->>
    $("#chart_div").empty();
    $(".stockInfo").empty();
    $("#time").empty();
    $(".mic").hide();
    $(".fav").hide();
    $(".home").hide();
    $(".search").hide();
    $("#chart_div").show();
    $(".stockInfo").show();
    $("#time").show();
    $("#date").show();

    var stockSymbol = $(this).attr('id');
    console.log(":"+stockSymbol+":");
    symbol = stockSymbol;
    var intraDayUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="+ stockSymbol +"&interval=5min&outputsize=full&apikey=RQ5M4GP7TOJYKTI4";
    console.log(intraDayUrl);
    var compInfo = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords="+ stockSymbol +"&apikey=RQ5M4GP7TOJYKTI4";


    //$.get(intraDayUrl, function(response){});
    $.get(intraDayUrl, function(response){
      var startTime = "09:35:00";
      var lastDate = response["Meta Data"]["3. Last Refreshed"].replace(/ /g," ");
      var date = lastDate.split(" ")[0];
      var startDate = date + " " + startTime;
      $.get(compInfo, function(compname){
        $(".stockInfo").append("<div> " +
                                  "<h5 id='sym'>" + symbol + "</h5>" +
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
  });

  $(".micTab").on("click", function(){
    tabs.activateTab(2);
    $(".home").hide();
    $(".fav").hide();
    $(".mic").show();
    $(".search").hide();
    $("#chart_div").hide();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();
  });

  $(".searchTab").on("click", function(){
    tabs.activateTab(3);

    $("#chart_div").hide();
    $(".home").hide();
    $(".fav").hide();
    $(".mic").hide();
    $(".search").show();
    $(".stockInfo").hide();
    $("#time").hide();
    $("#date").hide();

  });


  $(".submitbutton").click(function(e){
    //console.log(textField.value);
    //console.log($("#text-field-hero-input").val());
    console.log(document.getElementById("stockname").value);
  });


});

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


autocomplete(document.getElementById("stockname"), stocks);
//autocomplete(document.getElementById("searchbox"), stocks);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
  .then(function(reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

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
