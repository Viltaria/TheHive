(function() {
    'use strict';

    angular
        .module('theHiveControllers')
        .controller('DashboardImportCtrl', function($scope, $uibModalInstance) {
            var self = this;
            this.formData = {
                fileContent: {}
            };

            $scope.$watch('vm.formData.attachment', function(file) {
                if(!file) {
                    self.formData.fileContent = {};
                    return;
                }
                var aReader = new FileReader();
                aReader.readAsText(self.formData.attachment, 'UTF-8');
                aReader.onload = function (evt) {
                    $scope.$apply(function() {
                        self.formData.fileContent = JSON.parse(aReader.result);
                    });
                }
                aReader.onerror = function (evt) {
                    $scope.$apply(function() {
                        self.formData.fileContent = {};
                    });
                }
            });

            this.ok = function () {
                var dashboard = _.pick(this.formData.fileContent, 'title', 'description', 'status');
                dashboard.definition = JSON.stringify(this.formData.fileContent.definition || {});

                $uibModalInstance.close(dashboard);
            };

            this.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
        .controller('DashboardModalCtrl', function($rootScope, $interval, DashboardSrv, $uibModalInstance, $state, $scope, statuses, dashboard) {
            this.dashboard = dashboard;
            this.statuses = statuses;

            this.cancel = function() {
                $uibModalInstance.dismiss();
            };

            this.closeWindow = function(){
              $uibModalInstance.close();
            };

            this.setInterval = function(value){

                $interval(function(){
                  $scope.$broadcast('refresh-charts');
                  console.log(value);
                }, value);


            };

            this.cancelInterval = function (value) {
              var intervalPromise = $interval(function () {
               }, 5000);
              $scope.$on('$destroy', function () {
                $interval.cancel(intervalPromise);
              })
            };

            this.ok = function() {
                return $uibModalInstance.close(dashboard);
            };
        })
        .controller('DashboardsCtrl', function($scope, $state, $uibModal, PSearchSrv, ModalUtilsSrv, NotificationSrv, DashboardSrv, AuthenticationSrv) {
            this.dashboards = [];
            var self = this;

            this.load = function() {
                DashboardSrv.list().then(function(response) {
                    self.dashboards = response.data;
                }, function(err){
                    NotificationSrv.error('DashboardsCtrl', err.data, err.status);
                });
            };

            this.load();

            this.openDashboardModal = function(dashboard) {
                return $uibModal.open({
                    templateUrl: 'views/partials/dashboard/create.dialog.html',
                    controller: 'DashboardModalCtrl',
                    controllerAs: '$vm',
                    size: 'lg',
                    resolve: {
                        statuses: function() {
                            return ['Private', 'Shared'];
                        },
                        dashboard: function() {
                            return dashboard;
                        }
                    }
                });
            };

            this.addDashboard = function() {
                var modalInstance = this.openDashboardModal({
                    title: null,
                    description: null,
                    status: 'Private',
                    definition: JSON.stringify(DashboardSrv.defaultDashboard)
                });

                modalInstance.result
                    .then(function(dashboard) {
                        return DashboardSrv.create(dashboard);
                    })
                    .then(function(response) {
                        $state.go('app.dashboards-view', {id: response.data.id});

                        NotificationSrv.log('The dashboard has been successfully created', 'success');
                    })
                    .catch(function(err) {
                        if (err && err.status) {
                            NotificationSrv.error('DashboardsCtrl', err.data, err.status);
                        }
                    });
            };

            this.duplicateDashboard = function(dashboard) {
                var copy = _.pick(dashboard, 'title', 'description', 'status', 'definition');
                copy.title = 'Copy of ' + copy.title;

                this.openDashboardModal(copy)
                    .result.then(function(dashboard) {
                        return DashboardSrv.create(dashboard);
                    })
                    .then(function(response) {
                        $state.go('app.dashboards-view', {id: response.data.id});

                        NotificationSrv.log('The dashboard has been successfully created', 'success');
                    })
                    .catch(function(err) {
                        if (err && err.status) {
                            NotificationSrv.error('DashboardsCtrl', err.data, err.status);
                        }
                    });
            };

            this.editDashboard = function(dashboard) {
                var copy = _.extend({}, dashboard);

                this.openDashboardModal(copy).result.then(function(dashboard) {
                    return DashboardSrv.update(dashboard.id, _.omit(dashboard, 'id'));
                })
                .then(function(response) {
                    self.load()

                    NotificationSrv.log('The dashboard has been successfully updated', 'success');
                })
                .catch(function(err) {
                    if (err && err.status) {
                        NotificationSrv.error('DashboardsCtrl', err.data, err.status);
                    }
                });
            };

            this.deleteDashboard = function(id) {
                ModalUtilsSrv.confirm('Remove dashboard', 'Are you sure you want to remove this dashboard', {
                    okText: 'Yes, remove it',
                    flavor: 'danger'
                })
                    .then(function() {
                        return DashboardSrv.remove(id);
                    })
                    .then(function(response) {
                        self.load();

                        NotificationSrv.log('The dashboard has been successfully removed', 'success');
                    });
            };

            this.exportDashboard = function(dashboard) {
                DashboardSrv.exportDashboard(dashboard);
            }

            this.importDashboard = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/partials/dashboard/import.dialog.html',
                    controller: 'DashboardImportCtrl',
                    controllerAs: 'vm',
                    size: 'lg'
                });

                modalInstance.result.then(function(dashboard) {
                    return DashboardSrv.create(dashboard);
                })
                .then(function(response) {
                    $state.go('app.dashboards-view', {id: response.data.id});

                    NotificationSrv.log('The dashboard has been successfully imported', 'success');
                })
                .catch(function(err) {
                    if (err && err.status) {
                        NotificationSrv.error('DashboardsCtrl', err.data, err.status);
                    }
                });
            }
        });
})();
