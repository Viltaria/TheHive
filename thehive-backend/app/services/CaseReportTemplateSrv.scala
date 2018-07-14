package services

import javax.inject.{ Inject, Singleton }

import scala.concurrent.{ ExecutionContext, Future }

import akka.NotUsed
import akka.stream.Materializer
import akka.stream.scaladsl.{ Sink, Source }
import models.{ CaseReportTemplate, CaseReportTemplateModel }

import org.elastic4play.NotFoundError
import org.elastic4play.controllers.Fields
import org.elastic4play.database.ModifyConfig
import org.elastic4play.services._

@Singleton
class CaseReportTemplateSrv @Inject() (
    caseReportTemplateModel: CaseReportTemplateModel,
    createSrv: CreateSrv,
    getSrv: GetSrv,
    updateSrv: UpdateSrv,
    deleteSrv: DeleteSrv,
    findSrv: FindSrv,
    implicit val ec: ExecutionContext,
    implicit val mat: Materializer) {

  def create(fields: Fields)(implicit authContext: AuthContext): Future[CaseReportTemplate] =
    createSrv[CaseReportTemplateModel, CaseReportTemplate](caseReportTemplateModel, fields)

  def get(id: String): Future[CaseReportTemplate] =
    getSrv[CaseReportTemplateModel, CaseReportTemplate](caseReportTemplateModel, id)

  def getByName(name: String): Future[CaseReportTemplate] = {
    import org.elastic4play.services.QueryDSL._
    findSrv[CaseReportTemplateModel, CaseReportTemplate](caseReportTemplateModel, "name" ~= name, Some("0-1"), Nil)
      ._1
      .runWith(Sink.headOption)
      .map(_.getOrElse(throw NotFoundError(s"Case report template $name not found")))
  }

  def update(id: String, fields: Fields)(implicit authContext: AuthContext): Future[CaseReportTemplate] =
    update(id, fields, ModifyConfig.default)

  def update(id: String, fields: Fields, modifyConfig: ModifyConfig)(implicit authContext: AuthContext): Future[CaseReportTemplate] =
    updateSrv[CaseReportTemplateModel, CaseReportTemplate](caseReportTemplateModel, id, fields, modifyConfig)

  def delete(id: String)(implicit authContext: AuthContext): Future[Unit] =
    deleteSrv.realDelete[CaseReportTemplateModel, CaseReportTemplate](caseReportTemplateModel, id)

  def find(queryDef: QueryDef, range: Option[String], sortBy: Seq[String]): (Source[CaseReportTemplate, NotUsed], Future[Long]) = {
    findSrv[CaseReportTemplateModel, CaseReportTemplate](caseReportTemplateModel, queryDef, range, sortBy)
  }
}