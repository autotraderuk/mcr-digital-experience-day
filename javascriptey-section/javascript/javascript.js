setupEventBindings();

function setupEventBindings(){
    $('#learn-more').click( function() {
        alert( 'Learn more about what?');
    });
    $("#addComment").click(function(){
        var name = $("#name").val();
        var comment = $("#comment").val();
        addComment(name, comment);
    });
    $("#comments").on("click", ".remove", function(){
       removeComment($(this));
    });
}

var template = $('#commentTemplate').html();
Mustache.parse(template);

function addComment(name, comment){
    var date = moment().format('MMM Do YYYY, h:mm:ss');
    var commentObj = {
        "name":name,
        "comment":comment,
        "date":date
    };
    var html = $(Mustache.render(template, commentObj));
    $(html).hide().appendTo("#comments").fadeIn(400);
}

function removeComment($removeButton){
    var $commentBox = $removeButton.parents(".comment");
    $commentBox.fadeOut(400);
}
