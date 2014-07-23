(function (global) {
    "use strict";
    global.ST = global.ST || {};
    global.ST.editor = global.ST.editor || {};
    var editor = global.ST.editor;

    var editors = []
    var editorsMap = {}

    function getElementPath(element) {
        return "//" + $(element).parents().andSelf().map(function() {
            var $this = $(this);
            var tagName = this.nodeName;
            if ($this.siblings(tagName).length > 0) {
                tagName += "[" + $this.prevAll(tagName).length + "]";
            }
            return tagName;
        }).get().join("/").toUpperCase();
    }

    editor.refresh = function(element) {
        var selectedEditor = editorsMap[getElementPath(element)];
        if(typeof(selectedEditor) == "undefined") {
            selectedEditor.refresh();
        }
    }

    editor.get = function(element) {
        var selectedEditor = editorsMap[getElementPath(element)];
        if(typeof(selectedEditor) != "undefined") {
            return selectedEditor;
        }
        return undefined;
    }

    editor.init = function (options) {
        $.each($(".editor"), function(index, textarea) {
            if(typeof(editorsMap[getElementPath(textarea)]) == "undefined") {
                var $editor = CodeMirror.fromTextArea(textarea, {
                    theme: "solarized dark",
                    matchBrackets: true,
                    indentUnit: 2,
                    lineWrapping: false,
                    tabSize: 2,
                    indentWithTabs: false,
                    mode: "text/x-scala",
                    smartIndent :true,
                    lineNumbers: false,
                    extraKeys: {
                        // Fullscreen
                        "Ctrl-Enter": function(cm) {
                            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                        },
                        // Exit fulscreen
                        "Esc": function(cm) {
                            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                        },
                        // Transform tab to spaces
                        "Tab": function(cm) {
                            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
                            cm.replaceSelection(spaces);
                        }
                    }
                });
                $editor.on("update", function(){
                    $editor.save();
                });

                // Add action to the maximize button
                $(textarea).closest(".workspace").find(".maximize").click(function () {
                    $editor.setOption("fullScreen", !$editor.getOption("fullScreen"));
                    $editor.focus();
                });

                editors.push($editor)
                editorsMap[getElementPath(textarea)]=$editor
            }
        });
    };
}(window));