$(document).ready(function(e){
    var isNoteDirty = false;

    $.getJSON("/getSavedArticles", function(data) {
        for (var i = 0; i < data.length; i++) {
            $("#savedArticles").append("<div><p data-noteid=" + data[i].note + " data-id=" + data[i]._id + ">" + data[i].title + "<br />" + data[i].link + "</p><button class='noteBtn'>Article Notes</button><button class='removeBtn'>Remove Article</button></div>");
        }
    });

    $("div").delegate(".removeBtn", "click", function(){
        var p = $(this).siblings("p")[0];
        var id = $(p).data("id");
        $.post("/delete", {articleId: id}, function(response) {
            if(response == 'OK') {
                window.location.href = "/savedArticles";
            }
        });
    });

    $("div").delegate(".noteBtn", "click", function(){
        isNoteDirty = false;
        $("#notesTable tbody").empty();
        $("#note").val("");
        var p = $(this).siblings("p")[0];
        var id = $(p).data("id");
        $('#saveNoteBtn').data("id", id);
        var noteId = $(p).data("noteid");
        if(noteId !== undefined && noteId !== null && noteId !== 'undefined' && noteId !== 'null') {
            $.get("/getNote", {id: noteId}, function(response) {
                $('#notesTable > tbody:last-child').append("<tr><th>Notes</th><tr><tr><td>" + response[0].body + "</td><td><button data-id=" + id + " class='btn-danger'>X</button></td></tr>");
                $("#noteModal").modal('show');
            });
        } else {
            $("#noteModal").modal('show');
        }
    });

    $("#saveNoteBtn").on("click", function(e) {
        var btnId = $(this).data("id");
        if($("#note").val().trim().length !== 0 || isNoteDirty) {
            if($("#note").val().trim().length > 0) {
                $.post("/saveNote", {
                    articleId: $(this).data("id"),
                    content: $("#note").val().trim()
                }, function(response) {
                    if(response) {
                        if(response.note) {
                            var elem = $("#savedArticles").find(`[data-id='${btnId}']`);
                            $(elem).data("noteid", response.note);
                        }
                    }
                    $("#note").val("");
                });
            } else {
                $.post("/removeNote", {articleId: $(this).data("id")}, function(response) {
                    if(response == 'OK') {
                        var elem = $("#savedArticles").find(`[data-id='${btnId}']`);
                        $(elem).data("noteid", null);
                    }
                });
            }
            isNoteDirty = false;
        }
        $("#noteModal").modal('hide');
    });

    $("#closeBtn").on("click", function(e) {
        isNoteDirty = false;
    });

    $(document).on('click','.btn-danger',function(){
        isNoteDirty = true;
        $("#notesTable tbody").empty();
    });

});