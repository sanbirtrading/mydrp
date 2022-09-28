const db = require('../models');
const Sequelize = require('sequelize');

exports.getMachine = async (req, res, next) => {
  try {
    const users = await db.User.findAll();
    const machines = await db.Machine.findAll({ include: db.User, raw: true });
    res.render('machines', {
      pageTitle: 'Machines',
      users: users,
      machines: machines,
    });
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/server');
  }
};

exports.postMachine = async (req, res, next) => {
  try {
    const machine = await db.Machine.create({
      ip: req.body.ip,
      port: req.body.port,
      machine_owner: parseInt(req.body.user),
      status: false,
      password: req.body.password,
      cpu: req.body.cpu,
      ram: req.body.ram,
      hard_disk: req.body.hard_disk,
      comment: req.body.comment,
    });
    req.flash('success_alert_message', 'Machine has been successfully added!');
    res.redirect(302, '/machine');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/server');
  }
};

exports.editMachine = async (req, res, next) => {
  try {
    const machine = await db.Machine.findOne({
      where: {
        id: req.params.id,
      },
    });
    if ('status' in req.body) {
      var status = req.body.status;
    } else {
      var status = false;
    }
    console.log(req.body);
    machine.ip = req.body.ip;
    machine.port = req.body.port;
    machine.password = req.body.password;
    machine.cpu = req.body.cpu;
    machine.ram = req.body.ram;
    machine.status = status;
    machine.hard_disk = req.body.hard_disk;
    machine.comment = req.body.comment;
    await machine.save();

    req.flash(
      'success_alert_message',
      'Machine has been successfully updated!'
    );
    res.redirect(302, '/machine');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/machine');
  }
};

exports.deleteMachine = async (req, res, next) => {
  try {
    const machine = await db.Machine.findOne({
      where: {
        id: req.params.id,
      },
    });
    await machine.destroy();
    req.flash(
      'success_alert_message',
      'Machine has been successfully deleted!'
    );
    res.redirect(302, '/machine');
  } catch (err) {
    if ('errors' in err) {
      req.flash('error_message', err.errors[0].message);
    }
    req.flash('error_message', err.message);
    res.redirect(303, '/machine');
  }
};
