(function (global) {
    "use strict";
    global.ST = global.ST || {};
    global.ST.interpreter = global.ST.interpreter || {};
    var interpreter = global.ST.interpreter;

    interpreter.loading = function(outputDiv) {
        outputDiv.html('<pre><span class="loading">' + ('waiting') + '</span></pre>');
    }

    interpreter.run = function(codeStr, outputDiv) {
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

    interpreter.init = function (options) {

    };


}(window));