(function() {
    'use strict';

    angular
        .module('theHiveControllers')
        .controller('AdminCaseReportingTemplatesCtrl', function(
            $scope,
            $uibModal,
            templates
        ) {
            var self = this;

           self.newTemplate = function() {
                self.template = {
                    name: '',
                    content: ''
                };
            };

            self.exportTemplate = function() {
                var fileName = 'Case-Report-Template__' + self.template.name.replace(/\s/gi, '_') + '.json';

                // Create a blob of the data
                var fileToSave = new Blob([angular.toJson(_.omit(self.template, 'id'))], {
                    type: 'application/json',
                    name: fileName
                });

                // Save the file
                saveAs(fileToSave, fileName);
            };
            
            self.importTemplate = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/partials/admin/case-reporting-templates-import.html',
                    controller: 'AdminCaseReportingTemplateImportCtrl',
                    controllerAs: 'vm',
                    size: 'lg'
                });

                modalInstance.result
                    .then(function(template) {
                        return self.createTemplate(template);
                    })
                    .catch(function(err) {
                        if (err && err.status) {
                            NotificationSrv.error('TemplateCtrl', err.data, err.status);
                        }
                    });
            };

        })
        .controller('AdminCaseReportingTemplateTasksCtrl', function($scope, $uibModalInstance) {
                      
         })
        .controller('AdminCaseReportingTemplateImportCtrl', function($scope, $uibModalInstance) {
             var self = this;
            this.formData = {
                fileContent: {}
            };

            $scope.$watch('vm.formData.attachment', function(file) {
                if (!file) {
                    self.formData.fileContent = {};
                    return;
                }
                var aReader = new FileReader();
                aReader.readAsText(self.formData.attachment, 'UTF-8');
                aReader.onload = function(evt) {
                    $scope.$apply(function() {
                        self.formData.fileContent = JSON.parse(aReader.result);
                    });
                };
                aReader.onerror = function(evt) {
                    $scope.$apply(function() {
                        self.formData.fileContent = {};
                    });
                };
            });

            this.ok = function() {
                // var template = _.pick(
                //     this.formData.fileContent,
                //     'name',
                //     'title',
                //     'description',
                //     'tlp',
                //     'severity',
                //     'tags',
                //     'status',
                //     'titlePrefix',
                //     'tasks',
                //     'metrics',
                //     'customFields'
                // );
                $uibModalInstance.close(template);
            };

            this.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        });
})();
