function loading(outputDiv) {
    // $(".output").html('<pre><span class="loading">'+('waiting')+'</span></pre>');
    outputDiv.html('<pre><span class="loading">' + ('waiting') + '</span></pre>');
}

function runFunc(codeStr, outputDiv) {
    $.ajax("/interpret/?in=" + encodeURIComponent(codeStr), {
        type: "GET",
        success: function (data) {
            if (!data) {
                return;
            }
            if (data.Errors && data.Errors.length > 0) {
                setOutput(outputDiv, null, null, data.Errors);
                return;
            }
            setOutput(outputDiv, data.Events, data.ErrEvents, false);
        },
        error: function () {
            outputDiv.addClass("error").text(
                "Error communicating with remote server.");
        }
    });
}

function setOutput(output, events, errevents, error) {
    output.empty();
    if (events) {

        var msg = ""
        for (var i = 0; i < events.length; i++) {
            msg += events[i] + "\n"
        }
        output.text(msg);

        msg = ""
        for (var i = 0; i < errevents.length; i++) {
            msg += errevents[i] + "\n"
        }

        if (msg != "") {
            var err = $('<span class="err"/>');
            err.text(msg);
            err.appendTo(output);
        }

        var exit = $('<span class="exit"/>');
        exit.text("\nProgram exited.");
        exit.appendTo(output);
    }
    // Display errors.
    if (error) {
        var errorText = ""
        for (var i = 0; i < error.length; i++) {
            errorText += error[i] + "\n"
        }
        output.addClass("error").text(errorText);
    }
}

$(".run").click(function () {
    var editorText = $(this).closest(".workspace").find(".editor");
    var outputDiv = $(this).closest(".workspace").find(".output");

    if (typeof(ST) != "undefined" && typeof(ST.editor) != "undefined" && typeof(ST.editor.get) == "function") {
        var editor = ST.editor.get(editorText);

        if (typeof(editor) != "undefined") {
            loading(outputDiv);
            editor.save();
            runFunc(editor.getValue(), outputDiv.find("pre"));
        }
    }

});

document.getElementById("body").className = document.getElementById("body").className.replace('onload', ' ');
impress().init();

