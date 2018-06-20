(function() {
    'use strict';
    angular.module('theHiveServices')
        .service('CaseReportSrv', function($http, $q) {
            this.taskLogs = function(taskId) {
                var defer = $q.defer();

                $http .get("./api/case/task/" + taskId + "/log")
                .then(function(response) {
                    console.log("LOGS");
                    console.log(response.data);
                    defer.resolve(response.data);
                }, function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            };
        });
})();
