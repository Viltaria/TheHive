(function() {
    'use strict';

    angular.module('theHiveControllers')
        .controller('CaseCreateTicketModalCtrl', function(caze, templateSelected, $timeout, $http, $q, $uibModal, $scope, $uibModalInstance, NotificationSrv) {
            var self = this;
            self.templateSelected = templateSelected;
            self.caze = caze;

            self.templates = [
              {
                title: "Template 1",
                description: "Amaze"
              },
              {
                title: "Template 2",
                description: "Not all birds can fly"
              }
            ];

            angular.forEach(self.templates, function(subscription, index) {
              //change to id later
                if(templateSelected.title == subscription.title) {
                  subscription.selected = true;
                }
            });

            self.updateSelection = function(position) {
              angular.forEach(self.templates, function(subscription, index) {
                if (position != index) {
                  subscription.selected = false;
                } else {
                  subscription.selected = !subscription.selected;
                  if (subscription.selected) {
                    self.templateSelected = subscription;
                  } else {
                    self.templateSelected = false;
                  }
                }
              });
            };

            self.sortableOptions = {
                handle: '.drag-handle',
                stop: function(/*e, ui*/) {
                    self.reorderTasks();
                },
                axis: 'y'
            };
            self.reorderTasks = function() {
                _.each(self.templates, function(template, index) {
                    template.order = index;
                });
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss();
            };

            $scope.next = function() {
                $uibModalInstance.close();
                $uibModal.open({
                    templateUrl: 'views/partials/case/case.create.ticket.observables.html',
                    controller: 'CaseCreateTicketObservablesModalCtrl',
                    controllerAs: 'coco',
                    size: '',
                    resolve: {
                        caze: function() {
                          return self.caze;
                        },
                        template: function() {
                           var t;
                            angular.forEach(self.templates, function(template, index) {
                                if (template.selected) {
                                  t = template;
                                }
                            });
                            return t;
                        },
                        observables: function() {
                            var t;
                            angular.forEach(self.templates, function(template, index) {
                                if (template.selected) t = template;
                            });
                            var defer = $q.defer();
                            $http.post('./api/case/artifact/_search', {
                              query: {
                                "_parent": {
                                  "_type": "case",
                                  "_query": {
                                    "_id": t.id,
                                  }
                                }
                              },
                              range: "all"
                            }).then(function(response) {
                              defer.resolve(response.data);
                            }, function (err) {
                              defer.reject(err);
                            });
                          return defer.promise;
                        }
                    }
                });
            };
        });
})();
