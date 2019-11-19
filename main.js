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
