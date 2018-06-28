package services

import javax.inject.{ Inject, Singleton }

import scala.concurrent.{ ExecutionContext, Future }

import akka.NotUsed
import akka.stream.Materializer
import akka.stream.scaladsl.{ Sink, Source }
import models.{ RemedyTemplate, RemedyTemplateModel }

import org.elastic4play.NotFoundError
import org.elastic4play.controllers.Fields
import org.elastic4play.database.ModifyConfig
import org.elastic4play.services._

@Singleton
class RemedyTemplateSrv @Inject() (
    remedyTemplateModel: RemedyTemplateModel,
    createSrv: CreateSrv,
    getSrv: GetSrv,
    updateSrv: UpdateSrv,
    deleteSrv: DeleteSrv,
    findSrv: FindSrv,
    implicit val ec: ExecutionContext,
    implicit val mat: Materializer) {

  def create(fields: Fields)(implicit authContext: AuthContext): Future[RemedyTemplate] =
    createSrv[RemedyTemplateModel, RemedyTemplate](remedyTemplateModel, fields)

  def get(id: String): Future[RemedyTemplate] =
    getSrv[RemedyTemplateModel, RemedyTemplate](remedyTemplateModel, id)

  def getByName(name: String): Future[RemedyTemplate] = {
    import org.elastic4play.services.QueryDSL._
    findSrv[RemedyTemplateModel, RemedyTemplate](remedyTemplateModel, "name" ~= name, Some("0-1"), Nil)
      ._1
      .runWith(Sink.headOption)
      .map(_.getOrElse(throw NotFoundError(s"Remedy template $name not found")))
  }

  def update(id: String, fields: Fields)(implicit authContext: AuthContext): Future[RemedyTemplate] =
    update(id, fields, ModifyConfig.default)

  def update(id: String, fields: Fields, modifyConfig: ModifyConfig)(implicit authContext: AuthContext): Future[RemedyTemplate] =
    updateSrv[RemedyTemplateModel, RemedyTemplate](remedyTemplateModel, id, fields, modifyConfig)

  def delete(id: String)(implicit authContext: AuthContext): Future[Unit] =
    deleteSrv.realDelete[RemedyTemplateModel, RemedyTemplate](remedyTemplateModel, id)

  def find(queryDef: QueryDef, range: Option[String], sortBy: Seq[String]): (Source[RemedyTemplate, NotUsed], Future[Long]) = {
    findSrv[RemedyTemplateModel, RemedyTemplate](remedyTemplateModel, queryDef, range, sortBy)
    // output format: { id, title, desc, variables[], templatebody }
  }
}
