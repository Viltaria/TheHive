package controllers

import javax.inject.{ Inject, Singleton }

import scala.concurrent.ExecutionContext

import play.api.http.Status
import play.api.mvc._

import models.Roles
import services.RemedyTemplateSrv

import org.elastic4play.Timed
import org.elastic4play.controllers.{ Authenticated, Fields, FieldsBodyParser, Renderer }
import org.elastic4play.models.JsonFormat.baseModelEntityWrites
import org.elastic4play.services.JsonFormat.queryReads
import org.elastic4play.services.{ AuxSrv, QueryDSL, QueryDef }

@Singleton
class RemedyTemplateCtrl @Inject() (
    remedyTemplateSrv: RemedyTemplateSrv,
    auxSrv: AuxSrv,
    authenticated: Authenticated,
    renderer: Renderer,
    components: ControllerComponents,
    fieldsBodyParser: FieldsBodyParser,
    implicit val ec: ExecutionContext) extends AbstractController(components) with Status {

  @Timed
  def create: Action[Fields] = authenticated(Roles.admin).async(fieldsBodyParser) { implicit request ⇒
    remedyTemplateSrv.create(request.body)
      .map(caze ⇒ renderer.toOutput(CREATED, caze))
  }

  @Timed
  def get(id: String): Action[AnyContent] = authenticated(Roles.read).async { implicit request ⇒
    remedyTemplateSrv.get(id)
      .map(caze ⇒ renderer.toOutput(OK, caze))
  }

  @Timed
  def update(id: String): Action[Fields] = authenticated(Roles.admin).async(fieldsBodyParser) { implicit request ⇒
    remedyTemplateSrv.update(id, request.body)
      .map(caze ⇒ renderer.toOutput(OK, caze))
  }

  @Timed
  def delete(id: String): Action[AnyContent] = authenticated(Roles.admin).async { implicit request ⇒
    remedyTemplateSrv.delete(id)
      .map(_ ⇒ NoContent)
  }

  /*  def find: Action[Fields] = authenticated(Roles.read).async(fieldsBodyParser) { implicit request ⇒
    val query = request.body.getValue("query").fold[QueryDef](QueryDSL.any)(_.as[QueryDef])
    val range = request.body.getString("range")
    val sort = request.body.getStrings("sort").getOrElse(Nil)
    val nparent = request.body.getLong("nparent").getOrElse(0L).toInt
    val withStats = request.body.getBoolean("nstats").getOrElse(false)

    val (remedyTemplates, total) = remedyTemplateSrv.find(query, range, sort)
    //val remedyTemplatesWithStats = auxSrv(remedyTemplates, nparent, withStats, removeUnaudited = false)
		val remedyTemplatesWithStats = remedyTemplates
    renderer.toOutput(OK, remedyTemplatesWithStats, total)
  }*/
  @Timed
  def find() = Action { request ⇒ Ok("[ { \"id\":\"123\", \"name\":\"Test Template\", \"description\":\"this is a template we made for testing\", \"variables\":[], \"body\":\"this is a template without any variables\" } ]") }
}
