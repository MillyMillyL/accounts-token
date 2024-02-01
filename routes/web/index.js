const express = require("express");
const moment = require("moment");
const AccountModel = require("../../models/AccountModel");

//导入中间件检测登录
const checkLoginMiddleware = require("../../middlewares/checkLoginMiddleware");

//创建路由对象
const router = express.Router();
//添加首页路由规则
router.get("/", (req, res) => {
  res.redirect("/account");
});

/* 记账本列表 */
router.get("/account", checkLoginMiddleware, function (req, res, next) {
  AccountModel.find()
    .sort({ time: -1 })
    .then((data) => {
      res.render("list", { accounts: data, moment: moment });
    })
    .catch(() => res.status(500).send("读取失败~~"));
});

/* 添加记账 */
router.get("/account/create", checkLoginMiddleware, function (req, res, next) {
  res.render("create");
});

//新增记录
router.post("/account", checkLoginMiddleware, (req, res) => {
  AccountModel.create({ ...req.body, time: moment(req.body.time).toDate() })
    .then(() =>
      res.render("success", { msg: "添加记录成功~~", url: "/account" })
    )
    .catch(() => res.status(500).send("插入失败~~"));
});

//删除记录
router.get("/account/:id", checkLoginMiddleware, (req, res) => {
  const { id } = req.params;
  AccountModel.deleteOne({ _id: id })
    .then(() =>
      res.render("success", { msg: "删除记录成功~~", url: "/account" })
    )
    .catch(() => res.status(500).send("删除失败~~"));
});

module.exports = router;
