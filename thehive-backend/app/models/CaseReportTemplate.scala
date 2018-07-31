package models

import javax.inject.{ Inject, Singleton }

import play.api.libs.json.{ JsObject, JsValue }

import models.JsonFormat.caseReportTemplateStatusFormat

import org.elastic4play.models.{ Attribute, AttributeDef, EntityDef, HiveEnumeration, ModelDef, AttributeFormat ⇒ F }

object CaseReportTemplateStatus extends Enumeration with HiveEnumeration {
  type Type = Value
  val Ok, Deleted = Value
}

trait CaseReportTemplateAttributes { _: AttributeDef ⇒
  def variableAttributes: Seq[Attribute[_]]

  val title: A[String] = attribute("title", F.stringFmt, "Title of the report template")
  val description: A[String] = attribute("description", F.stringFmt, "Description of the report template")
  val body: A[String] = attribute("body", F.stringFmt, "Body of the report template")
  val variables: A[Seq[JsObject]] = multiAttribute("variables", F.objectFmt(variableAttributes), "List of the available variables")
}

@Singleton
class CaseReportTemplateModel @Inject() (
    val variableModel: ReportVariableModel) extends ModelDef[CaseReportTemplateModel, CaseReportTemplate]("caseReportTemplate", "Case report template", "/caseReportTemplate") with CaseReportTemplateAttributes {
  def variableAttributes: Seq[Attribute[_]] = variableModel
    .attributes
    .filter(_.isForm)
}
class CaseReportTemplate(model: CaseReportTemplateModel, attributes: JsObject) extends EntityDef[CaseReportTemplateModel, CaseReportTemplate](model, attributes) with CaseReportTemplateAttributes {
  def variableAttributes = Nil
}