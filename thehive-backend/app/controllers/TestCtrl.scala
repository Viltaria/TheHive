package controllers

import javax.inject.{ Inject, Singleton }

import scala.concurrent.ExecutionContext

import play.api.http.Status
import play.api.mvc._

import models.Roles

import org.elastic4play.Timed
import org.elastic4play.controllers.{ Authenticated, Fields, FieldsBodyParser, Renderer }
import org.elastic4play.models.JsonFormat.baseModelEntityWrites
import org.elastic4play.services.JsonFormat.queryReads
import org.elastic4play.services.{ AuxSrv, QueryDSL, QueryDef }

@Singleton
class TestCtrl extends Controller {

  @Timed
  def test() = Action { request ⇒
    Ok("test")
  }
}
