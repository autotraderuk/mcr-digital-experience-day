(function() {

  function ToDo() {
    this.firebase = new Firebase("https://mcrd-event-planning.firebaseio.com/");
     this.firebase.onAuth(function (auth) {
      if (auth) {
        this.firebase.child("users").child(auth.uid).set(auth);
        this.username = auth.github.username;
        this.auth = auth;
      } else {
        this.username = "guest-" + Math.floor(Math.random() * 10000.0);
        this.auth = null;
      }
    }.bind(this));
  }

 /**
  * Method to add a new to do Item to the database 
  * @param item the text of the item to be added.
  */
  ToDo.prototype.add = function(item) {
    var _this = this;
    var payload = {id: window.uuid(), user: this.username, text: item, date: moment().format(), complete: false};
    this.firebase.child("todo").push(payload, function (err){
      if(err){
        console.log(err);
      }
    });
  }

  /**
  * Method to remove a todo item from the database once it has been complete
  * @param id - the id of the current todoitem.
  */
  ToDo.prototype.remove = function(id) {
    var todo = this.firebase.child("todo");
    todo.once("value", function(snapshot){
       snapshot.forEach(function(snap){
           if(snap.val().id == id){
             todo.child(snap.key()).remove();
           }   
       }); 
    });
  }
  /**
    * Method to get the list of all todo items still to be completed
    * @param cb - callback to see the results.
    */
  ToDo.prototype.getList = function(cb) {
    this.firebase.child("todo").on('child_added', function(childSnapshot, prevChildKey) {
      if(childSnapshot.val().complete == false){
        cb(childSnapshot.val());
      }
    });
  }
  /**
    * Method to get the list of all todo items that have been completed
    * @param cb - callback to see the results.
    */
   ToDo.prototype.getCompletedList = function(cb) {
    this.firebase.child("todo").on('child_added', function(childSnapshot, prevChildKey) {
      if(childSnapshot.val().complete == true){
        cb(childSnapshot.val());
      }
    });
  }
  /**
    * Method to mark a todo item as completed
    * @param cb - The id of the item that is completed..
    */
  ToDo.prototype.markDone = function(item) {
    var todo = this.firebase.child("todo");
    todo.once("value", function(snapshot){
       snapshot.forEach(function(snap){
           if(snap.val().id == item){
             todo.child(snap.key()).update({complete:true});
           }   
       }); 
    });
  }
  
  /**
   * Will return the username theh the chat client is currently using as the "from" field in messages, could be guest
   * @return the username
   */
  ToDo.prototype.getUsername = function () {
    return this.username;
  }
  
  window.ToDo = ToDo;
})();