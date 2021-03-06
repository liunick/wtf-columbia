var postIDs = 1;

$(document).ready(function() {


    displayPrevPosts(0);    //0 = all    

    $("div#logout").click(function() {
        $.get('/logout');
    });  



    $("a#cancel-btn").click(function(){
        $("#lean_overlay").trigger("click");
    });

    $("a#submit-btn").click(function() {
        var msgContent = $("#vmsg").val();
        //var markupStr = $('#summernote').summernote('code');
        var newMsg = {
            postID: postIDs,
            content: msgContent,
            display: true,
            score: 0,
            categories: 0
        };

        $.post('/newPost', newMsg);
        displayPost(postIDs);
        $('#summernote').summernote('destory');
        $("#lean_overlay").trigger("click");
        postIDs++;

    });



    $("#modal_trigger").leanModal({
        top : 200,
        overlay : 0.6,
        closeButton: ".modal_close",
    });

    $('#summernote').summernote({
      toolbar: [
       ['style', ['bold', 'italic', 'underline', 'clear']],
       ['font', ['strikethrough','superscript', 'subscript']],
       ['fontsize', ['fontsize']],
       ['color', ['color']],
       ['para', ['ul', 'ol', 'paragraph','height']],
       ['insert', ['link', 'table']]
     ],
     height: 350,
     maxHeight: 350,
     focus: true,
     disableDragAndDrop: true,
     placeholder : "type here!"
    });

    $("#all_tab").click(function(){
        deletePosts();
        displayPrevPosts(0);
    });

    $("#pending_tab").click(function(){
        deletePosts();
        displayPrevPosts(1);
    });

    $("#completed_tab").click(function(){
        deletePosts();
        displayPrevPosts(2);
    });

    // Calling Login Form
    $("#login_form").click(function () {
        $(".social_login").hide();
        $(".user_login").show();
        return false;
    });

    


});

$(document).on('click', ".fa.fa-chevron-up", function() {
    var postID = $(this).attr('data-id');
    var hasUpvoted = $(this).attr('data-b') === "true";
    var hasDownvoted = $("#d" + postID).attr('data-b') === "true";
    console.log(hasUpvoted);
    console.log(hasDownvoted);
    if (!hasUpvoted) {
        if (hasDownvoted) {
            
            //Increment score client side
            var score = Number($(this).attr('data-score')) + 1;
            
            //Increment score server side
            $.get('/upvote', {
                postID: postID
            }, function(data, status) {});
            $.get('/upvote', {
                postID: postID
            }, function(data, status) {});
            
            console.log($("i#d" + postID));
            $("i#d" + postID).replaceWith("<i id=\"d " + postID + "\" data-b = \"false\" class=\"fa fa-chevron-down\" data-id=\"" + postID + "\" style=\"color:#000\"></i></div></div>");
            $(this).replaceWith("<i id=\"u" + postID + "\" data-b = \"true\" class=\"fa fa-chevron-up\" data-id=\"" + postID + "\" style=\"color:#0F0\"></i></div></div>");

        } else {
            var score = Number($(this).attr('data-score')) + 1;
            $.get('/upvote', {
                postID: postID
            }, function(data, status) {});
            $(this).replaceWith("<i id=\"u" + postID + "\" data-b =     \"true\" class=\"fa fa-chevron-up\" data-id=\"" + postID + "\" style=\"color:#0F0\"></i></div></div>");
        }

        $("div#" + postID).replaceWith("<div class=\"vote-score\" id=\"" + postID + "\">" + score + "</div>");
    }
});

$(document).on('click', ".fa.fa-chevron-down", function() {
    var postID = $(this).attr('data-id');
    var ele = $("#u" + postID);
    var hasUpvoted = $("#u" + postID).attr('data-b') === "true";
    var hasDownvoted = $(this).attr('data-b') === "true";
    console.log(hasUpvoted);
    console.log(hasDownvoted);
    console.log($(this));
    if (!hasDownvoted) {
        if (hasUpvoted) {
            var score = Number($(this).attr('data-score')) - 1;
            $.get('/downvote', {
                postID: postID
            }, function(data, status) {});
            $.get('/downvote', {
                postID: postID
            }, function(data, status) {});
            console.log($("i#u" + postID));
            $("i#u" + postID).replaceWith("<i id=\"u" + postID + "\" data-b = \"false\" class=\"fa fa-chevron-up\" data-id=\"" + postID + "\" style=\"color:#000\"></i></div></div>");
            $(this).replaceWith("<i id=\"d" + postID + "\" data-b = \"true\" class=\"fa fa-chevron-down\" data-id=\"" + postID + "\" style=\"color:#F00\"></i></div></div>");

        } else {
            var score = Number($(this).attr('data-score')) - 1;
            $.get('/downvote', {
                postID: postID
            }, function(data, status) {});
            $(this).replaceWith("<i id=\"d" + postID + "\" data-b = \"true\" class=\"fa fa-chevron-down\" data-id=\"" + postID + "\" style=\"color:#F00\"></i></div></div>");
        }

        $("div#" + postID).replaceWith("<div class=\"vote-score\" id=\"" + postID + "\">" + score + "</div>");
    }
})

function deletePosts() {
    $("div#wrap").html("");
}

function appendPost(data) {

    var iconString;

    if($.inArray(1, data.categories) != -1) {
        iconString = [
            '<div class="vote-icon">',
                '<div class="vote">',
                    '<i class="fa fa-spinner"></i>',
                '</div>',
            '</div>'
        ].join("\n");
    }
    if ($.inArray(2, data.categories) != -1) {
        iconString = [
            '<div class="vote-icon">',
                '<div class="vote">',
                    '<i class="fa fa-check"></i>',
                '</div>',
            '</div>'
        ].join("\n");
    }

    var html = [
        '<div class ="item">',
            '<div class="vote-span">',
                '<div class="vote" id="upvote" data-action="up" title="Vote up">',
                    '<i id="u' + data.postID + '" data-b="false" class="fa fa-chevron-up" data-score="' + data.score + '" data-id="' + data.postID + '"></i>',
                '</div>',
                '<div class="vote-score" id="' + data.postID + '">',
                    data.score,
                '</div>',
                '<div class="vote" id="downvote"  data-action="down" title="Vote down">',
                    '<i id="d' + data.postID + '" data-b="false" class="fa fa-chevron-down" data-score="' + data.score + '" data-id="' + data.postID + '"></i>',
                '</div>',
            '</div>',
            '<div id="posts">',
                '<div class="post" id="postIn">',
                    '<p>',
                        data.content,
                    '</p>',
            '</div>',
            iconString,
            '</div>',
        '</div>'                                            
    ].join("\n");

    $("div#wrap").append(html);

}

function displayPrevPosts(cat) {
    $.get('/getPost', {}, function(data, status) {
        var highestPost = 0;
        console.log(data);
        postIDs = data.length;
        for (var x = 0; x < data.length; x++) {
            if ($.inArray(cat, data[x].categories) != -1)
                appendPost(data[x]);
        }
    });
}

function displayPost(pID) {
    console.log(postIDs);
    $.get('/getPost', {
        postID: pID
    }, function(data, status) {
        console.log(data);
        appendPost(data);
    });
}