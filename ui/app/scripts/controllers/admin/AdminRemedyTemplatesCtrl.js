(function() {
    "use strict";

    angular
        .module("theHiveControllers")
        .factory("Mustache", function(NotificationSrv, $window) {
            if (!$window.Mustache) {
                NotificationSrv.error("Error loading mustache.js library");
            }
            return $window.Mustache;
        })
        .controller("AdminRemedyTemplatesCtrl", function(
            $scope,
            $uibModal,
            RemedyTemplateSrv,
            NotificationSrv,
            UserSrv,
            templates
        ) {
            var self = this;

            self.newTemplate = function() {
                self.template = { id: -1, variables: [], valid: true };
            };
            self.newTemplate();

            self.templates = templates;
            self.savedVariables = [];
            self.groupedVariables = [];

            self.validateTemplate = function(parseTree){
                // TODO: move to a service
                try{
                    var groups = parseTree.filter(function(v){return v[0] === "#"})

                    // check for nested groups
                    if(groups.some(function(g){return g[4].some(function(v){return v[0] === "#"})}))
                        return false;

                    // check for group vars that aren't in the correct group
                    if(groups.some(function(g){
                        return g[4].filter(function(v){return v[0] === "name"}).some(function(v){
                            if(v[1].includes('.')) {
                                var parts = v[1].split('.')
                                if(parts[0] !== g[1])
                                    return true;
                                if(parts.length !== 2)
                                    return true;
                                if(parts[1].length === 0)
                                    return true;
                            }
                            return false;
                        });
                    }))
                        return false;

                    // check for group vars that aren't in any group
                    if(parseTree.filter(function(v){return v[0] === "name"}).some(function(v){return v[1].includes(".")}))
                        return false;

                    return true;
                } catch (err) {
                    return false
                }
            }

            self.groupVariables = function() {
                var globalVars = self.template.variables.filter(function(v){ return !v.name.includes(".") })
                var groupVars = self.template.variables.filter(function(v){ return v.name.includes(".") })
                var groups = _.uniq(groupVars.map(function(v){return v.name.split(".")[0]}))

                groupVars = groups.map(function(g){
                    return {name:g, group:true, variables: groupVars.filter(function(v){ return v.name.split(".")[0] === g})}
                })
                
                globalVars.forEach(function(v){v.group=false})

                return groupVars.concat(globalVars)
            };

            self.updateVariables = function() {
                var isNew = function(name) {
                    return !self.template.variables.some(function(x) {
                        return x.name == name;
                    });
                };

                var addToVars = function(name) {
                    if (
                        self.savedVariables.some(function(x) {
                            return x.name === name;
                        })
                    )
                        self.template.variables.push(
                            self.savedVariables.filter(function(x) {
                                return x.name === name;
                            })[0]
                        );
                    else self.template.variables.push({ name: name });
                };

                try {
                    var parseTree = Mustache.parse(self.template.body)
                } catch (err) {
                    self.template.valid = false
                    return;
                }

                if((self.template.valid = self.validateTemplate(parseTree)) == false)
                    return

                // get vars that aren't in a group
                var parsedVariablesLayerOne = parseTree.filter(function(variable) {
                        return variable[0] === "name";
                    })
                    .map(function(v) {
                        return v[1];
                    });

                // get vars that are in a group
                var parsedVariablesLayerTwo = parseTree.filter(function(v){ return v[0] === "#" }).
                    map(function(v){return v[4]}).reduce(function(acc,val) {return acc.concat(val)}, []).
                    filter(function(v){return v[0] === "name"}).map(function(v){return v[1]})

                var parsedVariables = parsedVariablesLayerOne.concat(parsedVariablesLayerTwo)

                // add new variables
                parsedVariables.filter(isNew).forEach(addToVars);

                // save old variables
                self.savedVariables = self.savedVariables.filter(isNew).concat(
                    self.template.variables.filter(function(v) {
                        return !parsedVariables.includes(v.name);
                    })
                );

                // remove old variables
                self.template.variables = self.template.variables.filter(
                    function(v) {
                        return parsedVariables.includes(v.name);
                    }
                );

                self.groupedVariables = self.groupVariables()
                console.log(self.groupedVariables)
            };

            self.sortableOptions = {
                handle: '.drag-handle',
                /*stop: function() {
                    self.reorderTasks();
                },*/
                axis: 'y'
            };

            self.saveTemplate = function() {
                alert("not implemented");
                if(self.template.id === -1)
                    self.createTemplate(self.template)
                else
                    self.updateTemplate(self.template)
            };

            self.createTemplate = function(template) {
                return RemedyTemplateSrv.create(template).then(
                    function(response) {
                        self.getList(response.data.id);

                        $scope.$emit('templates:refresh');

                        NotificationSrv.log('The template [' + template.name + '] has been successfully created', 'success');
                    },
                    function(response) {
                        NotificationSrv.error('TemplateCtrl', response.data, response.status);
                    }
                );
            };

            self.updateTemplate = function(template) {
                console.log(template)
                return RemedyTemplateSrv.update(template.id, _.omit(template, 'id', 'user')).then(
                    function(response) {
                        self.getList(template.id);

                        $scope.$emit('templates:refresh');

                        NotificationSrv.log('The template [' + template.name + '] has been successfully updated', 'success');
                    },
                    function(response) {
                        NotificationSrv.error('TemplateCtrl', response.data, response.status);
                    }
                );
            };

            self.getList = function(id) {
                RemedyTemplateSrv.list().then(function(templates) {
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

            self.loadTemplate = function(template) {
                self.template = template;
                self.savedVariables = [];
                self.updateVariables()
            };

            self.saveAs = function(data, filename){
                var element = document.createElement("a");
                element.setAttribute(
                    "href",
                    "data:text/plain;charset=utf-8," +
                        encodeURIComponent(data)
                );
                element.setAttribute("download", filename);

                element.style.display = "none";
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            };

            self.exportTemplate = function() {
                var fileName = "TicketTemplate_"+self.template.name.replace(/\s/gi, '_')+".json"
                self.saveAs(angular.toJson(self.template), fileName)
            }


            self.editVariable = function(variable) {
                var modal = $uibModal.open({
                    scope: $scope,
                    templateUrl:
                        "views/partials/admin/remedy-templates.observables.html",
                    controller: "AdminRemedyTemplateObservablesCtrl",
                    size: "lg",
                    resolve: {
                        variable: function() {
                            return _.extend({}, variable);
                        }
                    }
                });

                modal.result.then(function(data) {
                    for (var i = 0; i < self.template.variables.length; i++)
                        if(self.template.variables[i].name === data.name)
                            self.template.variables[i] = _.omit(data, 'group');

                    self.groupedVariables = self.groupVariables()
                });
            };

            self.importTemplate = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl:
                        "views/partials/admin/remedy-template/import.html",
                    controller: "AdminRemedyTemplateImportCtrl",
                    controllerAs: "vm",
                    size: "lg"
                });

                modalInstance.result
                    .then(function(template) {
                        self.loadTemplate(template)
                    })
                    .catch(function(err) {
                        if (err && err.status) {
                            NotificationSrv.error(
                                "TemplateCtrl",
                                err.data,
                                err.status
                            );
                        }
                    });
            };
        })
        .controller("AdminRemedyTemplateObservablesCtrl", function(
            $scope,
            $uibModalInstance,
            ListSrv,
            variable
        ) {
            $scope.getDataTypeList = function() {
                ListSrv.query(
                    {
                        listId: "list_artifactDataType"
                    },
                    function(data) {
                        $scope.types = _.filter(
                            _.values(data),
                            _.isString
                        ).sort();
                        $scope.types.unshift("any");
                    },
                    function(response) {
                        NotificationSrv.error(
                            "ObservableCreationCtrl",
                            response.data,
                            response.status
                        );
                    }
                );
            };
            $scope.getDataTypeList();
            $scope.variable = variable;
            console.log(variable)

            $scope.selectDataType = function(dataType) {
                $scope.variable.dataType = dataType;
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss();
            };

            $scope.save = function() {
                $uibModalInstance.close(variable);
            };
        })

        .controller("AdminRemedyTemplateImportCtrl", function(
            $scope,
            $uibModalInstance
        ) {
            var self = this;
            this.formData = {
                fileContent: {}
            };

            $scope.$watch("vm.formData.attachment", function(file) {
                if (!file) {
                    self.formData.fileContent = {};
                    return;
                }
                var aReader = new FileReader();
                aReader.readAsText(self.formData.attachment, "UTF-8");
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
                    "name",
                    "description",
                    "body",
                    "variables"
                );
                $uibModalInstance.close(template);
            };

            this.cancel = function() {
                $uibModalInstance.dismiss("cancel");
            };
        });
})();
