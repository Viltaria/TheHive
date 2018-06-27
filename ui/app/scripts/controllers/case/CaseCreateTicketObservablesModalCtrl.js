(function() {
    'use strict';

    angular.module('theHiveControllers')
        .controller('CaseCreateTicketObservablesModalCtrl', function($uibModal, observables, template, $scope, $uibModalInstance, NotificationSrv) {
            var self = this;
            self.template = template;
            // self.observables = observables;

            self.observables = [
              {
                name: 'coconut',
                type: 'domain'
              },
              {
                name: 'cherry',
                type: 'domain',
              },
              {
                name: 'watermelon',
                type: 'ip'
              },
              {
                name: 'milktea',
                type: 'ip'
              },
              {
                name: 'raspberry',
                type: 'file'
              }
            ]

            self.updateSelection = function (index) {
              if (self.observables[index].selected == undefined) {
                self.observables[index].selected = true;
              } else {
                self.observables[index].selected = !self.observables[index].selected;
              }
            }

            $scope.previous = function() {
                $uibModalInstance.close();
                $uibModal.open({
                    templateUrl: 'views/partials/case/case.create.ticket.html',
                    controller: 'CaseCreateTicketModalCtrl',
                    controllerAs: 'ticket',
                    size: '',
                    resolve: {
                      templateSelected: function() {
                        return self.template;
                      }
                    }
                });
            };

            $scope.preview = function() {
                $uibModalInstance.close();
                $uibModal.open({
                    templateUrl: 'views/partials/case/case.create.ticket.preview.html',
                    controller: 'CaseCreateTicketModalPreviewCtrl',
                    controllerAs: 'preview',
                    size: '',
                    resolve: {

                    }
                });
            };
        });
})();
