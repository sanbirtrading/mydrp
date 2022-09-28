// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function (req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  if (req.user) {
    return next();
  }
  req.flash('error_message', 'Please log in to access the requested page');
  res.redirect('/auth/login');
  // If the user isnt' logged in, redirect them to the login page
  return res.redirect('/');
};
