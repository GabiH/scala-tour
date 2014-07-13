package controllers

import java.io.{ByteArrayOutputStream, PrintStream}

import com.twitter.util.Eval.CompilerException
import models.Task
import org.apache.commons.lang3.exception.ExceptionUtils
import play.api.data.Forms._
import play.api.data._
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
      content => Ok(views.html.index("Scala interpreter", taskForm.fill(Task(content.in, interpretCode(content.in)))))
    )
  }

  def interpreter(in: String) = Action {
    Ok(views.html.interpret(interpretCode(in)))
  }

  def presentation(id: String) = Action {
    id match {
      case "p1" => Ok(views.html.pages.p1())
      case _ => Ok(views.html.interpret(""))
    }
  }

  private def interpretCode(code: String) = {
    try {
      val buffer = new ByteArrayOutputStream();
      val pw = new PrintStream(buffer)
      scala.Console.withOut(pw) {
        new com.twitter.util.Eval().apply(code).toString
      }
      pw.close()
      buffer.close()

      new String(buffer.toByteArray())
    } catch {
      case x: CompilerException => ExceptionUtils.getMessage(x)
    }
  }
}