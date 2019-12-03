

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
  const tabs = document.querySelector('.mdc-tab-bar').MDCTabBar;
  $(".home").show();
  $(".fav").hide();
  $(".mic").hide();
  $(".search").hide();
  $("#chart_div").hide();
  $(".stockInfo").hide();
  $("#time").hide();

  $(".homeTab").on("click", function(){
    tabs.activateTab(0);
    $(".home").show();
    $(".fav").hide();
    $(".mic").hide();
    $(".search").hide();
    $("#chart_div").hide();
    $(".stockInfo").hide();
    $("#time").hide();
  });

  $(".stockCard").on("click", function(){
    //remove old stockCardInfo--->>
    $("#chart_div").empty();
    $(".stockInfo").empty();
    $(".mic").hide();
    $(".fav").hide();
    $(".home").hide();
    $(".search").hide();
    $("#chart_div").show();
    $(".stockInfo").show();
    $("#time").show();

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
                        "5Y</button>" );
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
  });
});


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
