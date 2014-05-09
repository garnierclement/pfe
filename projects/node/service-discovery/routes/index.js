var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Node Monitoring Platform' });
});


/* GET Service-listing page. */
router.get('/service-list',function(req, res){ 
   res.render('service-list',{ title:'Service List'})
});

module.exports = router;
