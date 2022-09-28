require('dotenv').config();
const path = require('path');

const db = require('./models');
const morgan = require('morgan');
const express = require('express');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cors = require('cors');
const paypal = require('paypal-rest-sdk');

const port = process.env.PORT;

const app = express();

// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': '####yourclientid######',
//   'client_secret': '####yourclientsecret#####'
// });

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const ipRoutes = require('./routes/ip');
const machineRoutes = require('./routes/machine');
const paymentRoutes = require('./routes/payment');
const requestRoutes = require('./routes/request');
const serverRoutes = require('./routes/server');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notifications');

app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(
  session({
    secret: 'sadasdsat',
    resave: true,
    saveUninitialized: true,
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(flash());

app.use(async function (req, res, next) {
  const requestsCount = await db.Request.count({
    where: {
      resolved: false,
    },
  });
  const requests = await db.Request.findAll({
    where: {
      resolved: false,
    },
    order: [['createdAt', 'DESC']],
    raw: true,
  });
  res.locals.success_alert_message = req.flash('success_alert_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  res.locals.requestsCount = requestsCount;
  res.locals.requests = requests;
  try {
    const notifications = await db.Notification.findAll({
      where: {
          is_read: false,
          receiver: res.locals.currentUser.id
        },
      raw: true,
    });
    const notificationsCount = notifications.length;
    res.locals.notifications = notifications;
    res.locals.notificationsCount = notificationsCount;
  } catch {
    const notifications = {};
    const notificationsCount = 0;
    res.locals.notifications = notifications;
    res.locals.notificationsCount = notificationsCount;
  }
  next();
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/contact-us', (req, res, next) =>
  res.render('contact-us', { pageTitle: 'Contact Us' })
);
app.use('/ip', ipRoutes);
app.use('/machine', machineRoutes);
app.use('/payment', paymentRoutes);
app.use('/request', requestRoutes);
app.use('/server', serverRoutes); // !
app.use('/user', userRoutes);
app.use('/notification', notificationRoutes);
app.use('/', (req, res, next) => {
  if (req.user) {
    res.redirect(302, '/user');
  } else {
    res.render('index', { pageTitle: 'Home' });
  }
});

// app.post('/pay', (req, res) => {
//   const create_payment_json = {
//     "intent": "sale",
//     "payer": {
//         "payment_method": "paypal"
//     },
//     "redirect_urls": {
//         "return_url": "http://localhost:3000/success",
//         "cancel_url": "http://localhost:3000/cancel"
//     },
//     "transactions": [{
//         "item_list": {
//             "items": [{
//                 "name": "Redhock Bar Soap",
//                 "sku": "001",
//                 "price": "25.00",
//                 "currency": "USD",
//                 "quantity": 1
//             }]
//         },
//         "amount": {
//             "currency": "USD",
//             "total": "25.00"
//         },
//         "description": "Washing Bar soap"
//     }]
// };

// paypal.payment.create(create_payment_json, function (error, payment) {
//   if (error) {
//       throw error;
//   } else {
//       for(let i = 0;i < payment.links.length;i++){
//         if(payment.links[i].rel === 'approval_url'){
//           res.redirect(payment.links[i].href);
//         }
//       }
//   }
// });

// });

// app.get('/success', (req, res) => {
//   const payerId = req.query.PayerID;
//   const paymentId = req.query.paymentId;

//   const execute_payment_json = {
//     "payer_id": payerId,
//     "transactions": [{
//         "amount": {
//             "currency": "USD",
//             "total": "25.00"
//         }
//     }]
//   };

//   paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
//     if (error) {
//         console.log(error.response);
//         throw error;
//     } else {
//         console.log(JSON.stringify(payment));
//         res.send('Success');
//     }
// });
// });

// app.get('/cancel', (req, res) => res.send('Cancelled'));

app.listen(port, async () => {
  console.log(`App is listening at port: ${port}`);
  try {
    await db.sequelize.sync({ force: false });
    console.log('Connected to database');
  } catch (error) {
    console.error(`Error: Cannot connect to database ${error}`);
  }
});
