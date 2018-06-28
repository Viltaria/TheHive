(function () {
	'use strict';

	angular
		.module('theHiveControllers')
		.factory('Mustache', function(NotificationSrv, $window) {
			if(!$window.Mustache){
				NotificationSrv.error('Error loading mustache.js library');
			}
			return $window.Mustache;
		})
		.controller('AdminRemedyTemplatesCtrl', function(
			$scope,
			$uibModal,
			RemedyTemplateSrv,
			//NotificationSrv,
			//UtilsSrv,
			//ListsSrv,
			//MetricsCacheSrv,
			//CustomFieldsCacheSrv,
			UserSrv,
			//UserInfoSrv,
			//ModalUtilsSrv,
			templates
			//fields
		) {
			var self = this;

			self.variables = [];
			self.templates = templates;
			self.template = {};
			self.lastParseTree = [];

			console.log(templates)

			self.updateVariables = function() {
				try {
					var parseTree = Mustache.parse(self.template.body).
					filter(function(variable) { return variable[0] === 'name'; }).
					map(function(variable) { return {name:variable[1]}; });
				}
				catch(err) {
					return;
				}

				console.log(parseTree);
				self.template.variables = parseTree;

				/*var variableList = parseTree.reduce(function flattenVariablesFromParseTree(acc, v){
					if(v[0] === 'name'){
					  return acc.concat([v]);
					} else if (v[0] === '#') {
					  return acc.concat(v[4].reduce(flattenVariablesFromParseTree, []));
					} else {
					  return acc;
					}
				  }, [])
				  .map(function(v){ return v[1]; });
				console.log(variableList);

				for(int i=0;i<variableList.length;i++){
					self.template.observables.push({'name':variableList[i]});
				}*/
				
				/*for(var i=0;i<parseTree.length;i++){
					if(parseTree[i] == '#') {
						for(var j=0;j<parseTree[i][4].length;j++)
							if(parseTree[i][4][j][0] == 'name')
								self.variables.push({'name':parseTree[i][4][0][j], 'array':true});
					}
					else if(parseTree[i] == 'name')
						self.variables.push({'name':parseTree[i], 'array':false});
				}*/
				
			};

			self.editVariable = function(variable, index) {
				var modal = $uibModal.open({
					scope: $scope,
					templateUrl: 'views/partials/admin/remedy-templates.observables.html',
					controller: 'AdminRemedyTemplateObservablesCtrl',
					size: 'lg',
					resolve: {
						variable: function() {
							return _.extend({}, variable);
						}
					}
				});

				modal.result.then(function(data) {
					self.template.variables[index] = data
				});
			};

            self.importTemplate = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/partials/admin/remedy-template/import.html',
                    controller: 'AdminRemedyTemplateImportCtrl',
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
		.controller('AdminRemedyTemplateObservablesCtrl', function($scope, $uibModalInstance, variable) {
						$scope.variable = Object.assign(variable);

            $scope.cancel = function() {
								console.log($scope);
                $uibModalInstance.dismiss();
            };

            $scope.save = function() {
                $uibModalInstance.close(variable);
            };
		})

		.controller('AdminRemedyTemplateImportCtrl', function($scope, $uibModalInstance) {
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
                    'name',
                    'title',
                    'description',
                    'tlp',
                    'severity',
                    'tags',
                    'status',
                    'titlePrefix',
                    'tasks',
                    'metrics',
                    'customFields'
                );
                $uibModalInstance.close(template);
            };

            this.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
		});
})();
