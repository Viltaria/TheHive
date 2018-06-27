/*(function() {
    'use strict';

    angular.module('theHiveControllers').controller('AdminAutoRefreshIntervalCtrl',
        function($scope) {
          $scope.value = 'Off';
          $scope.$watch('value',
          function(value){
            console.log(value);
          });

          var function(response) {
                    NotificationSrv.error('AdminAutoRefreshIntervalCtrl', response.value);
                });
            };
        })();
*/
