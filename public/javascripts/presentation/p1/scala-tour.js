$(".run").click(function () {
    var editorText = $(this).closest(".workspace").find(".editor");
    var outputDiv = $(this).closest(".workspace").find(".output");

    if (typeof(ST) != "undefined" && typeof(ST.editor) != "undefined" && typeof(ST.editor.get) == "function" &&
            typeof(ST.interpreter) != "undefined" && typeof(ST.interpreter.loading) == "function" && typeof(ST.interpreter.run) == "function") {
        var editor = ST.editor.get(editorText);

        if (typeof(editor) != "undefined") {
            ST.interpreter.loading(outputDiv);
            editor.save();
            ST.interpreter.run(editor.getValue(), outputDiv.find("pre"));
        }
    }

});

document.getElementById("body").className = document.getElementById("body").className.replace('onload', ' ');
impress().init();

