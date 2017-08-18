//grab articles as json
$.getJSON("/articles", function(data){
      for (var i = 0; i < data.length; i++) {
            let newDiv = $("<div>");
            let p = $("<p>");
            newDiv.attr("data-id", data[i]._id);
            newDiv.attr("id", "artDiv" );
            let h2 = $("<h2>")
            h2.addClass("card-title");
            h2.text(data[i].title)
            let html = data[i].link;
            p.text(html)
            newDiv.append(h2, p)

            $("#articles").append(newDiv);
            // "<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>"
      }
});

//ON CLICK P TAG
$(document).on("click", "#artDiv", function(){
      $("#notes").empty();

      let thisId = $(this).attr("data-id");

      $.ajax({
            method:"GET",
            url: "/articles/" + thisId
      }).done(function(data){
                console.log(data);
                // The title of the article
                $("#notes").append("<h4>" + data.title + "</h4>");
                // An input to enter a new title
                $("#notes").append("<input id='titleinput' name='title' >");
                // A textarea to add a new note body
                $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                // A button to submit a new note, with the id of the article saved to it
                $("#notes").append("<button data-id='" + data._id + "' id='savenote' class='btn-large  deep-orange lighten-1' type='submit' name='action'>Save Note</button>");
                $("#notes").append("<button data-id='" + data._id + "' id='deletenote' class='btn-large  green accent-4' type='submit' name='action'>Delete Note</button>");

                if (data.note) {
                      // Place the title of the note in the title input
                      $("#titleinput").val(data.note.title);
                      // Place the body of the note in the body textarea
                      $("#bodyinput").val(data.note.body);
                }
      });//end .done
});//end document

// ==============================================
//               SAVE
// ==============================================
$(document).on("click", "#savenote", function(){
      let thisId= $(this).attr("data-id");

      $.ajax({
            method:"POST",
            url: "/articles/" + thisId,
            data: {
              title: $("#titleinput").val(),
              body: $("#bodyinput").val()
            }
      }).done(function(data){
            console.log(data);
            $("#notes").empty();
      });

      $("#titleinput").val("");
      $("#bodyinput").val("");
});
// ==============================================
//               DELETE
// ==============================================

// $(document).on("click","#deletenote", function(){
//     let deleteId = $(this).attr("data-id");
//
//     $.ajax({
//       method:"POST",
//       url: "/articles/" + deleteId,
//       data: {
//         title: $("#titleinput").val(),
//         body: $("#bodyinput").val()
//       }
//     }).done(function(data){
//       console.log(data);
//     })
// })
