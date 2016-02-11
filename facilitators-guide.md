# mcr-digital-experience

# Useful resources

[GitHub](http://www.github.com)

[GitHub pages](http://pages.github.com)

[HTML Reference](http://www.w3schools.com/tags/ref_byfuncasp)

[CSS Reference](http://www.w3schools.com/css/default.asp)

[Bootstrap documentation](http://getbootstrap.com)

[Google fonts](https://www.google.com/fonts)

[Javascript documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)

[JQuery documentation](https://api.jquery.com/)

## What's the plan?

We'll take the approach of putting one facilitator with n pairs of students, the facilitator to take their pairs through a series of activities based around building a website and using GitHub pages to host it. We should be able to cover everything with each facilitator taking a half day sift at some point over Thursday and Friday, and the schedule for each day is provisionally as follows:

* Introduction to the day; H&S announcements
* Get them to pair up
* Paper-based design exercise
* Building a site and hosting it on GH pages
* Basic styling
* Adding to the site and using bootstrap to help layout and responsive design
* Adding javascript and jquery to make the page interactive
* Connecting the site to firebase and sharing data over the internet

index.html in the repo should provide a starting point for the students to work with, with additional resources and demos for the javascript and firebase exercises in the javascript and firebase subfolders.

When building, remember to keep pushing to GH so that they can see their changes.

# UXey section

Tasks:

* Set the exercise, to design a web page for an event.

* Starting with paper and pens provided, draw 4-ups for the website

   * Explain 4-ups: each person takes paper, folds into 4 and draws 4 different designs for the page they're designing. Then they compare and explain their designs before putting together a final design for the page they'll be creating.

   [ Spend about 10 mins on this ]

* Anya & Warren to deliver brief overview on UX & design

# Basicsey section

* Start work on the site, register github account and clone our repo

* Using the index.html template provided, and assistance from facilitators, start to build up content & styling for the page.

* Explain css selectors & mess about, changing, for example, background color of a single element, or body.

# Bootstrappy Section

Learning objectives:
   * Basic understanding of bootstrap
   * Grid system & responsive design

* Explain grid layout for site, how to add new columns and make sure that page is responsive. Explain importance of mobile

* Using extras.html, and bootstrap docs, assist students in continuing to build their site.

# Javascripty section

Learning Objectives:
  * Understand how javascript interacts with the page, and introduce jquery

Example resources for this section are under javascriptey-section, and demonstrate triggering an alert on clicking the 'Learn More' button on the page, and adding new elements to the page when a user enters comments in a form below.

Explain what javascript is & the sort of things we can do with it in webpages

Show them the 'completed' example page and demonstrate the bits we've used jquery with (comments form & comments area).

Explain that we'll be building something similar on their pages using jquery

Tasks to talk them through:

* Getting used to jquery. Add jquery cdn to page:

```
  <script src="https://code.jquery.com/jquery-2.2.0.min.js"></script>
```

* Add a simple button to the page somewhere and bind an onclick handler to the button to show an alert box:

```html
<button id="learn-more" class="btn btn-success btn-lg" type="button">Learn More</button>

...

<script>

$('#learn-more').click( function() {
    alert( 'Learn more about what?');
});

</script>

```

Demonstrates jquery selectors, and binding functions in response to events. Worth mentioning that there are other ways to select elements.

*  Start building the comments section. Explain that we'll be taking the form input (name & comment) & using jquery to add the
   comment to the bottom of the page in a comments block


   * Add div to hold comments:

```html
   <div class="col-md-8 col-md-offset-2">
      <h2>Comments</h2>
      <div id="comments">
      </div>
   </div>
```

   * Add a form for users to enter a comment:

```html
<div class="col-md-4 col-md-offset-4 form" style="margin-top:20px">
   <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" class="form-control" placeholder="name goes here" />
   </div>
   <div class="form-group">
        <label for="comment">Comment</label>
        <textarea type="text" id="comment" class="form-control" placeholder="comment goes here" maxlength="150" rows="5" cols="10"></textarea>
   </div>
   <div class="form-group">
        <button id="addComment" class="btn btn-success pull-right">Submit</button>
   </div>
</div>
```

   * Give them the function to add a comment to the page:

```html
function addComment(name, comment){
    var date = new Date();

    var html = '<div class="comment row">' +
       '<div class="commentator col-xs-7"> ' + name + ' says: </div>' +
       '<div class="col-xs-5 removeBox"><span class="remove">x</span></div>' +
       '<div class="col-xs-12 commentText">' + comment + '</div>' +
       '<div class="col-xs-12 commentDate">' + date.toLocaleDateString() + '</div>' +
    '</div>';

    $(html).hide().appendTo("#comments").fadeIn(400);
}
```

   * Add onclick handler to form button to grab name and comment text and call our function.

```html
<script>
$("#addComment").click(function(){
    var name = $("#name").val();
    var comment = $("#comment").val();
    addComment(name, comment);
});
</script>
```


   * Add a handler to remove the comments when a user clicks the remove button:

```html
<script>
$("#comments").on("click", ".remove", function(){
   removeComment($(this));
});

function removeComment($removeButton){
    var $commentBox = $removeButton.parents(".comment");
    $commentBox.fadeOut(400);
}
</script>
```

# Firebasey section

Learning Objectives:
 * Understand how callbacks work
 * How to understand use other libraries in your own pages
 * Understand how to share data between pages

## Tasks

 * Create a section on your page (or a new one) for a messaging tool (and somewhere to put some javascript).

```html
<div class="messaging">
  <input type="textfield" id="message"></input><button id="send">send</button>
</div>
<script>
  // our javascript goes here
</script>
```

* Add a jquery click listener to the button;
 * first we need to make sure we have jquery included
 * then add our listener

```html
<head>
  ...
  <!-- include jquery in our page if it isn't already -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-beta1/jquery.min.js"></script>
</head>
```

```javascript
$("#send").on("click", function(e) { alert($("#message").val()); });
```
[ commit here ]

 * Include the chat client in your page (in the head block) and it's dependencies

```html
<!-- chat dependencies -->
<script src="https://cdn.firebase.com/js/client/2.4.0/firebase.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>
<script src="javascript/tiny-uuid4.min.js"></script>

<script src="javascript/chat.js"></script>

```

and create an instance of it.
```javascript
var chat = new Chat();
```


 * Next we need to connect the button and text box to the client, so we have to replace our click listener

```javascript
$("#send").on("click", function(e) {
  // find the search text box
  var message = $("#message").val();
  // check the message is ok
  if (message && message.length > 0) {
    // send it using the client
    chat.send(message);
    // reset the text box
    $("#message").val("");
  }
});
```
[ commit here ]

 * Now we need somewhere to show our messages, an unordered list maybe....

```html
<div>
  <ul id="messages">
  </ul>
</div>
```
and link it to the client

```javascript
chat.subscribeToMessages(function(message){
  // append a list item to the unordered list when we receive one.
  $("#messages").append("<li>" + message.text + "</li>");
});
```

[ commit here ]

We now have a very basic messaging app. The chat client has lots of other functionality including login/authentication, why not have aplay and see what you can find and integrate into your page?

###Things to try:
* Maybe look at the other methods that the chat client offers
* Why not use the developer tools to place a breakpoint and see what information each message includes. What could you do with that?
