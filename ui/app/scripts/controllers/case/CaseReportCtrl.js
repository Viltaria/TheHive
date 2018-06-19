(function() {
    'use strict';
    angular.module('theHiveControllers')
        .controller('CaseReportCtrl', CaseReportCtrl);

        function CaseReportCtrl($uibModalInstance, caze, tasks, observables) {
            var self = this;
            
            this.caze = caze;
            console.log("CASE");
            console.log(caze);
            this.tasks = tasks;
            console.log("TASKS");
            console.log(tasks);
            this.observables = observables;
            console.log("OBSERVABLES");
            console.log(observables);

            this.download = function() {
                $uibModalInstance.close();
            };

            this.cancel = function() {
                $uibModalInstance.dismiss();
            };
        }        
})();
