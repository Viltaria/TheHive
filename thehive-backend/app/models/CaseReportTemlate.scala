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
  // def taskAttributes: Seq[Attribute[_]]

  // val templateName: A[String] = attribute("name", F.stringFmt, "Name of the template")
  // val titlePrefix: A[Option[String]] = optionalAttribute("titlePrefix", F.textFmt, "Title of the case")
  // val description: A[Option[String]] = optionalAttribute("description", F.textFmt, "Description of the case")
  // val severity: A[Option[Long]] = optionalAttribute("severity", SeverityAttributeFormat, "Severity if the case is an incident (0-5)")
  // val tags: A[Seq[String]] = multiAttribute("tags", F.stringFmt, "Case tags")
  // val flag: A[Option[Boolean]] = optionalAttribute("flag", F.booleanFmt, "Flag of the case")
  // val tlp: A[Option[Long]] = optionalAttribute("tlp", TlpAttributeFormat, "TLP level")
  // val status: A[CaseTemplateStatus.Value] = attribute("status", F.enumFmt(CaseTemplateStatus), "Status of the case", CaseTemplateStatus.Ok)
  // val metrics: A[JsValue] = attribute("metrics", F.metricsFmt, "List of acceptable metrics")
  // val customFields: A[Option[JsValue]] = optionalAttribute("customFields", F.customFields, "List of acceptable custom fields")
  // val tasks: A[Seq[JsObject]] = multiAttribute("tasks", F.objectFmt(taskAttributes), "List of created tasks")

  val name: A[String] = attribute("name", F.stringFmt, "Name of the report template")
  val content: A[String] = attribute("content", F.stringFmt, "Content of the report template")
}

@Singleton
class CaseReportTemplateModel extends ModelDef[CaseReportTemplateModel, CaseReportTemplate]("caseReportTemplate", "Case report template", "/caseReportTemplate") with CaseReportTemplateAttributes {
  // def taskAttributes: Seq[Attribute[_]] = taskModel
  //   .attributes
  //   .filter(_.isForm)
}
class CaseReportTemplate(model: CaseReportTemplateModel, attributes: JsObject) extends EntityDef[CaseReportTemplateModel, CaseReportTemplate](model, attributes) with CaseReportTemplateAttributes {
  // def taskAttributes = Nil
}