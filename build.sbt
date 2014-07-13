import _root_.sbt.Keys._
import play.Project._

name := "scala-tour"

version := "1.0"

libraryDependencies ++= Seq(
  "org.scala-lang" % "scala-actors" % scalaVersion.value,
  "org.scala-lang" % "scala-compiler" % scalaVersion.value,
  "com.twitter" % "util-eval_2.10" % "6.18.0",
  "com.typesafe.akka" %% "akka-actor" % "2.2.4",
  "com.typesafe.akka" %% "akka-remote" % "2.2.4",
  "com.jsuereth" %% "scala-arm" % "1.3"
)

playScalaSettings