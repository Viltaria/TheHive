package models

import java.util.Date
import javax.inject.{ Inject, Singleton }

import scala.concurrent.Future

import play.api.libs.json.JsValue.jsValueToJsLookup
import play.api.libs.json.{ JsFalse, JsObject }

// import models.JsonFormat.taskStatusFormat
import services.AuditedModel

import org.elastic4play.JsonFormat.dateFormat
import org.elastic4play.models.{ AttributeDef, BaseEntity, ModelDef, EntityDef, HiveEnumeration, AttributeFormat ⇒ F }
import org.elastic4play.utils.RichJson

trait VariableAttributes { _: AttributeDef ⇒
  // val title = attribute("title", F.textFmt, "Title of the task")
  // val description = optionalAttribute("description", F.textFmt, "Task details")
  // val owner = optionalAttribute("owner", F.userFmt, "User who owns the task")
  // val status = attribute("status", F.enumFmt(TaskStatus), "Status of the task", TaskStatus.Waiting)
  // val flag = attribute("flag", F.booleanFmt, "Flag of the task", false)
  // val startDate = optionalAttribute("startDate", F.dateFmt, "Timestamp of the comment start")
  // val endDate = optionalAttribute("endDate", F.dateFmt, "Timestamp of the comment end")
  // val order = attribute("order", F.numberFmt, "Order of the task", 0L)
  // val dueDate = optionalAttribute("dueDate", F.dateFmt, "When this date is passed, Thehive warns users")
  val dataType = attribute("dataType", F.textFmt, "Data type of the variable")
  val name = attribute("name", F.textFmt, "Name of the variable")
  val description = attribute("description", F.textFmt, "Description of the variable")
}

@Singleton
class VariableModel extends ModelDef[VariableModel, Variable]("remedyVariable", "Variable", "/remedyVariable") with VariableAttributes {
  // override val defaultSortBy = Seq("-startDate")

  // override def updateHook(task: BaseEntity, updateAttrs: JsObject): Future[JsObject] = Future.successful {
  //   (updateAttrs \ "status").asOpt[TaskStatus.Type] match {
  //     case Some(TaskStatus.InProgress) ⇒
  //       updateAttrs
  //         .setIfAbsent("startDate", new Date)
  //     case Some(TaskStatus.Completed) ⇒
  //       updateAttrs
  //         .setIfAbsent("endDate", new Date) +
  //         ("flag" → JsFalse)
  //     case _ ⇒ updateAttrs
  //   }
  // }
}
class Variable(model: VariableModel, attributes: JsObject) extends EntityDef[VariableModel, Variable](model, attributes) with VariableAttributes