var express = require("express");
const checkTokenMiddleware = require("../../middlewares/checkTokenMiddleware");
var router = express.Router();

const moment = require("moment");
const AccountModel = require("../../models/AccountModel");

/* 记账本列表 */
router.get("/account", checkTokenMiddleware, function (req, res, next) {
  console.log(req.user);
  AccountModel.find()
    .sort({ time: -1 })
    .then((data) => {
      res.json({
        code: "0000",
        msg: "读取成功",
        data: { accounts: data, moment: moment },
      });
    })
    .catch(() => res.json({ code: "1001", msg: "读取失败", data: null }));
});

//新增记录
router.post("/account", checkTokenMiddleware, (req, res) => {
  AccountModel.create({ ...req.body, time: moment(req.body.time).toDate() })
    .then((data) => res.json({ code: "0000", msg: "创建成功...", data: data }))
    .catch(() => res.json({ code: "1002", msg: "创建失败~~", data: null }));
});

//删除记录
router.delete("/account/:id", checkTokenMiddleware, (req, res) => {
  let { id } = req.params;
  AccountModel.deleteOne({ _id: id })
    .then((data) => res.json({ code: "0000", msg: "删除成功~~", data: data }))
    .catch(() => res.json({ code: "1003", msg: "删除账单失败~~", data: null }));
});

//获取单个账单
router.get("/account/:id", checkTokenMiddleware, (req, res) => {
  let { id } = req.params;
  AccountModel.findById(id)
    .then((data) => {
      res.json({
        code: "0000",
        msg: "读取成功",
        data: data,
      });
    })
    .catch(() => res.json({ code: "1004", msg: "读取失败", data: null }));
});

//更新单个账单信息
router.patch("/account/:id", checkTokenMiddleware, (req, res) => {
  let { id } = req.params;

  AccountModel.updateOne({ _id: id }, req.body)
    .then(() => {
      AccountModel.findById(id)
        .then((data) => {
          res.json({
            code: "0000",
            msg: "更新成功",
            data: data,
          });
        })
        .catch(() => res.json({ code: "1004", msg: "读取失败", data: null }));
    })
    .catch(() => res.json({ code: "1005", msg: "读取失败", data: null }));
});
module.exports = router;
