package models

import java.util.Date
import javax.inject.{ Inject, Singleton }

import scala.concurrent.Future

import play.api.libs.json.JsValue.jsValueToJsLookup
import play.api.libs.json.{ JsFalse, JsObject }

import services.AuditedModel

import org.elastic4play.JsonFormat.dateFormat
import org.elastic4play.models.{ AttributeDef, BaseEntity, ModelDef, EntityDef, HiveEnumeration, AttributeFormat ⇒ F }
import org.elastic4play.utils.RichJson

trait ReportVariableAttributes { _: AttributeDef ⇒
  val key = attribute("key", F.textFmt, "Key of the report variable")
  val syntax = attribute("syntax", F.textFmt, "Syntax of the report variable")
}

@Singleton
class ReportVariableModel extends ModelDef[ReportVariableModel, ReportVariable]("reportVariable", "Report Variable", "/reportVariable") with ReportVariableAttributes {
}
class ReportVariable(model: ReportVariableModel, attributes: JsObject) extends EntityDef[ReportVariableModel, ReportVariable](model, attributes) with ReportVariableAttributes
