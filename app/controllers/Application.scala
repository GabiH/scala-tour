package controllers

import java.io.{ByteArrayOutputStream, PrintStream}

import com.twitter.util.Eval.CompilerException
import models.Task
import org.apache.commons.lang3.exception.ExceptionUtils
import play.api.data.Forms._
import play.api.data._
import play.api.libs.json.{JsString, Json}
import play.api.mvc._

object Application extends Controller {

  val taskForm = Form[Task](
    mapping(
      "in" -> text,
      "out" -> text
    )(Task.apply)(Task.unapply)
  )

  def index = Action { implicit request =>
    taskForm.bindFromRequest.fold(
      errors => BadRequest(views.html.index("Scala interpreter", taskForm.fill(Task()))),
      content => Ok({
        val (events, errors) = interpretCode2(content.in)
        views.html.index("Scala interpreter", taskForm.fill(Task(content.in, (events ++ errors).mkString("\r\n"))))
      })
    )
  }

  def interpreter(in: String) = Action {
    Ok({
      val (events: List[String], errEvents: List[String]) = interpretCode2(in)
      Json.toJson(
        Map(
          "Events" -> events.map(JsString(_)).toSeq,
          "ErrEvents" -> errEvents.map(JsString(_)).toSeq
        )
      )
    })
  }

  def presentation(id: String) = Action {
    id match {
      case "1" => Ok(views.html.pages.p1())
      case _ => Ok(views.html.interpret(""))
    }
  }

  private def interpretCode2(code: String): (List[String], List[String]) = {
    try {
      var outEvents: List[String] = List()
      var errEvents: List[String] = List()

      using(List(new ByteArrayOutputStream(), new ByteArrayOutputStream())) {
        case List(outputBuffer, errBuffer) => using(List(new PrintStream(outputBuffer), new PrintStream(errBuffer))) {
          case List(output, error) => {
            scala.Console.withOut(output) {
              scala.Console.withErr(error) {
                new com.twitter.util.Eval().apply(code).toString
              }
              outEvents = outEvents ++ new String(outputBuffer.toByteArray()).lines.toList
              errEvents = errEvents ++ new String(errBuffer.toByteArray()).lines.toList.filterNot(_.startsWith("Picked up JAVA_TOOL_OPTIONS"))
            }
          }
        }
      }

      (outEvents, errEvents)
    } catch {
      case x: CompilerException => {
        (List(), ExceptionUtils.getMessage(x).lines.toList)
      }
    }
  }

  def using[A <: {def close() : Unit}, B](resources: List[A])(f: List[A] => B): B =
    try f(resources) finally resources.foreach(_.close())

}