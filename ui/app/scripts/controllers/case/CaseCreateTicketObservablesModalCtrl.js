(function() {
    'use strict';

    angular.module('theHiveControllers')
        .controller('CaseCreateTicketObservablesModalCtrl', function(caze, $uibModal, observables, template, $scope, $uibModalInstance, NotificationSrv) {
            var self = this;
            self.template = template;
            self.caze = caze;
            self.observables = observables;
        
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
                      caze: function() {
                        return self.caze;
                      },
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
                      caze: function() {
                        return self.caze;
                      },
                      template: function() {
                        return self.template;
                      },
                      observables: function() {
                        var o = [];
                        angular.forEach(self.observables, function(subscription, index) {
                          if (subscription.selected) {
                            o.push(subscription);
                          }
                        });
                        return o;
                      }
                    }
                });
            };
        });
})();
