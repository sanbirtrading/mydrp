const db = require('../models');

exports.clearNotificationInbox = async (req,res,next) => {
    try {
        const notifications = await db.Notification.findAll({
            where: {
                receiver: req.user.id
            }
        })
        for (let notification of notifications){
            await notification.destroy();
        }
        res.redirect(303, '/server')
    } catch (err) {
        if ('errors' in err) {
          req.flash('error_message', err.errors[0].message);
        }
        req.flash('error_message', err.message);
        res.redirect(303, '/server');
      }
}