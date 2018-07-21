(function() {
    'use strict';

    angular
        .module('theHiveControllers')
        .controller('AdminCaseReportingTemplatesCtrl', function(
            $scope,
            $uibModal,
            templates,
            CaseReportTemplateSrv,
            NotificationSrv,
            UtilsSrv,
            ModalUtilsSrv
        ) {
            var self = this;

            self.templates = templates;

           self.newTemplate = function() {
                self.template = {
                    title: '',
                    description: '',
                    body: '',
                    variables: [
                        {
                            key: "Template Name",
                            syntax: "template_name"
                        },
                        {
                            key: "Template Description",
                            syntax: "template_description"
                        },
                        {
                            key: "Case ID",
                            syntax: "case_id"
                        },
                        {
                            key: "Created At",
                            syntax: "created_at"
                        },
                        {
                            key: "Start Date",
                            syntax: "start_date"
                        },
                        {
                            key: "Created At",
                            syntax: "created_at"
                        },
                        {
                            key: "Created By",
                            syntax: "created_by"
                        },
                        {
                            key: "Case Title",
                            syntax: "case_title"
                        },
                        {
                            key: "Case Severity",
                            syntax: "case_severity"
                        },
                        {
                            key: "Case TLP",
                            syntax: "case_tlp"
                        },
                        {
                            key: "Case Assignee",
                            syntax: "case_assignee"
                        },
                        {
                            key: "Case Tags",
                            syntax: "case_tags"
                        },
                        {
                            key: "Case Description",
                            syntax: "case_description"
                        }
                    ]
                };
            };
            self.newTemplate();


            self.saveTemplate = function() {
                // Set tags
                // self.template.tags = _.pluck(self.tags, 'text');

                // Set custom fields
                // self.template.customFields = {};
                // _.each(self.templateCustomFields, function(cf, index) {
                //     var fieldDef = self.fields[cf.name];
                //     var value = null;
                //     if (fieldDef) {
                //         value = fieldDef.type === 'date' && cf.value ? moment(cf.value).valueOf() : cf.value || null;
                //     }

                //     self.template.customFields[cf.name] = {};
                //     self.template.customFields[cf.name][fieldDef ? fieldDef.type : cf.type] = value;
                //     self.template.customFields[cf.name].order = index + 1;
                // });

                // self.template.metrics = {};
                // _.each(self.templateMetrics, function(value, index) {
                //     var fieldDef = self.fields[value];

                //     self.template.metrics[value.metric] = value.value;
                // });
                if (_.isEmpty(self.template.id)) {
                    self.createTemplate(self.template);
                } else {
                    self.updateTemplate(self.template);
                }
            };

            self.exportTemplate = function() {
                var fileName = 'Case-Report-Template__' + self.template.title.replace(/\s/gi, '_') + '.json';

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

            self.createTemplate = function(template) {
                console.log(template);
                return CaseReportTemplateSrv.create(template).then(
                    function(response) {
                        self.getList(response.data.id);

                        $scope.$emit('templates:refresh');

                        NotificationSrv.log('The template [' + template.title + '] has been successfully created', 'success');
                    },
                    function(response) {
                        NotificationSrv.error('TemplateCtrl', response.data, response.status);
                    }
                );
            };

            self.updateTemplate = function(template) {
                return CaseReportTemplateSrv.update(template.id, _.omit(template, 'id', 'user')).then(
                    function(response) {
                        self.getList(template.id);

                        $scope.$emit('templates:refresh');

                        NotificationSrv.log('The template [' + template.title + '] has been successfully updated', 'success');
                    },
                    function(response) {
                        NotificationSrv.error('TemplateCtrl', response.data, response.status);
                    }
                );
            };

            self.getList = function(id) {
                CaseReportTemplateSrv.list().then(function(templates) {
                    self.templates = templates;

                    if (templates.length === 0) {
                        self.templateIndex = 0;
                        self.newTemplate();
                    } else if (id) {
                        self.loadTemplateById(id);
                    } else {
                        self.loadTemplateById(templates[0].id, 0);
                    }
                });
            };

            self.loadTemplateById = function(id) {
                CaseReportTemplateSrv.get(id).then(function(template) {
                    self.loadTemplate(template);
                });
            };

            self.loadTemplate = function(template, index) {
                if (!template) {
                    return;
                }

                var filteredKeys = _.filter(_.keys(template), function(k) {
                    return k.startsWith('_');
                }).concat(['createdAt', 'updatedAt', 'createdBy', 'updatedBy']);

                self.template = _.omit(template, filteredKeys);
                // self.tags = UtilsSrv.objectify(self.template.tags, 'text');
                // self.templateCustomFields = getTemplateCustomFields(template.customFields);
                // self.templateMetrics = getTemplateMetrics(template.metrics);

                self.templateIndex = index || _.indexOf(self.templates, _.findWhere(self.templates, { id: template.id }));
            };

            self.deleteTemplate = function() {
                ModalUtilsSrv.confirm('Remove case template', 'Are you sure you want to delete this case template?', {
                    okText: 'Yes, remove it',
                    flavor: 'danger'
                })
                .then(function() {
                    return CaseReportTemplateSrv.delete(self.template.id);
                })
                .then(function() {
                    self.getList();

                    $scope.$emit('templates:refresh');
                });
            };

            // self.editVariable = function(variable) {
            //     var modal = $uibModal.open({
            //         scope: $scope,
            //         templateUrl:
            //             "views/partials/admin/report-templates.observables.html",
            //         controller: "AdminTicketTemplateObservablesCtrl",
            //         size: "lg",
            //         resolve: {
            //             variable: function() {
            //                 return _.extend({}, variable);
            //             }
            //         }
            //     });

            //     modal.result.then(function(data) {
            //         console.log("updating variable")
            //         console.log(data)
            //         console.log(self.template.variables)

            //         for (var i = 0; i < self.template.variables.length; i++)
            //             if(self.template.variables[i].name === data.name)
            //                 self.template.variables[i] = _.extend({}, data);

            //         self.groupedVariables = TicketTemplateSrv.groupVariables(self.template.variables)
            //     });
            // };

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
                var template = _.pick(
                    this.formData.fileContent,
                    'title',
                    'description',
                    'body'
                );
                $uibModalInstance.close(template);
            };

            this.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        });
})();
