package models

import javax.inject.{ Inject, Singleton }

import play.api.libs.json.{ JsObject, JsValue, JsString }

import models.JsonFormat.remedyTemplateStatusFormat

import org.elastic4play.models.{ Attribute, AttributeDef, EntityDef, HiveEnumeration, ModelDef, AttributeFormat ⇒ F }

object RemedyTemplateStatus extends Enumeration with HiveEnumeration {
  type Type = Value
  val Ok, Deleted = Value
}

trait RemedyTemplateAttributes { _: AttributeDef ⇒
  //   def taskAttributes: Seq[Attribute[_]]
  //   def observableAttributes: Seq[Attribute[_]]
  def templateAttributes: Seq[Attribute[_]]

  // val templateName: A[String] = attribute("name", F.stringFmt, "Name of the template")
  // val titlePrefix: A[Option[String]] = optionalAttribute("titlePrefix", F.textFmt, "Title of the ticket")
  // val description: A[Option[String]] = optionalAttribute("description", F.textFmt, "Description of the ticket")
  // val observables: A[Seq[JsObject]] = multiAttribute("observables", F.objectFmt(observableAttributes), "Observables to include in the ticket")

  //  val severity: A[Option[Long]] = optionalAttribute("severity", SeverityAttributeFormat, "Severity if the ticket is an incident (0-5)")
  //  val tags: A[Seq[String]] = multiAttribute("tags", F.stringFmt, "Remedy tags")
  //  val flag: A[Option[Boolean]] = optionalAttribute("flag", F.booleanFmt, "Flag of the ticket")
  //  val tlp: A[Option[Long]] = optionalAttribute("tlp", TlpAttributeFormat, "TLP level")
  //  val status: A[RemedyTemplateStatus.Value] = attribute("status", F.enumFmt(RemedyTemplateStatus), "Status of the ticket", RemedyTemplateStatus.Ok)
  //  val metrics: A[JsValue] = attribute("metrics", F.metricsFmt, "List of acceptable metrics")
  //  val customFields: A[Option[JsValue]] = optionalAttribute("customFields", F.customFields, "List of acceptable custom fields")
  //  val tasks: A[Seq[JsObject]] = multiAttribute("tasks", F.objectFmt(taskAttributes), "List of created tasks")
  val title = attribute("title", F.textFmt, "Name of the template")
  val description = attribute("description", F.textFmt, "Description of template")
  val variables = multiAttribute("variables", F.objectFmt(templateAttributes), "List of template variables")
  val templateString = attribute("templateString", F.textFmt, "Template string")
}

@Singleton
class RemedyTemplateModel @Inject() (variableModel: VariableModel) extends ModelDef[RemedyTemplateModel, RemedyTemplate]("template", "Remedy template", "/remedy") with RemedyTemplateAttributes {
  def templateAttributes: Seq[Attribute[_]] = variableModel
    .attributes
    .filter(_.isForm)
  // def taskAttributes: Seq[Attribute[_]] = taskModel
  //   .attributes
  //   .filter(_.isForm)
  // def observableAttributes: Seq[Attribute[_]] = taskModel
  //   .attributes
  //   .filter(_.isForm)
}

class RemedyTemplate(model: RemedyTemplateModel, attributes: JsObject) extends EntityDef[RemedyTemplateModel, RemedyTemplate](model, attributes) with RemedyTemplateAttributes {
  // def taskAttributes = Nil
  // def observableAttributes = Nil
  def templateAttributes = Nil
}
