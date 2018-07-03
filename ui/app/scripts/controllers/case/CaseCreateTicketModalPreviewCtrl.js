(function() {
    'use strict';

    angular.module('theHiveControllers')
        .controller('CaseCreateTicketModalPreviewCtrl', function(caze, observables, template, $uibModal, $scope, $uibModalInstance, NotificationSrv) {
            var self = this;
            self.template = template;
            self.observables = observables;
            self.caze = caze;

            $scope.previous = function() {
                $uibModalInstance.close();
                $uibModal.open({
                    templateUrl: 'views/partials/case/case.create.ticket.observables.html',
                    controller: 'CaseCreateTicketObservablesModalCtrl',
                    controllerAs: 'coco',
                    size: '',
                    resolve: {
                      template: function() {
                        return self.template;
                      },
                      observables: function() {
                        return self.observables;
                      },
                      caze: function() {
                        return self.caze;
                      }
                    }
                });
            };

            $scope.confirm = function () {
              
                alert("This is a test");
                $uibModalInstance.close();

            };

        });
})();
