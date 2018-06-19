(function () {
	'use strict';

	angular
		.module('theHiveControllers')
		.value('observables', {})
		.value('templates', {})
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
			observables,
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

			self.observables = observables;

			self.templates = templates;
			self.addObservables = function() {
				var order = self.observables ? self.observables : 0;

				self.openObservableDialog({order: order}, "Add");
			};

			self.updateVariables = function() {
				try {
					var parseTree = Mustache.parse(self.template.body);
				}
				catch {
					return;
				}

				console.log(parseTree);
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
				
				for(int i=0;i<parseTree.length;i++){
					if(parseTree[i] == '#') {
						for(int j=0;j<parseTree[i][4].length;j++)
							if(parseTree[i][4][j][0] == 'name')
								self.template.observables.push({'name':parseTree[i][4][0][j], 'array':true});
					}
					else if(parseTree[i] == 'name')
						self.template.observables.push({'name':parseTree[i], 'array':false});
				}
				
			};

			self.editVariable = function(variable) {
			};

			self.removeVariable = function(variable) {
				console.log(variable);
			};

			self.openObservableDialog = function(obsv, action) {
				var modal = $uibModal.open({
					scope: $scope,
					templateUrl: 'views/partials/admin/remedy-templates.observables.html',
					controller: 'AdminRemedyTemplateObservablesCtrl',
					size: 'lg',
					resolve: {
						action: function() {
							return action;
						},
						obsv: function() {
							return _.extend({}, obsv);
						},
						users: function() {
							return UserSrv.list({ status: 'Ok' });
						}
					}
				});

				modal.result.then(function(data) {
					if (action === 'Add') {
						if (self.template.observables) {
							self.template.observables.push(data);
						} else {
							self.template.observables = [data];
						}
					} else {
						self.template.observables[data.order] = data;
					}
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
		.controller('AdminRemedyTemplateObservablesCtrl', function($scope, $uibModalInstance, action, observables, users) {
            $scope.obsv = observables || {};
            $scope.action = action;
            $scope.users = users;

            $scope.cancel = function() {
                $uibModalInstance.dismiss();
            };

            $scope.addTask = function() {
                $uibModalInstance.close(obsv);
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
