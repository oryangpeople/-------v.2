const express = require('express');
const { list } = require('mongodb/lib/gridfs/grid_store');
const app = express()
app.use(express.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))


// db연결
var db;
MongoClient.connect('mongodb+srv://Seoljiwoo:twin0413@cluster0.gavn4ux.mongodb.net/', { useUnifiedTopology: true }, function(error, client){
  if (error) return console.log(error)
  db = client.db('booknight');
  app.listen(8080, function() {
    console.log('listening on 8080')

    // TypeError: Cannot read properties of null (reading 'totalPost') 이딴 에러 뜨면 주석 지우고 한번만 실행 후 주석처리하기
    // db.counter.insertOne({ name: 'reportNum', totalPost: 0 })
  })
})
// index.html 주소 
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
})
// write.html 주소
app.get('/write', function(req, res){
    res.sendFile(__dirname + '/write.html')
})

// 보고서 내용,id 저장
app.post('/list', function(req, res){
    console.log('전송완료')
    db.collection('counter').findOne({name : 'reportNum'}, function(error, result){
      var totalPostNum = result.totalPost;
      db.collection('report').insertOne({_id :totalPostNum + 1 ,학번이름: req.body.name, 비번: req.body.password, 제목 : req.body.title, 내용 : req.body.content}, function(error, result){
      console.log('저장완료')
      db.collection('counter').updateOne({name : 'reportNum'}, { $inc : {totalPost:1}}, function(error, result){
        if(error){return console.log(error)}
     })

   });
      
 });

});
// 삭제 기능
app.delete('/delete', function(req, res){
    req.body._id = parseInt(req.body._id); 
    console.log(req.body)
    db.collection('report').deleteOne(req.body, function(error, result){
      console.log('삭제완료');
      res.status(200).send({ message : '삭제완료'});
    })
})

// db에서 데이터 가져오기
app.get('/list', function(req, res){
  db.collection('report').find().toArray(function(error, result){
    console.log(result);
    res.render('list.ejs', {posts : result});
  });
  
});
// 상세 페이지
app.get('/detail/:id', function(req, res){
    db.collection('report').findOne({_id : parseInt(req.params.id) }, function(error, result){
      console.log(result);
      res.render('detail.ejs', { data : result })
    })
  })

//보고서
app.get('/edit/:id', function(req, res){
  db.collection('report').findOne({_id : parseInt(req.params.id) }, function(error, result){
    console.log(result);
    res.render('edit.ejs', { data : result })
  })
  
})

app.put('/edit', function(req, res){
  db.collection('report').updateOne({_id : parseInt(req.body.id) }, {$set : {학번이름: req.body.name, 비번: req.body.password, 제목 : req.body.title, 내용 : req.body.content}} , function(error, result){
    console.log('수정완료')
  })
});


app.get('/manage_list', function(req, res){
db.collection('report').find().toArray(function(error, result){
console.log(result);
res.render('manage_list.ejs', {posts : result});
});
})

app.get('/IT_list', function(req, res){
db.collection('report').find().toArray(function(error, result){
console.log(result);
res.render('IT_list.ejs', {posts : result});
});
})

app.get('/bio_list', function(req, res){
db.collection('report').find().toArray(function(error, result){
  console.log(result);
  res.render('bio_list.ejs', {posts : result});
});
})

app.get('/medical_list', function(req, res){
  db.collection('report').find().toArray(function(error, result){
    console.log(result);
    res.render('medical_list.ejs', {posts : result});
  });
})

app.get('/etc_list', function(req, res){
  db.collection('report').find().toArray(function(error, result){
    console.log(result);
    res.render('etc_list.ejs', {posts : result});
  });
})