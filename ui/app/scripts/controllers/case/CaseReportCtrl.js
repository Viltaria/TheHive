(function() {
    'use strict';
    angular.module('theHiveControllers')
        .controller('CaseReportCtrl', CaseReportCtrl);

        function CaseReportCtrl($uibModalInstance, $http, $q, CaseReportSrv, caze, tasks, observables) {            
            this.caze = caze;
            console.log("CASE");
            console.log(caze);
            
            this.tasks = tasks;
            console.log("TASKS");
            console.log(this.tasks);

            this.observables = observables;
            console.log("OBSERVABLES");
            console.log(observables);

            this.download = function() {
                $uibModalInstance.close();
            };

            this.cancel = function() {
                $uibModalInstance.dismiss();
            };
            this.getTaskLogs = function(taskId) {
                return this.taskLogs(taskId);
            };
            this.taskLogs = function(taskId) {
                return CaseReportSrv.taskLogs(taskId);
            };
        }        
})();
