(function() {
    'use strict';
    angular.module('theHiveServices')
        .service('CaseReportSrv', function($http, $q) {
            this.taskLogs = function(taskId) {
                var defer = $q.defer();

                $http.get("./api/case/task/" + taskId + "/log")
                .then(function(response) {
                    defer.resolve(response.data);
                }, function (err) {
                    defer.reject(err);
                });
                return defer.promise;
            };
        });
})();
