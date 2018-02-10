$(document).ready(function(e){
    $.getJSON("/articles", function(data) {
        for (var i = 0; i < data.length; i++) {
           
            if(!data[i].saved) {
                $("#articles").append("<div><p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p><button class='saveBtn'>Save Article</button></div");
            }
        }
    });

    $('#scrape').on("click", function(e) {
       
        $.post("/scrape", function(data) {
            window.location = "/";
        });
    });

    $("div").delegate(".saveBtn", "click", function(){
        var p = $(this).siblings("p")[0];
        var id = $(p).data("id");
        $.post("/save", {articleId: id}, function(response) {
            if(response == 'OK') {
                window.location.href = "/";
            }
        });
    });

});