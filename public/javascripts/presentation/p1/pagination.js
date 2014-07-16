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
                $container.find("div.page[data-index=\"" + params.index + "\"]").hide();

                // Show the previous page
                var $nextPage = $container.find("div.page[data-index=\"" + (params.index - 1) + "\"]").show();

                params.index = params.index - 1;

                if (typeof(ST) != "undefined" && typeof(ST.editor) != "undefined" && typeof(ST.editor.get) == "function") {
                    var editor = ST.editor.get($nextPage.find(".editor"));
                    if(typeof(editor) != "undefined") {
                        editor.refresh();
                    }
                }
            }
        };

        var slideRight = function () {
            if (params.index < params.size) {
                // Hide the current page
                $container.find("div.page[data-index=\"" + params.index + "\"]").hide();

                // Show the previous page
                var $prevPage = $container.find("div.page[data-index=\"" + (params.index + 1) + "\"]").show();

                params.index = params.index + 1;

                if (typeof(ST) != "undefined" && typeof(ST.editor) != "undefined" && typeof(ST.editor.get) == "function") {
                    var editor = ST.editor.get($prevPage.find(".editor"));
                    if(typeof(editor) != "undefined") {
                        editor.refresh();
                    }
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
                if ((event.keyCode === 33 || event.keyCode === 38 || event.keyCode === 34 || event.keyCode === 40) && checkFocus()) {
                    switch (event.keyCode) {
                        case 33: // pg up
                        case 38: // up
                            slideLeft();
                            break;
                        case 34: // pg down
                        case 40: // down
                            slideRight();
                            break;
                    }
                    event.preventDefault();
                }
            });
        }
    };

    pagination.init = function (options) {
        $.each($(".pages"), function (index, pageBlock) {
            (new PageBlock({container: pageBlock})).init();
        });
    };


}(window));