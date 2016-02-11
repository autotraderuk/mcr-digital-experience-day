(function () {

  /**
   * A client which allows you to send messages to other users of the chat system.
   *
   * It will allow you to message as a guest user or login using your github account. Initally the username will be set to guest<Number>
   *
   * It provides a series of listeners, which will be called when ever a new message is posted, and searches, which will return a set of message for that search.
   */
  function Chat() {
    this.firebase = new Firebase("https://mcrd-event-planning.firebaseio.com/");
    this.listeners = {};
    this.dataCheckFunctions = {};
    this.callbacks = {};
    this.avatars = {};
    this.firebase.onAuth(function (auth) {
      if (auth) {
        if (this.username && this.mentionedCb) {
          this.unsubscribeFromMentions(this.username, this.mentionedCb);
        }
        this.firebase.child("users").child(auth.uid).set(auth);
        this.username = auth.github.username;
        this.auth = auth;
        this.firebase.child("avatars").child(this.username).set(auth.github.profileImageURL);
        this.mentionedCb = this.subscribeToMentions(this.username, function (message) { this._propagate("mention", message); }.bind(this));
        this._propagate("login", auth, function () { return this.auth; }.bind(this));
      } else {
        if (this.username && this.mentionedCb) {
          this.unsubscribeFromMentions(this.username, this.mentionedCb);
        }
        this.username = "guest" + Math.floor(Math.random() * 10000.0);
        this.auth = null;
        this._propagate("logout");
      }
    }.bind(this));
  }

  /**
   * Will return the username that the chat client is currently using as the "from" field in messages, could be a guest
   * @return the username
   */
  Chat.prototype.getUsername = function () {
    return this.username;
  }

  /**
   * Adds a listener to a list, so that it can be told when a event occurs
   * @param type the venet type to listen form, one of ["login", "logout", "mention"]
   * @param cb the callback that received the event notification, possibly with event data, such as the authentication details for "login"
   */
  Chat.prototype.on = function (type, cb) {
    this.listeners[type] = this.listeners[type] || [];
    this.listeners[type].push(cb);
    if (this.dataCheckFunctions[type]) {
      var data = this.dataCheckFunctions[type]();
      if (data) {
        cb(data);
      }
    }
  }

  /**
   * checks is the user is logged in, will return false if the user is current a guest
   * @return boolean
   */
  Chat.prototype.isLoggedIn = function () {
    return this.auth != null;
  }

  /**
   * logs ythe current user out and sets them back to a guest user
   */
  Chat.prototype.logout = function () {
    this.firebase.unauth();
  }

  /**
   * use github to authenticate the current user, requesting permission to their public data if necessary
   */
  Chat.prototype.login = function () {
    this.firebase.authWithOAuthRedirect("github", function () { });
  }

  /**
   * get the avatar (profile picture) for "username"
   * @param username
   * @param cb callabck which should receive the url
   * @return url to image or null if not found.
   */
  Chat.prototype.getAvatar = function (username, cb) {
    if (this.avatars[username]) {
      cb(this.avatars[username]);
    } else {
      this.firebase.child("avatars").child(username).once("value", function (snapshot) {
        var url = snapshot.val();
        this.avatars[username] = url;
        cb(url);
      }.bind(this), function(error){
        cb(null, "not found");
      })
    }
  };

  /**
   * Method to request callbacks when messages mention the current user's name
   * @param cb callback to receive the messages
   */
  Chat.prototype.subscribeToMyMessages = function (cb) {
    this.mentionListeners.push(cb);
  }

  /**
   * Send message to the server. Looks for tags and mentions in the text and adds those too.
   * @param message the text to use as the "text" in the message.
   */
  Chat.prototype.send = function (message) {
    var tags = getTags(message);
    var mentions = getMentions(message);
    var payload = { id: window.uuid(), from: this.username, text: message, date: moment().valueOf(), tags: tags, mentions: mentions };
    this.firebase.child("messages").push(payload, function (err) {
      if (err) {
        console.log(err);
      }
    });
    mentions.forEach(function (username) { this.firebase.child("mentions").child(username).push(payload); }.bind(this));
    tags.forEach(function (tag) { this.firebase.child("tags").child(tag).push(payload); }.bind(this));
    split(message).forEach(function (word) {
      this.firebase.child("words").child(word).push(payload);
    }.bind(this));
  }

  /**
   * add a listener to receive all messages
   * @param cb callback to receive messages
   */
  Chat.prototype.subscribeToMessages = function (cb) {
    this.firebase.child("messages").on('child_added', this._registerCallback(cb));
  }

  /**
   * add a listener which will receive messages sent to username
   * @param username user to listen for
   * @param cb callback to receive the messages
  */
  Chat.prototype.subscribeToMentions = function (username, cb) {
    return this.firebase.child("mentions").child(username).on('child_added', this._registerCallback(cb));
  }

  /**
   * remove listener from receiving mentions
   * @param username
   * @param cb original callback that is receiving the messages
   */
  Chat.prototype.unsubscribeFromMentions = function (username, cb) {
    this.firebase.child("mentions").child(username).off("child_added", this._getCallback(cb));
  }

  /**
   * add a listener which will receive messages tagged with tag
   * @param tag #tag to listen for, without "#"
   * @param cb callback to receive the messages
  */
  Chat.prototype.subscribeToTag = function (tag, cb) {
    this.firebase.child("tags").child(tag).on("child_added", this._registerCallback(cb));
  }

  /**
   * remove listener from receiving tagged messaged
   * @param tag
   * @param cb original callback that is receiving the messages
   */
  Chat.prototype.unsubscribeFromTag = function (tag, cb) {
    this.firebase.child("tags").child(tag).off("child_added", this._getCallback[cb]);
  }

  Chat.prototype.sendPrivateMessage = function (username, message) {
    var payload = { id: window.uuid(), from: this.username, text: message, date: moment().valueOf()};
    this.firebase.child("direct_messages").child(username).push(payload);
  }

  Chat.prototype.subscribeToPrivateMessages = function (cb) {
    this.firebase.child("direct_messages").child(this.username).on("child_added", this._registerCallback(cb));
  }

  Chat.prototype.unsubscribeFromPrivateMessages = function (cb) {
    this.firebase.child("direct_messages").child(this.username).off("child_added", this.callbacks[cb]);
  }


  /**
   * perform a search for historical messages that mention "username"
   * @param username the user which is mentioned
   * @param cb callback to receive the results
   */
  Chat.prototype.searchForMentions = function (username, cb) {
    this.firebase.child("mentions").child(username).once("value", function (childSnapshot, prevChildKey) {
      var messages = [];
      childSnapshot.forEach(function (m) {
        messages.push(m.val());
      });
      cb(messages.map(convert));
    });
  }

  /**
   * perform a search for historical messages that are tagged with "tag"
   * @param tag the tag in the messages
   * @param cb callback to receive the results
   */
  Chat.prototype.searchForTag = function (tag, cb) {
    this.firebase.child("tags").child(tag).once("value", function (childSnapshot, prevChildKey) {
      var messages = [];
      childSnapshot.forEach(function (m) {
        messages.push(m.val());
      });
      cb(messages.map(convert));
    });
  }

  Chat.prototype.search = function (text, cb) {
    this.firebase.child("words").child(text).once("value", function (childSnapshot, prevChildKey) {
      var messages = [];
      childSnapshot.forEach(function (m) {
        messages.push(m.val());
      });
      cb(messages.map(convert));
    });
  }

  /**
   * private method used to tell listeners that an event has occurred
   * @param type the event type
   * @param payload the event data
   * @param dataCheck a function used to check whether there is already data available for this event to immediately send to the listener
   */
  Chat.prototype._propagate = function (type, payload, dataCheck) {
    if (this.listeners[type]) {
      this.listeners[type].forEach(function (cb) {
        cb(payload);
      });
    }
    this.dataCheckFunctions[type] = dataCheck;
  }

  Chat.prototype._registerCallback = function (cb) {
    this.callbacks[cb] = function (childSnapshot, prevChildKey) {
      cb(convert(childSnapshot.val()));
    };
    return this.callbacks[cb];
  }

  Chat.prototype._getCallback = function(cb){
    return this.callbacks[cb];
  }

  var TAG_REGEX = /\#(\w+)/g;
  var MENTION_REGEX = /\@(\w+)/g;

  /**
   * static method which will look for hashtags in message text
   * @param message the text to search
   * @return an array of tags
   */
  function getTags(message) {
    var tags = [];
    var result;
    while ((result = TAG_REGEX.exec(message)) !== null) {
      tags.push(result[1]);
    }
    return tags;
  }

  /**
   * static method which will look for @mentions in message text
   * @param message the text to search
   * @return an array of usernames
   */
  function getMentions(message) {
    var mentions = [];
    var result;
    while ((result = MENTION_REGEX.exec(message)) !== null) {
      mentions.push(result[1]);
    }
    return mentions;
  }

  function split(message) {
    var s = [];
    message.replace(/[^a-zA-Z\s]/g, "").split(/\s/g).forEach(function (w) {
      if (s.indexOf(w) < 0) {
        s.push(w);
      }
      if (typeof stemmer !== "undefined" && (w = stemmer(w))) {
        if (s.indexOf(w) < 0) {
          s.push(w);
        }
      }
    });
    return s;
  }
  /**
   * method to take the dates in results from the server and convert them into a moment() object.
   * see http://momentjs.com/
   */
  function convert(m) {
    m.date = moment(m.date);
    return m;
  }

  window.Chat = Chat;
})();