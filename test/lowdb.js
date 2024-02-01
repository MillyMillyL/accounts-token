const low = require("lowdb");

const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");

const db = low(adapter);

//初始化数据
db.defaults({ posts: [], user: {} }).write();
