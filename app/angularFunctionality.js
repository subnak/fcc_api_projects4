var app = angular.module("mainModule",[]);

app.controller("SplashController",['$http', function($http){
    var topScope=this;
    this.testVar=14;
    this.baseUrl=window.location.href;
    this.encodedUrl=this.baseUrl.split('https://fcc-api-projects-4-subnak.c9users.io/')[1];
    this.decodedUrl=decodeURIComponent(this.encodedUrl)
    this.searchTerm=this.decodedUrl.split("?")[0];
    this.searchResults=[];
    
    function hndlr(response) {
        //   console.log(JSON.stringify(response));
      for (var i = 0; i < 1; i++) {
        var item = response.items[i];
        console.log(item);
        // in production code, item.htmlTitle should have the HTML entities escaped.
        // document.getElementById("content").innerHTML += "<br>" + JSON.stringify(item);
      }
    }
    
    this.init = function init(){
        console.log("search term: "+this.searchTerm);
        $http({
          method: 'GET',
          url: 'https://www.googleapis.com/customsearch/v1?parameters',
          params: {key:"AIzaSyAcw73Xc7pZJIGHhCoqmXsUmrbH3fZZh7E",cx:"015945500812735874842:cpb5dbxlcg0",q:this.searchTerm,searchType:"image"}
        }).then(function successCallback(response) {
            for(var i=0;i<response.data.items.length;i++){
                var currentItem=response.data.items[i];
                // how to get the titles out
                // console.log(currentItem.title);
                // how to get the image link out
                // console.log(currentItem.link);
                // how to get the webpage link out
                // console.log(currentItem.image.contextLink);
                var responseObject={pageTitle:currentItem.title,imageLink:currentItem.link,pageLink:currentItem.image.contextLink}
                topScope.searchResults.push(responseObject);
            }
            $http.post('/:search',{searchTerm:topScope.searchTerm}).then(function successCallback(response){
                console.log("saved a record of the search: "+topScope.searchTerm);
            }),(function failureCallback(response){
                console.log(response);
            });
          }, function errorCallback(response) {
              console.log(JSON.stringify(response));
            // called asynchronously if an error occurs
            // or server returns response with an error status.
          });
        }
}]);

app.controller("SearchController",['$http',function($http){
    this.testVar=123;
    this.savedSearches=[];
    
    this.init = function init(savedSearches){
        this.savedSearches=JSON.parse(savedSearches);
    }
    
}]);