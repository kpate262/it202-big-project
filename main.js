

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


$(document).ready(function(){
  const keys = Object.keys(favoriteStocks);
  for(const key of keys){
    console.log(key);
    $(".home").append('<div class="mdc-card demo-card demo-ui-control">' +
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
  $(".search").hide();

  $(".homeTab").on("click", function(){
    tabs.activateTab(0);
    $(".home").show();
    $(".search").hide();
  });

  $(".favTab").on("click", function(){
    tabs.activateTab(1);
    $(".home").show();
    $(".search").hide();
  });

  $(".micTab").on("click", function(){
    tabs.activateTab(2);
    $(".home").show();
    $(".search").hide();
  });

  $(".searchTab").on("click", function(){
    tabs.activateTab(3);
    $(".home").hide();
    $(".search").show();
  });
});
