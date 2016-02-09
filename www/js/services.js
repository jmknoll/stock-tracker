(function(){

'use strict';

var app = angular.module('stockTracker.services', []);

app.factory('EncodeURIService', function(){

	return {
		encode: function(string){
			return encodeURIComponent(string).replace(/\"/g, "%22").replace(/\ /g, "%20").replace(/[!'()']/g, escape);
		}
	};
});

app.factory('DateService', function($filter) {
	var currentDate = function(){
		var d = new Date();
		var date = $filter('date')(d, 'yyyy-MM-dd');
		return date;
	};

	var oneYearAgoDate = function(){
		var d = new Date(new Date().setDate()(new Date().getDate() - 365));
		var date = $filter('date')(d, 'yyyy-MM-dd');
		return date;
	};

	return {
		currentDate: currentDate,
		oneYearAgoDate: oneYearAgoDate,
	};
});

app.factory('StockDataService', function($log, $q, $http, EncodeURIService){

	var getDetailData = function(ticker) {
		
		var deferred = $q.defer();

		var query = 'select * from yahoo.finance.quotes where symbol IN ("' + ticker + '")';
		var url = 'http://query.yahooapis.com/v1/public/yql?q=' + EncodeURIService.encode(query) + '&format=json&env=http://datatables.org/alltables.env';

		$http.get(url)
    	.success(function(json){
    		var jsonData = json.query.results.quote;
    		deferred.resolve(jsonData);
    	})
    	.error(function(error){
    		$log.info('Details data error: ' + error);
    		deferred.reject();
    	});

	    return deferred.promise;
	};

	var getPriceData = function(ticker) {

		var deferred = $q.defer();
		var url = 'http://finance.yahoo.com/webservice/v1/symbols/' + ticker + '/quote?format=json&view=detail';

		$http.get(url)
    	.success(function(json){
    		var jsonData = json.list.resources[0].resource.fields;
    		deferred.resolve(jsonData);
    	})
    	.error(function(error){
    		$log.info('Price data error: ' + error);
    		deferred.reject();
    	});

	    return deferred.promise;  
	};


	return {
		getPriceData: getPriceData,
		getDetailData: getDetailData
	};

});

})();