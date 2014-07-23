(function (global) {
    "use strict";
    global.ST = global.ST || {};
    global.ST.pagination = global.ST.pagination || {};
    var pagination = global.ST.pagination;

    var defaultParams = {
        index: 1,
        size: 0
    };

    /** PageBlock class **/
    var PageBlock = function (options) {
        var params = jQuery.extend({}, defaultParams, options);
        var $container = $(params.container);

        var slideLeft = function () {
            if (params.index > 1) {
                // Hide the current page
                var $currentPage = $container.find("div.page[data-index=\"" + params.index + "\"]");
                $currentPage.hide();

                var currentEditor = getEditor($currentPage.find(".editor"));
                if(typeof(currentEditor) != "undefined" && currentEditor.getOption("fullScreen")) {
                    currentEditor.setOption("fullScreen", false);
                }

                // Show the previous page
                var $nextPage = $container.find("div.page[data-index=\"" + (params.index - 1) + "\"]").show();

                params.index = params.index - 1;

                currentEditor = getEditor($nextPage.find(".editor"))
                if(typeof(currentEditor) != "undefined") {
                    currentEditor.refresh();
                }
            }
        };

        var slideRight = function () {
            if (params.index < params.size) {
                // Hide the current page
                var $currentPage = $container.find("div.page[data-index=\"" + params.index + "\"]");
                $currentPage.hide();

                var currentEditor = getEditor($currentPage.find(".editor"));
                if(typeof(currentEditor) != "undefined" && currentEditor.getOption("fullScreen")) {
                    currentEditor.setOption("fullScreen", false);
                }

                // Show the previous page
                var $prevPage = $container.find("div.page[data-index=\"" + (params.index + 1) + "\"]").show();

                params.index = params.index + 1;

                currentEditor = getEditor($prevPage.find(".editor"))
                if(typeof(currentEditor) != "undefined") {
                    currentEditor.refresh();
                }
            }
        };

        var interpretCode = function () {
            var $page = $container.find("div.page[data-index=\"" + params.index + "\"]");

            var editorText = $page.find(".editor");
            var outputDiv = $page.find(".output");

            if (typeof(ST) != "undefined" && typeof(ST.editor) != "undefined" && typeof(ST.editor.get) == "function" &&
                typeof(ST.interpreter) != "undefined" && typeof(ST.interpreter.loading) == "function" && typeof(ST.interpreter.run) == "function") {
                var editor = ST.editor.get(editorText);

                if (typeof(editor) != "undefined") {
                    ST.interpreter.loading(outputDiv);
                    editor.save();
                    ST.interpreter.run(editor.getValue(), outputDiv.find("pre"));
                }
            }
        };

        var checkFocus = function () {
            return $("body").hasClass("impress-on-" + $container.closest(".step.slide").attr("id"));
        }

        var self = this;
        self.init = function () {
            params.size = $container.find(".page").size();

            $container.on("keyup", function (event) {
                event.stopPropagation();
                event.preventDefault();
            });

            $(document).on("keyup", function (event) {
                if ((event.keyCode === 33 || event.keyCode === 38 || event.keyCode === 34 || event.keyCode === 40 || event.keyCode === 13) && checkFocus()) {
                    switch (event.keyCode) {
                        case 33: // pg up
                        case 38: // up
                            slideLeft();
                            break;
                        case 34: // pg down
                        case 40: // down
                            slideRight();
                            break;
                        case 13: // enter
                            interpretCode();
                            break;
                    }
                    event.preventDefault();
                }
            });
        }
    };

    var getEditor = function(editorElem) {
        if(typeof(editorElem) != "undefined") {
            if (typeof(ST) != "undefined" && typeof(ST.editor) != "undefined" && typeof(ST.editor.get) == "function") {
                return ST.editor.get(editorElem);
            }
        }
        return undefined;
    }

    pagination.init = function (options) {
        $.each($(".pages"), function (index, pageBlock) {
            (new PageBlock({container: pageBlock})).init();
        });
    };


}(window));