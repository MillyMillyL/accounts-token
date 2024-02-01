var express = require("express");
var router = express.Router();

const UserModel = require("../../models/UserModal");
const md5 = require("md5");

//注册页面
router.get("/reg", (req, res) => {
  res.render("auth/reg");
});

//注册操作
router.post("/reg", (req, res) => {
  UserModel.create({ ...req.body, password: md5(req.body.password) })
    .then(() => {
      res.render("success", { msg: "注册成功", url: "/login" });
    })
    .catch(() => res.status(500).send("注册失败，请稍后再试~~"));
});

//登录页面
router.get("/login", (req, res) => {
  res.render("auth/login");
});

//登录操作
router.post("/login", (req, res) => {
  //获取用户名和密码
  let { username, password } = req.body;
  //查询数据库
  UserModel.findOne({ username: username, password: md5(password) })
    .then((data) => {
      //判断data
      if (!data) {
        return res.send("账号或密码错误");
      }

      //写入session
      req.session.username = data.username;
      //登录成功响应
      res.render("success", { msg: "登录成功", url: "/account" });
    })
    .catch(() => {
      res.status(500).send("注册失败，请稍后再试~~");
    });
});

//退出登录
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("success", { msg: "成功退出登录", url: "/login" });
  });
});
module.exports = router;
