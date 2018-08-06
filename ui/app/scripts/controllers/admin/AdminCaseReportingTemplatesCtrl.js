(function() {
    'use strict';

    angular
        .module('theHiveControllers')
        .controller('AdminCaseReportingTemplatesCtrl', function(
            $scope,
            $parse,
            $uibModal,
            templates,
            CaseReportTemplateSrv,
            NotificationSrv,
            UtilsSrv,
            ModalUtilsSrv
        ) {
            var self = this;

            $scope.initEditor = function(){
                $(".bootstrap-markdown").markdown({
                    iconlibrary: "fa",
                    autofocus: false,
                    saveable: false,
                    onChange: function(event) {
                        //setter(scope, event.getContent());
                        $parse("$vm.template.body").assign($scope, event.getContent())
                    },
                    hiddenButtons: "Image",
                    additionalButtons: [[{
                        name: "groupLink",
                        data: [{
                            name: "Picture",
                            toggle: true,
                            title: "Image",
                            icon: {
                                glyph: 'glyphicon glyphicon-picture',
                                fa: 'fa fa-picture-o',
                                'fa-3': 'icon-picture',
                                'fa-5': 'far fa-image',
                                octicons: 'octicon octicon-file-media'
                            },
                            callback: function(e){
                                // Give ![] surround the selection and prepend the image link
                                var chunk, cursor, selected = e.getSelection(),
                                    content = e.getContent(),
                                    link;

                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    templateUrl: 'views/partials/admin/report-template-image.html',
                                    controller: 'AdminCaseReportingTemplateImageUploadCtrl',
                                    controllerAs: 'vm',
                                    size: ''
                                });

                                modalInstance.result
                                    .then(function(encodedImage) {
                                        // transform selection and set the cursor into chunked text
                                        e.replaceSelection('![](' + encodedImage + ')');
                                        cursor = selected.start + 2;

                                        e.setSelection(cursor, cursor + encodedImage.length);
                                    })
                                    .catch(function(err) {
                                        if (err && err.status) {
                                            NotificationSrv.error('TemplateCtrl', err.data, err.status);
                                        }
                                    });
                                }
                            }
                        ]
                    }]]
                })
            }

            self.templates = templates;

            self.uploadFiles = function(files, errFiles) {
                var newFiles = [];
                angular.forEach(files, function(file) {
                    newFiles.push(_.pick(file), ['lastModified', 'name', 'size', 'filetype']);
                });
                self.template.attachments.concat(newFiles);
            };

           self.newTemplate = function() {
                self.template = {
                    title: '',
                    description: '',
                    body: '',
                    //attachments: [],
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
        .controller('AdminCaseReportingTemplateImageUploadCtrl', function($scope, $uibModalInstance) {
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
                aReader.readAsDataURL(self.formData.attachment, 'UTF-8');
                aReader.onload = function(evt) {
                    $scope.$apply(function() {
                        self.formData.fileContent = aReader.result;
                        $("#base64image").attr("src", self.formData.fileContent)
                        $("#base64image").show()
                    });
                };
                aReader.onerror = function(evt) {
                    $scope.$apply(function() {
                        self.formData.fileContent = "";
                    });
                };
            });

            this.ok = function() {
                $uibModalInstance.close(this.formData.fileContent);
            };

            this.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
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
