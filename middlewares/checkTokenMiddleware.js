const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/config");

//声明中间件
module.exports = (req, res, next) => {
  //获取token
  const token = req.get("token");

  if (!token) {
    return res.json({ code: "2003", msg: "token 缺失", data: null });
  }
  //校验token
  jwt.verify(token, SECRET, (err, data) => {
    if (err) {
      return res.json({ code: "2004", msg: "token 校验失败", data: null });
    }

    req.user = data;

    //如果token校验成功
    next();
  });
};
