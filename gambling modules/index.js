var tmi = require('tmi.js')
var User = require('../modules/Users')
var randomstring = require('randomstring')
var currentViewers = [];
var casino = false;
var client = new tmi.client(options);
var options = {
    options: {
      debug:true
    },
    connection: {
      cluster: "aws",
      reconnect: true
    },
    identity: {
      username:'chentabot',
      password:'oauth:8onrp9lhut41fjuvj5pivfdh1oq2la'
    },
    channels: ['chentaii']
  };



client.connect();


//BOT JOINING THE CHAT
client.on('connected', function(address,port) {
    client.say("chentaii", "rev up those browsers, cuz chentabot is in chatroom MingLee ")
});

//User says hi to bot
client.on("chat", function(channel,user,message,self) {
    var word = ["hey", "sup", "whats up", "hi", "waddup", "hello", "heyy"]
    for(var i = 0; i < word.length; i++){
        if (message.toLowerCase() === word[i] + " chentabot") {
        client.say("chentaii", "Heyy " + user['display-name'] + " HeyGuys");
        }
     } 
    if (message === "!schedule") {
        client.say("chentaii", "Monday-Friday 10pm-12pm EST BrokeBack or when I feel like it")
    }
    });
      
//LUL
client.on("chat", function(channel,user,message,self) {
    if (self) return
    if (message === "LUL")
    client.say("chentaii", "LUL")
    ;
    });


//BAN MESSAGE
client.on("ban", function (channel, username, reason) {
    client.say("chentaii", "BEGONE PowerUpL PunOko PowerUpR");
  });
  
//CHEER MESSAGE
client.on("cheer", function (channel, userstate, message) {
    client.say("chentaii", "arigato gozaimasu TehePelo");
  });


  
//CREATES A VIEWER AND DIRECTS TO SHOW POINTS FUNCTION
function createViewer(viewername){
    User.findOne({ username: viewername }, function (err,Username){
      if(err) {
        console.log(err)
      } else if (Username === null) {
        var newuser = new User ({
          username: viewername,
          points: 0
        });
        newuser.save(function(err){
          if (err) {
            console.log(err)
          } console.log(viewername + ' was saved to db') 
          createViewer(viewername)
        })
      } else {
        showPoints(Username)
      }
    })
  }
  
//DISPLAYS POINTS TO VIEWER
function showPoints(Username) {
    var points = Username.points
    points = points.toString();
    client.say('chentaii', "@" + Username.username + " you have " + points + " chentapoints PogChamp")
  }
  
  client.on("chat", function(channel,user,message,self) {
    if (message === "!points") {
      createViewer(user.username)
       } 
    })
  

//Turns on gambling
client.on('chat', function(channel,userstate,message,self){
    if(userstate.username === "chentaii" && message === "doorsopen") {
      client.say('chentaii', "The casino is open BlessRNG")
      casino = true;
    }
  })
//Turns off gambling  
client.on('chat', function(channel,userstate,message,self){
    if(userstate.username === "chentaii" && message === "doorsclosed") {
      client.say('chentaii', "The casino is closed NotLikeThis")
      casino = false;
    }
  })


//Gamble command  
client.on('chat', function(channel,user,message,self) {
    var messageLength = message.split(" ")
    if (message.indexOf("!gamble") === 0 && messageLength.length === 2 && casino == true) {
       console.log(messageLength[1])
        function gambleLogic () {
          return Math.floor(Math.random() * 101)
        }
        var dice = Math.floor(Math.random() * 101)
        var gamble = message.split(" ") // returns an array ["!gamble", ]
        var gambleAmount = Number(gamble[1]);
        var twitchName = user.username
        User.findOne({username: twitchName}, function(err,Username) {
          if (err) {
            console.log(err)
          } else  {
            if (gambleAmount > Username.points) {
              client.say('chentaii', "@" + twitchName + " you have don't have enough points nerd LUL")
            } else {
              var diceroll = gambleLogic()
              var points = Username.points 
              if (diceroll > 60) {
                points = points + gambleAmount
                  client.say('chentaii', "@"+ Username.username + " You won " + gambleAmount + 
                  'chentapoints PogChamp, you now have ' + points + ' chentapoints PogChamp' )
                  Username.save(function(err,updatedPoints){
                    if(err){
                      console.log(err)
                    }
                  })
                }
                 else {
                points = points - gambleAmount
                  console.log(typeof(points))
                  client.say('chentaii', '@' + Username.username + " You lost " + gambleAmount + 
                  ' chentapoints FeelsBadMan , you now have ' + points + ' chentapoints FeelsBadMan')
                Username.points = points
                Username.save(function(err, updatedPoints){
                  if (err) {
                    console.log(err)
                  }
                })
                }    
            }
          }
        })
    }
  })
 
//Starts points tracker when user enters
client.on("join", function (channel, username, self){
    console.log(username + ' has joined the channel')
    chentaPoints(username)
     })

  
//End points tracker when user leaves
client.on('part', function(channel,username,self){
    console.log(username + ' has left the channel')
    for (var i = 0; i < currentViewers.length; i ++) {
      if (currentViewers[i].name === username) {
        clearInterval(currentViewers[i].intId)
      }
    }
  })

// checks to see if user already exists
function chentaPoints (username){
    console.log(username + ' reached chentaPoints')
      User.findOne({ username: username }, function (err,Username){
        if(err) {
          console.log(err)
        } else if (Username === null) {
          var newuser = new User ({
            username: username,
            points: 0
          });
          newuser.save(function(err){
            if (err) {
              console.log(err)
            } else {
              console.log(username + " saved to db and now tracked")
              chentaPoints(username)
                }
            })
          } else {
          console.log(username + " points are now being tracked")
          clockStart(username)
        }
        })
  }
  
//Checks to see if user exists
function clockStart(Username){
    User.findOne({ username: Username }, function (err,name){
      if(err) {
        console.log(err)
      }  else {
         var intId = randomstring.generate();
         timer(name, intId)
    }
  })
  }
  
//Points logic
function timer(name, ejl) {
    var count = name.points
    var ejl = setInterval(counter, 30000);
    var twitchName = {
      name: name.username,
      intId: ejl
    }
    currentViewers.push(twitchName)
    function counter() {
      User.findOne({username: twitchName.name}, function (err, Username){
        if (err) {
          console.log(err)
        } else {
          var count = Username.points
          ++count
          console.log(name.username + " " + count);
          name.points = count
          name.save(function (err,updatedPoints) {
         if (err){
         console.log(err)
    } 
  })
        }
      })
      
    }
  }
