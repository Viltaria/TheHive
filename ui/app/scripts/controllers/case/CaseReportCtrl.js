(function() {
    'use strict';
    angular.module('theHiveControllers')
        .factory("Mustache", function(NotificationSrv, $window) {
            if (!$window.Mustache) {
                NotificationSrv.error("Error loading mustache.js library");
            }
            return $window.Mustache;
        })
        .controller('CaseReportCtrl', CaseReportCtrl);

        function CaseReportCtrl($uibModal, $uibModalInstance, $http, $q, CaseReportSrv, templates, caze, tasks, observables, templateSelected) {            
            var self = this;


            this.templates = templates;
            this.caze = caze;
            this.tasks = tasks;
            this.observables = observables;
            this.templateSelected = templateSelected;

            this.selectTemplate = function($event, template) {
                angular.forEach(self.templates, function(value, key) {
                    value.selected = false;
                });              
                template.selected = !template.selected;

                self.templateSelected = template.selected ? template : null;
            };

            this.preview = function() {

                var view = {
                    template_name: self.templateSelected.title,
                    template_description: self.templateSelected.description,
                    case_id: self.caze.id,
                    created_at: self.caze.createdAt,
                    start_date: self.caze.startDate,
                    created_by: self.caze.createdBy,
                    case_title: self.caze.title,
                    case_severity: self.caze.severity,
                    case_tlp: self.caze.tlp,
                    case_assignee: self.caze.assignee,
                    case_tags: self.caze.tags,
                    case_description: self.caze.description
                };

                $uibModalInstance.close();
                $uibModal.open({
                        templateUrl: 'views/partials/case/case.report.preview.html',
                        controller: 'CaseReportPreviewCtrl',
                        controllerAs: 'preview',
                        size: '',
                        resolve: {
                            template: function() {
                                return self.templateSelected;
                            },
                            templates: function() {
                                return self.templates;
                            },
                            caze: function() {
                                return self.caze;
                            },
                            observables: function() {
                                return self.observables;
                            },
                            tasks: function() {
                                return self.tasks;
                            },
                            output: function() {
                                return Mustache.render(self.templateSelected.body, view);
                            }
                        }
                    });
            };

            this.download = function() {
                if (self.templateSelected) {
                    this.export(self.templateSelected);
                    $uibModalInstance.close();
                }
            };

            this.export = function() {
                
             };

            this.cancel = function() {
                $uibModalInstance.dismiss();
            };

            this.taskLogs = function(taskId) {
                return CaseReportSrv.taskLogs(taskId);
            };

        }        
})();
