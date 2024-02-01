var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { SECRET } = require("../../config/config");

const UserModel = require("../../models/UserModal");
const md5 = require("md5");

//登录操作
router.post("/login", (req, res) => {
  //获取用户名和密码
  let { username, password } = req.body;
  //查询数据库
  UserModel.findOne({ username: username, password: md5(password) })
    .then((data) => {
      //判断data
      if (!data) {
        return res.json({
          code: "2002",
          msg: "用户名或密码错误~~~",
          data: null,
        });
      }
      //创建当前用户的token
      const token = jwt.sign(
        { username: data.username, _id: data._id },
        SECRET,
        { expiresIn: 60 * 60 * 24 * 7 }
      );
      //响应token
      res.json({ code: "0000", msg: "登录成功", data: token });
    })
    .catch(() => {
      res.json({ code: "2001", msg: "数据库读取失败~~~", data: null });
    });
});

//退出登录
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.render("success", { msg: "成功退出登录", url: "/login" });
  });
});
module.exports = router;
