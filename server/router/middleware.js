exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).send('로그인 필요');
    }
  };
  
  exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      next();
    } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
    }
  };

exports.render = function(req,res) { 
if(req.session.lastVisit) {
        console.log(req.session.lastVisit); 
} 
    var time = new Date(); 
    req.session.lastVisit = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" .. " +time.getHours()+"-"+time.getMinutes()+"-"+time.getSeconds(); 
    res.render('index', {title : 'First Title'}); 
}
