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
              console.log(markdownpdf);
              markdownpdf().from.string(output).to("test.pdf");
              // var converter = new showdown.Converter();
              // var html = converter.makeHtml(output); 
              // // pdfMake.createPdf({
              // //   content: html
              // // }).download();
              // // pdf.create(html)
              // // html2pdf(html);
              // htmlToPdf.convertHTMLString(html, '', function(error, success) {
              //   console.log(error);
              // });
              $uibModalInstance.close();
            };

        });
})();
