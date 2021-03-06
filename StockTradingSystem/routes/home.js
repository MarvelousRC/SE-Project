var express = require('express');
var schedule = require('node-schedule');
var router = express.Router();
var job1 = '', job2 = '';

// 数据库连接
let dbQuery = require('../database/MySQLquery');

// 引入自定义模块接口
let SecuritiesAccount = require('../sqlClasses/SecuritiesAccount');
let CapitalAccount = require('../sqlClasses/CapitalAccount');
let Stock = require('../sqlClasses/Stock');
let Instructions = require('../sqlClasses/Instructions');

let User = require('../publicFunctionInterfaces/Users');
let Match = require('../publicFunctionInterfaces/Match');

/* GET home page. */
router.get('/', function(req, res, next) {
    let match = new Match();
    match.getStateOfMatch(function (result) {
        let st = (result.start) ? '已开启' : '已关闭';
        let end = (job1 === '' && job2 === '') ? '已关闭' : '已开启';
        res.render('home', {state1: st, state2: end});
    });
});

router.get('/index', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/orderSubmit', function (req, res) {
    let promise1 = new Promise(function (resolve, reject) {
        let res0 = {result: false, remark: ""};
        let user = new User();
        user.checkAllAccountValidity(parseInt(req.body.userId), function (result0) {
            if (result0.result === true) {
                let stock = new Stock();
                stock.getStockPermissionByStockId(req.body.stockId, function (result) {
                    if (result === "1") {
                        let instructions = new Instructions();
                        let capitalAccount = new CapitalAccount();
                        if (req.body.tradeType === "sell") {
                            stock.getStockNumberByPersonIdAndStockId(result0.personId, req.body.stockId, function (result) {
                                if (result === 'notFound') {
                                    res0.remark = "证券账户持股存在问题！";
                                    resolve(res0);
                                } else {
                                    let stockNum = parseInt(result);
                                    if (stockNum < parseInt(req.body.stockNum)) {
                                        res0.remark = "证券账户对应股票持股数不足, 仅持有" + stockNum + "股!";
                                        resolve(res0);
                                    } else {
                                        instructions.addTempInstructions('sell', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                            if (result.status === false) {
                                                res0.remark = "指令存在问题：" + result.info;
                                                resolve(res0);
                                            } else {
                                                stock.convertStockToFrozenStock(result0.personId, req.body.stockId, parseInt(req.body.stockNum), function (result) {
                                                    if (result === true) {
                                                        res0.result = true;
                                                        res0.remark = "股票出售指令发布成功!";
                                                    } else {
                                                        res0.remark = "股票冻结失败!";
                                                    }
                                                    resolve(res0);
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            capitalAccount.getCapitalByCapitalAccountId(parseInt(req.body.userId), function (result) {
                                if (result.result === false) {
                                    res0.remark = result.remark;
                                    resolve(res0);
                                } else {
                                    let availableMoney = result.availableMoney;
                                    let moneyThisTime = parseInt(req.body.stockNum)*parseFloat(req.body.pricePer);
                                    if (availableMoney < moneyThisTime) {
                                        res0.remark = "资金账户可用资金不足, 仅剩" + availableMoney + "元!";
                                        resolve(res0);
                                    } else {
                                        // 买家资金流水记录
                                        capitalAccount.ioAndInterest(parseInt(req.body.userId), -moneyThisTime*1.005, "股票购买支出", function (result) {
                                            if (result === true) {
                                                capitalAccount.convertAvailableMoneyToFrozenMoney(parseInt(req.body.userId), moneyThisTime*1.005, function (result) {
                                                    if (result === true) {
                                                        instructions.addTempInstructions('buy', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                            if (result.status === false) {
                                                                res0.remark = "指令存在问题：" + result.info;
                                                            } else {
                                                                res0.result = true;
                                                                res0.remark = "股票出售指令发布成功!";
                                                            }
                                                            resolve(res0);
                                                        });
                                                    } else {
                                                        res0.remark = "转账失败！";
                                                        resolve(res0);
                                                    }
                                                });
                                            } else {
                                                res0.remark = "Error: 买家资金流水记录失败！";
                                                console.log(res0.remark);
                                                resolve(res0);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else if (result === "0") {
                        res0.remark = "该股票不允许交易！";
                        resolve(res0);
                    } else {
                        res0.remark = "股票不存在！";
                        resolve(res0);
                    }
                });
            } else {
                res0.remark = result0.remark;
                resolve(res0);
            }
        });
    });
    promise1.then(function (res0) {
        res.end(res0.remark);
        if (res0.result === true) {
            console.log("指令加入缓存成功！");
        }
    });
});

router.post('/querySell', function (req, res) {
    let getSql = "select * from asks";
    dbQuery(getSql, [], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        res.end(JSON.stringify(result));
    });
});

router.post('/queryBuy', function (req, res) {
    let getSql = "SELECT * FROM bids";
    dbQuery(getSql, [], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        res.end(JSON.stringify(result));
    });
});

router.post('/queryTemp', function (req, res) {
    let getSql = "SELECT * FROM tempinstructions";
    dbQuery(getSql, [], function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        res.end(JSON.stringify(result));
    });
});

router.post('/start', function (req, res) {
    let match = new Match();
    match.getStateOfMatch(function (result) {
        if (result.start) {
            res.end('撮合系统已经运行!');
        } else {
            match.startMatching(function (result) {
                res.end("Start successfully!");
                match.convertTempInstructionsToInstructions(function (result) {
                    //res.end(result.remark);
                });
            });
        }
    });
});

router.post('/stop', function (req, res) {
    let match = new Match();
    match.getStateOfMatch(function (result) {
        if (result.start) {
            match.stopMatching(function (result) {
                res.end("Stop successfully!");
            });
        } else {
            res.end("撮合系统未在运行!");
        }
    });
});

router.post('/startSystem', function (req, res) {
    if (job1 === '' && job2 === '') {
        let rule1 = new schedule.RecurrenceRule();
        rule1.dayOfWeek = [new schedule.Range(1, 5)];
        rule1.hour = 8;
        rule1.minute = 0;
        rule1.second = 0;
        job1 = schedule.scheduleJob(rule1, function () {
            let match = new Match();
            match.startMatching(function (result) {
                console.log("今日开盘!");
                match.convertTempInstructionsToInstructions(function (result) {
                    //res.end(result.remark);
                });
            });
        });
        let rule2 = new schedule.RecurrenceRule();
        rule2.dayOfWeek = [new schedule.Range(1, 5)];
        rule2.hour = 16;
        rule2.minute = 0;
        rule2.second = 0;
        job2 = schedule.scheduleJob(rule2, function () {
            let match = new Match();
            match.stopMatching(function (result) {
                console.log("今日收盘!");
            });
        });
        res.end("定时自动开盘系统开启成功!");
    } else {
        res.end("定时自动开盘系统已经开启，无法重复开启!");
    }
});

router.post('/stopSystem', function (req, res) {
    if (job1 !== '' && job2 !== '') {
        job1.cancel();
        job2.cancel();
        job1 = '';
        job2 = '';
        res.end("定时自动开盘系统关闭成功!");
    } else {
        res.end("定时自动开盘系统已经关闭，无法重复关闭!");
    }
});

router.post('/queryStockHold', function (req, res) {
    let stock = new Stock();
    stock.getAllStockHoldInfo(function (result) {
        res.end(JSON.stringify(result));
    });
});

router.post('/queryCapital', function (req, res) {
    let capitalAccount = new CapitalAccount();
    capitalAccount.getAllCapitalAccountInfo(function (result) {
        res.end(JSON.stringify(result));
    });
});

router.post('/queryMatch', function (req, res) {
    let match = new Match();
    match.getAllMatch(function (result) {
        res.end(JSON.stringify(result));
    });
});

router.post('/queryStock', function (req, res) {
    let stock = new Stock();
    stock.getAllStockInfo(function (result) {
        res.end(JSON.stringify(result));
    });
});

module.exports = router;
