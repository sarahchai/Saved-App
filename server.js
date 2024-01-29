const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

var mysql = require('mysql2');
// const { arch } = require("os");

// Connect to the database using mysql
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "931129sar",
    database: "saved_db"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
const PORT = process.env.PORT || 5001;
const jwtSecret = '1220saved**app**cisc-6597'

const app = express();
app.use(cors());
app.use(express.json({ extended: false }));




// Checking if the api is connected to the port
app.get('/api', (req, res) => {
	res.status(200);
	res.json({ working: true });
	res.end();
});


// POST - Create new user 
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400).json({
      message: 'Everything should be answered.'
    })
    return;
  }

  db.query('SELECT * FROM Users WHERE username =\''+ username + '\';', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
      return;

  } else if (result && result.length > 0){
      res.status(409).json({
      message: 'The username has been used.'
    })

  } else if (result && result.length === 0) {
    console.log('email')
    db.query('SELECT * FROM Users WHERE email =\''+ email + '\';', async function(err, result) {
      if (err){
        res.status(400).send('Error in database operation');
        return;

      } else if (result && result.length > 0){
        res.status(409).json({
        message: 'The email has been used.'
        })

      } else if (result && result.length === 0) {

        const hashPassword = await bcrypt.hash(
          password,
          8
        );

        console.log(hashPassword)
        
        db.query('INSERT INTO Users (username, hashPassword, email) VALUES (\'' + 
        username + '\', \'' + hashPassword + '\', \'' + email + '\');', function(err, result) {
          if (err){
            res.status(400).send('Error in database operation');
            return;
          } else {
            
            const jwtToken = jwt.sign({ userId: result.insertId }, jwtSecret);
            res.status(200).json(jwtToken);
          }
        })

      }
    })
  }
  });
});


// POST - Login user 
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req);
  if (!username || !password) {
    res.status(400).json({
      message: 'Invalid username and password'
    })
  }

  db.query('SELECT * FROM Users WHERE username = \'' + username + '\';', async function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else if (result && result.length === 0){
      res.status(401).json({
      message: 'Username not found'
      })
  } else if (result && result.length > 0) {

    const checkPassword = await bcrypt.compare(password, result[0].hashPassword);
    if (checkPassword) {
      const jwtToken = jwt.sign({ userId: result[0].id }, jwtSecret);
      res.json(jwtToken);
    } else {
      res.status(409).json({
        message: 'The user email and password does not match'
      })
    }
  }
  });
});



// GET user - check input id and password and see if it matach
// output with the id 
app.get('/api/current-user', async (req, res) => {
  const token = req.headers['jwt-token'];
  const verify = await jwt.verify(token, jwtSecret);

  db.query('SELECT * FROM Users WHERE id = '+ verify.userId + ';', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });
});

// GET user by username
app.get('/api/get-user/:username', (req, res) => {
  const friendUsername = req.params.username;

  db.query('SELECT * FROM Users WHERE username = \'' + friendUsername + '\';', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else if (result && result.length === 0) {
      res.status(409).json({message: 'The user has not been found.'})
  } else if (result && result.length > 0) {
     res.send(result);
  }
  });
});


// GET user by id
app.get('/api/get-user-id/:id', (req, res) => {
  db.query('SELECT * FROM Users WHERE id = \'' + req.params.id + '\';', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
     res.send(result);
  }
  });
});



// POST save - check if the API exists in the Saves table with the category and APIid
// on the category tables and if it does then create the entry on Saves table with that id
// if it in not, then make the entry in category table and saves table
app.post('/api/save/:id', (req, res) => {
  const userId = req.params.id;
  var savedId = 0;

  // if statement for private

  if (req.body.category === "book") {
    const title = req.body.title.replace("'", "''");
    const author = req.body.author.replace("'", "''");
    
    db.query('SELECT * FROM BookSaves WHERE bookAPI = \''+ req.body.apiId +'\';', function(err, result) {
      if (err){
        res.status(400).json({ error: 'Error in database operation' });
        return;

      } else if (result && result.length > 0) {
        
        savedId = result[0].bid;

        db.query('INSERT INTO Saves (userId, category, bookId, private, archived, numOfSaves) VALUES (' +
        userId +', \''+ req.body.category + '\', '+ savedId + ', False, False, 0);', function(err, result) {
          console.log('book there and save it')
        if (err){
            res.status(400).send('Error in database operation');
            return;

        } else if (result) {
            res.send(result);
        }

        });

      } else if (result && result.length === 0) {

        db.query('INSERT INTO BookSaves (bookTitle, author, bookAPI) VALUES (\''+ title +'\', \'' + author +
        '\', \'' + req.body.apiId + '\');', function(err, result) {
        if (err){
            res.status(400).json({ error: 'Error in database operation' });
            return;

        } else if (result) {
            savedId = result.insertId;

            db.query('INSERT INTO Saves (userId, category, bookId, private, archived, numOfSaves) VALUES (' +
            userId +', \''+ req.body.category + '\', '+ savedId + ', False, False, 0);', function(err, result) {
              console.log('save it')
            if (err){
                res.status(400).send('Error in database operation');
                return;
    
            } else if (result) {
                res.send(result);
            }
    
            });
        }
        });

      }

    });

  } else if (req.body.category === "movie") {
    const title = req.body.title.replace("'", "''");
    const director = req.body.director.replace("'", "''");

    db.query('SELECT * FROM MovieSaves WHERE movieAPI = \''+ req.body.apiId +'\';', function(err, result) {
      if (err){
        res.status(400).json({ error: 'Error in database operation' });
        return;

      } else if (result && result.length > 0) {
        
        savedId = result[0].mid;

        db.query('INSERT INTO Saves (userId, category, movieId, private, archived, numOfSaves) VALUES (' +
        userId +', \''+ req.body.category + '\', '+ savedId + ', False, False, 0);', function(err, result) {

        if (err){
            res.status(400).send('Error in database operation');
            return;

        } else if (result) {
            res.send(result);
        }

        });

      } else if (result && result.length === 0) {

        db.query('INSERT INTO MovieSaves (movieTitle, author, bookAPI) VALUES (\''+ title +'\', \'' + director +
        '\', \'' + req.body.apiId + '\');', function(err, result) {
        if (err){
            res.status(400).json({ error: 'Error in database operation' });
            return;

        } else if (result) {
            savedId = result.insertId;

            db.query('INSERT INTO Saves (userId, category, movieId, private, archived, numOfSaves) VALUES (' +
            userId +', \''+ req.body.category + '\', '+ savedId + ', False, False, 0);', function(err, result) {
              console.log('save it')
            if (err){
                res.status(400).send('Error in database operation');
                return;
    
            } else if (result) {
                res.send(result);
            }
    
            });
        }
        });

      }

    });

  } else if (req.body.category === "place") {
  const name = req.body.name.replace("'", "''");
  const address = req.body.address.replace("'", "''");
    
    db.query('SELECT * FROM PlaceSaves WHERE placeAPI = \''+ req.body.apiId +'\';', function(err, result) {
      if (err){
        res.status(400).json({ error: 'Error in database operation' });
        return;

      } else if (result && result.length > 0) {
        
        savedId = result[0].pid;

        db.query('INSERT INTO Saves (userId, category, placeId, private, archived, numOfSaves) VALUES (' +
        userId +', \''+ req.body.category + '\', '+ savedId + ', False, False, 0);', function(err, result) {
          console.log('book there and save it')
        if (err){
            res.status(400).send('Error in database operation');
            return;

        } else if (result) {
            res.send(result);
        }

        });

      } else if (result && result.length === 0) {

        db.query('INSERT INTO PlaceSaves (name, address, placeAPI) VALUES (\''+ name +'\', \'' + address +
        '\', \'' + req.body.apiId + '\');', function(err, result) {
        if (err){
            res.status(400).json({ error: 'Error in database operation' });
            return;

        } else if (result) {
            savedId = result.insertId;

            db.query('INSERT INTO Saves (userId, category, placeId, private, archived, numOfSaves) VALUES (' +
            userId +', \''+ req.body.category + '\', '+ savedId + ', False, False, 0);', function(err, result) {
              console.log('save it')
            if (err){
                res.status(400).send('Error in database operation');
                return;
    
            } else if (result) {
                res.send(result);
            }
    
            });
        }
        });

      }

    });
  }
  
});

// GET all saves by a user - done 
app.get('/api/all-saves/:id', (req, res) => {
  db.query('SELECT * FROM Saves as s LEFT JOIN BookSaves as b on s.bookId = b.bid '
  + 'LEFT JOIN PlaceSaves as p on s.placeId = p.pid LEFT JOIN MovieSaves as m on s.movieId = m.mid '
  + 'WHERE s.userId = '+ req.params.id + ' ORDER By id DESC;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });
});

// PUT update archived 
// id - entry id on saves table 
// bool - 0 if false, 1 if true 
app.put('/api/archive-saves/:id/:bool', (req, res) => {
  let archivedVal = 0;

  if (req.params.bool === "true") {
    archivedVal = 0;
  } else if (req.params.bool === "false") {
    archivedVal = 1;
  }

  db.query('UPDATE Saves SET archived = ' + archivedVal + 
  ' WHERE id = ' + req.params.id, function(err, result) {
    if (err){
      res.status(400).send('Error in database operation');
    } else {
      res.send(result);
    }
  });

});


// PUT update private
// id - entry id on saves table 
app.put('/api/private-saves/:id/:bool', (req, res) => {
  let privateVal = 0; 
  
  if (req.params.bool === "true") {
    privateVal = 0;
  } else if (req.params.bool === "false") {
    privateVal = 1;
  }

  db.query('UPDATE Saves SET private = ' + privateVal + 
  ' WHERE id = ' + req.params.id, function(err, result) {
    if (err){
      res.status(400).send('Error in database operation');
    } else {
      res.send(result);
    }
  });

});


// GET friends feed - done
app.get('/api/get-feed/:id', (req, res) => {
  // db.query('SELECT s.id, s.userId, s.category, s.movieId, s.bookId, s.placeId, s.private, s.archived, s.numOfSaves FROM Saves as s LEFT JOIN Friends as f ON s.userId = F.userId2 WHERE f.status = 2 and f.userId1 = '
  // + req.params.id + ' UNION SELECT s.id, s.userId, s.category, s.movieId, s.bookId, s.placeId, s.private, s.archived, s.numOfSaves FROM Saves as s LEFT JOIN Friends as f ON s.userId = F.userId1 WHERE f.status = 2 and f.userId2 = ' 
  // + req.params.id + ';', function(err, result) {
  // if (err){
  //     res.status(400).send('Error in database operation');
  // } else {
  //     res.send(result);
  // }
  // });

  db.query('SELECT * FROM (SELECT * FROM Saves as s LEFT JOIN Friends as f ON s.userId = F.userId2'
    + ' WHERE f.status = 2 and f.userId1=' + req.params.id + ' UNION SELECT * FROM Saves as s LEFT JOIN Friends as f'
    + ' ON s.userId = F.userId1 WHERE f.status = 2 and f.userId2=' + req.params.id + ' ) as sa LEFT JOIN BookSaves as b'
    + ' on sa.bookId = b.bid LEFT JOIN PlaceSaves as p on sa.placeId = p.pid LEFT JOIN MovieSaves as m on sa.movieId = m.mid'
    + ' ORDER By id DESC;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });

});



// POST send save - check if the thing is saved in CategorySaves table 
// if it is not saved then save it and post to SendSaves
// if it is there then grab the id and post to SendSaves 
app.post('/api/send-save/:id1/:id2', (req, res) => {
  
  const userId1 = req.params.id1;
  const userId2 = req.params.id2;
  var savedId = 0;

  if (req.body.category === "book") {
    const title = req.body.title.replace("'", "''");
    const author = req.body.author.replace("'", "''");
    
    db.query('SELECT * FROM BookSaves WHERE bookAPI = \''+ req.body.apiId +'\';', function(err, result) {
      if (err){
        res.status(400).json({ error: 'Error in database operation' });
        return;

      } else if (result && result.length > 0) {
        
        savedId = result[0].bid;

        db.query('INSERT INTO SendSaves (userId1, userId2, category, bookId, status) VALUES (' +
        userId1 +' , ' + userId2 + ', \'' + req.body.category + '\', '+ savedId + ', 1);', function(err, result) {
          console.log('book there and save it')
        if (err){
            res.status(400).send('Error in database operation');
            return;

        } else if (result) {
            res.send(result);
        }

        });

      } else if (result && result.length === 0) {

        db.query('INSERT INTO BookSaves (bookTitle, author, bookAPI) VALUES (\''+ title +'\', \'' + author +
        '\', \'' + req.body.apiId + '\');', function(err, result) {
        if (err){
            res.status(400).json({ error: 'Error in database operation' });
            return;

        } else if (result) {
            savedId = result.insertId;

            db.query('INSERT INTO SendSaves (userId1, userId2, category, bookId, status) VALUES (' +
            userId1 +' , ' + userId2 + ', \'' + req.body.category + '\', '+ savedId + ', 1);', function(err, result) {
              console.log('save it')
            if (err){
                res.status(400).send('Error in database operation');
                return;
    
            } else if (result) {
                res.send(result);
            }
    
            });
        }
        });

      }

    });

  } else if (req.body.category === "movie") {
    const title = req.body.title.replace("'", "''");
    const director = req.body.director.replace("'", "''");

    db.query('SELECT * FROM MovieSaves WHERE movieAPI = \''+ req.body.apiId +'\';', function(err, result) {
      if (err){
        res.status(400).json({ error: 'Error in database operation' });
        return;

      } else if (result && result.length > 0) {
        
        savedId = result[0].mid;

        db.query('INSERT INTO Saves (userId1, userId2, category, movieId, status) VALUES (' +
        userId1 +' , ' + userId2 + ', \'' + req.body.category + '\', '+ savedId + ', 1);', function(err, result) {

        if (err){
            res.status(400).send('Error in database operation');
            return;

        } else if (result) {
            res.send(result);
        }

        });

      } else if (result && result.length === 0) {

        db.query('INSERT INTO MovieSaves (movieTitle, author, movieAPI) VALUES (\''+ title +'\', \'' + director +
        '\', \'' + req.body.apiId + '\');', function(err, result) {
        if (err){
            res.status(400).json({ error: 'Error in database operation' });
            return;

        } else if (result) {
            savedId = result.insertId;

            db.query('INSERT INTO Saves (userId1, userId2, category, movieId, status) VALUES (' +
            userId1 +' , ' + userId2 + ', \'' + req.body.category + '\', '+ savedId + ', 1);', function(err, result) {
              console.log('save it')
            if (err){
                res.status(400).send('Error in database operation');
                return;
    
            } else if (result) {
                res.send(result);
            }
    
            });
        }
        });

      }

    });

  } else if (req.body.category === "place") {
    console.log(req.body)
  const name = req.body.name.replace("'", "''");
  const address = req.body.address.replace("'", "''");
    
    db.query('SELECT * FROM PlaceSaves WHERE placeAPI = \''+ req.body.apiId +'\';', function(err, result) {
      if (err){
        res.status(400).json({ error: 'Error in database operation' });
        return;

      } else if (result && result.length > 0) {
        
        savedId = result[0].pid;

        db.query('INSERT INTO SendSaves (userId1, userId2, category, placeId, status) VALUES (' +
        userId1 +' , ' + userId2 + ', \'' + req.body.category + '\', '+ savedId + ', 1);', function(err, result) {
          console.log('book there and save it')
        if (err){
            res.status(400).send('Error in database operation');
            return;

        } else if (result) {
            res.send(result);
        }

        });

      } else if (result && result.length === 0) {

        db.query('INSERT INTO PlaceSaves (name, address, placeAPI) VALUES (\''+ name +'\', \'' + address +
        '\', \'' + req.body.apiId + '\');', function(err, result) {
        if (err){
            res.status(400).json({ error: 'Error in database operation' });
            return;

        } else if (result) {
            savedId = result.insertId;

            db.query('INSERT INTO SendSaves (userId1, userId2, category, placeId, status) VALUES (' +
            userId1 +' , ' + userId2 + ', \'' + req.body.category + '\', '+ savedId + ', 1);', function(err, result) {
              console.log('save it')
            if (err){
                res.status(400).send('Error in database operation');
                return;
    
            } else if (result) {
                res.send(result);
            }
    
            });
        }
        });

      }

    });
  }
  
});


// PUT send save status
// id of the sendSave
app.put('/api/saved-accepted/:id', (req, res) => {
  console.log('in the api')
  db.query('UPDATE SendSaves SET status = 2'
  + ' WHERE id = '+ req.params.id + ' ;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
      return;
  } else {
    console.log("hey")
      db.query('SELECT * FROM SendSaves'
    + ' WHERE id = '+ req.params.id + ' ;', function(err, result){
      if (err) {
        res.status(400).send('Error in database operation');
        return;
      } else {

        console.log(result);
        if (result[0].category === "book") {

          db.query('INSERT INTO Saves (userId, category, bookId, private, archived, numOfSaves) VALUES (' +
          result[0].userId2 +', \''+ result[0].category + '\', '+ result[0].bookId + ', False, False, 0);', function(err, result){
            if (err) {
              res.status(400).send('Error in database operation');
              return;
            } else {
              res.send("Inserted to Saves")
            }
          })
        } else if (result[0].category === "place") {
          console.log(result)
          db.query('INSERT INTO Saves (userId, category, placeId, private, archived, numOfSaves) VALUES (' +
          result[0].userId2 +', \''+ result[0].category + '\', '+ result[0].placeId + ', False, False, 0);', function(err, result){
            if (err) {
              res.status(400).send('Error in database operation');
              return;
            } else {
              res.send("Inserted to Saves")
            }
          })
        }
      }
      
    })
  }
  });
});


// PUT send save declined
// id - id of the sendsave post
app.put('/api/saved-declined/:id', (req, res) => {
  console.log('in the api')
  db.query('UPDATE SendSaves SET status = 3'
  + ' WHERE id = '+ req.params.id + ' ;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
      return;
  } else {
    console.log(result)
    res.send(result);
  }
  })
})





// GET all saves received
app.get('/api/get-send-saved-received/:id', (req, res) => {
  db.query('SELECT * FROM SendSaves as s LEFT JOIN BookSaves as b on s.bookId = b.bid'
	+ ' LEFT JOIN PlaceSaves as p on s.placeId = p.pid LEFT JOIN MovieSaves as m on s.movieId = m.mid'
  + ' WHERE userId2 = '+ req.params.id + ' and status = 1 ORDER By id DESC;;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });
});


// GET all saves sent
app.get('/api/get-send-saves-sent/:id', (req, res) => {
  db.query('SELECT * FROM SendSaves as s LEFT JOIN BookSaves as b on s.bookId = b.bid'
	+ ' LEFT JOIN PlaceSaves as p on s.placeId = p.pid LEFT JOIN MovieSaves as m on s.movieId = m.mid'
  + ' WHERE userId1 = '+ req.params.id + ' ORDER By id DESC;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });
});



// POST likes - post on Likes table and update on Saves table







// GET info from specific category tables
// specific id from Saves table
app.get('/api/add-friends/:id', (req, res) => {
  const {category, id} = req.params;

   if (category === "book") {
    db.query('SELECT * FROM Saves', function(err, result) {
      if (err){
          res.status(400).send('Error in database operation');
          return;
      } else {
          res.send(result);
      }
    });
   }


});




// POST friends - post on Friends table when the friend request is sent - done
app.post('/api/add-friends/:id1/:id2', (req, res) => {

  db.query('INSERT INTO Friends (userId1, userId2, status) VALUES ('+ req.params.id1 + ', ' + req.params.id2 + ', 1);', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
      return;
  } else {
      res.send(result);
  }
  });

});


// PUT friends status - either accept or deny - done
// id is table entry id, not a user id
app.put('/api/update-friends/:id/:status', (req, res) => {
  db.query('UPDATE Friends SET status = ' + req.params.status + 
  ' WHERE friendId = ' + req.params.id, function(err, result) {
    if (err){
      res.status(400).send('Error in database operation');
    } else {
      res.send(result);
    }
  });

});


// GET all friends by a user - done 
app.get('/api/get-friends/:id', (req, res) => {
  db.query('SELECT u.id, u.username FROM Users as u LEFT JOIN Friends as f ON u.id = F.userId2 WHERE f.status = 2 and f.userId1 = '
  + req.params.id + ' UNION SELECT u.id, u.username FROM Users as u LEFT JOIN Friends as f ON u.id = F.userId1 WHERE f.status = 2 and f.userId2 = ' 
  + req.params.id + ';', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });
});



// GET all unanswer friends request to a user - done 
app.get('/api/get-friends-requests-from/:id', (req, res) => {
  db.query('SELECT * FROM Friends WHERE userId2 = '+ req.params.id + ' and status = 1;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });
});


// GET all unanswer friends request that a user sent - done
app.get('/api/get-friends-requests-by/:id', (req, res) => {
  db.query('SELECT * FROM Friends WHERE userId1 = '+ req.params.id + ' ;', function(err, result) {
  if (err){
      res.status(400).send('Error in database operation');
  } else {
      res.send(result);
  }
  });
});







app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});

if (process.env.NODE_ENV === "production") {
    app.get("/*", function (request, response) {
      response.sendFile(path.join(__dirname, "build", "index.html"));
    });
}
