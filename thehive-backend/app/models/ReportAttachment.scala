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

trait ReportAttachmentAttributes { _: AttributeDef ⇒
  val lastModified = attribute("lastModified", F.textFmt, "Last modified time of the report template attachment")
  val name = attribute("name", F.textFmt, "File name of the report template attachment")
  val size = attribute("size", F.textFmt, "File size of the report template attachment")
  val filetype = attribute("filetype", F.textFmt, "File type of the report template attachment")
}

@Singleton
class ReportAttachmentModel extends ModelDef[ReportAttachmentModel, ReportAttachment]("reportAttachment", "Report Attachment", "/reportAttachment") with ReportAttachmentAttributes {
}
class ReportAttachment(model: ReportAttachmentModel, attributes: JsObject) extends EntityDef[ReportAttachmentModel, ReportAttachment](model, attributes) with ReportAttachmentAttributes
