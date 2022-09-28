// This is middleware for restrictng routes a user is not allowed to visit if not logged in
module.exports = function (req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  if (req.user.is_admin || req.user.is_manager) {
    return next();
  }
  req.flash(
    'error_message',
    "You don't have the rights to access the requested page"
  );
  res.redirect('/user');
};
