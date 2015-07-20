var app = angular.module('main', ['ngRoute','ngTable']);
 
app.config(['$routeProvider', function ($routeProvider) 
{
    $routeProvider.when('/pagination', {
      templateUrl : "templates/pagination.html",
     controller : "paginationCtrl"
    })
    .when('/edit', {
      templateUrl : "templates/edit.html",
     controller : "editCtrl"
    })
    .otherwise({ redirectTo : "/pagination"});
}]);
 
app.service('dataService', ['$http', '$q', function($http, $q)
{
    var obj = {},
    deferred = $q.defer(),
    apiUrl = "http://localhost/php/slimrest/books";
    obj.get = function()
    {
        $http.get(apiUrl)
        .success(function(data, status, headers, config) 
        {
            deferred.resolve(data, status, headers, config);
        })
        .error(function(data, status, headers, config) 
        {
            deferred.reject(data, status, headers, config);
        });
        return deferred.promise;
    }  
    return obj;
}]);
 
app.controller('paginationCtrl', function($scope, ngTableParams, dataService) 
{
  dataService.get().then(function(results)
  {
      $scope.tableParams = new ngTableParams(
          {
              page: 1,          // primera página a mostrar
              count: 2          // registros por página
          }, 
          {
              total: results.length, // resultados en total
              getData: function($defer, params) 
              {
                $defer.resolve(results.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
          }
      );
  });
});
 
 
app.controller('editCtrl', function($scope, ngTableParams, dataService) 
{
    dataService.get().then(function(results)
    {
        $scope.tableParams = new ngTableParams({
            page: 1,          // primera página a mostrar
            count: 2          // registros por página
        }, {
            total: results.length, // resultados en total
            getData: function($defer, params) 
            {
                $defer.resolve(results.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
 
    //aquí podemos actualizar el libro
    $scope.save = function(book)
    {
        console.log(book);
    }
});