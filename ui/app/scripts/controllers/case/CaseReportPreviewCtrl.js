(function() {
    'use strict';

    angular.module('theHiveControllers')
        .factory("Mustache", function(NotificationSrv, $window) {
            if (!$window.Mustache) {
                NotificationSrv.error("Error loading mustache.js library");
            }
            return $window.Mustache;
        })
        .controller('CaseReportPreviewCtrl', function($uibModal, $scope, $uibModalInstance, NotificationSrv, templates, caze, tasks, observables, template, output) {
            var self = this;

            self.templates = templates;
            self.caze = caze;
            self.tasks = tasks;
            self.observables = observables;
            self.template = template;
            self.output = output;

            self.previous = function() {
                $uibModalInstance.close();
                $uibModal.open({
                    templateUrl: 'views/partials/case/case.report.html',
                    controller: 'CaseReportCtrl',
                    controllerAs: 'report',
                    size: '',
                    resolve: {
                        templates: function() {
                            return self.templates;
                        },
                        caze: function() {
                            return self.caze;
                        },
                        tasks: function() {
                            return self.tasks;
                        },
                        observables: function() {                          
                            return self.observables;
                        },
                        templateSelected: function() {
                            return self.template;
                        }
                    }
                });
            };

            self.confirm = function () {
                var converter = new showdown.Converter();
                var html = converter.makeHtml(self.output); 
                var pdf = new jsPDF('p', 'pt', 'letter');  
                pdf.fromHTML(html, 10, 10, {
                }, function(dispose){
                    console.log("TEST")
                    console.log(dispose)
                    pdf.save(self.template.title);
                }); // HTML string or DOM elem ref.  

                $uibModalInstance.close();
            };

        });
})();
