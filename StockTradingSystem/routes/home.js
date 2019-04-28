var express = require('express');
var router = express.Router();

// 数据库连接
var dbConnection = require('../database/MySQLconnection');

// 引入自定义模块接口
var Accounts = require('../interfaces/accountsRelated');
var Money = require('../interfaces/moneyRelated');
var Stock = require('../interfaces/stockRelated');
var Instructions = require('../interfaces/instructionsRelated');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home');
});

router.get('/index', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/orderSubmit', function (req, res) {
<<<<<<< HEAD
    // 步骤一 检验指令和账户的有效性然后插入有效的指令数据
    var promise1 = new Promise(function (resolve, reject) {
        let returnState = false;
        let returnMessage = "";
        console.log(req.body);
        var accounts = new Accounts();
        accounts.getCapitalAccountState(parseInt(req.body.userId), function (result) {
            if (result !== 'normal') {
                returnMessage = "资金账户异常或不存在!";
                res.end(returnMessage);
                resolve(returnState);
            } else {
                accounts.getAccountidByCapitalAccountid(parseInt(req.body.userId), function (result) {
                    try {
                        let accountid = parseInt(result);
                        accounts.getAccountidState(accountid, function (result) {
                            if (result !== 'normal') {
                                returnMessage = "证券账户异常或不存在!";
                                res.end(returnMessage);
                                resolve(returnState);
                            } else {
                                var instructions = new Instructions();
                                if (req.body.tradeType === "sell") {
                                    accounts.getPersonidByAccountid(accountid, function (result) {
                                        try {
                                            let personid = parseInt(result);
                                            var stock = new Stock();
                                            stock.getStockNumberByPersonidAndStockid(personid, req.body.stockId, function (result) {
                                                try {
                                                    let stockNum = parseInt(result);
                                                    if (stockNum < parseInt(req.body.stockNum)) {
                                                        returnMessage = "证券账户对应股票持股数不足, 仅持有" + stockNum + "股!";
                                                        res.end(returnMessage);
                                                        resolve(returnState);
=======
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
                                        stock.convertStockToFrozenStock(result0.personId, req.body.stockId, parseInt(req.body.stockNum), function (result) {
                                            if (result === true) {
                                                instructions.addTempInstructions('sell', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                    if (result.status === false) {
                                                        res0.remark = "指令存在问题：" + result.info;
>>>>>>> master
                                                    } else {
                                                        instructions.addInstructions("sell", personid, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                            if (result === "Add Failed!") {
                                                                returnMessage = "指令插入数据库时出现异常!";
                                                            } else {
                                                                returnState = true;
                                                                returnMessage = "股票出售指令发布成功!";
                                                            }
                                                            res.end(returnMessage);
                                                            resolve(returnState);
                                                        });
                                                    }
                                                } catch (error) {
                                                    console.log(error.message);
                                                    returnMessage = "证券账户持股存在问题!";
                                                    res.end(returnMessage);
                                                    resolve(returnState);
                                                }
                                            });
                                        } catch (error) {
                                            console.log(error.message);
                                            returnMessage = "证券账户存在问题!";
                                            res.end(returnMessage);
                                            resolve(returnState);
                                        }
                                    });
                                } else {
<<<<<<< HEAD
                                    var money = new Money();
                                    money.getAvailableMoneyByCapitalAccountid(parseInt(req.body.userId), function (result) {
                                        try {
                                            let haveMoney = parseFloat(result);
                                            if (haveMoney < parseInt(req.body.stockNum)*parseFloat(req.body.pricePer)) {
                                                returnMessage = "资金账户可用资金不足, 仅剩" + haveMoney + "元!";
                                                res.end(returnMessage);
                                                resolve(returnState);
                                            } else {
                                                money.convertAvailableMoneyToFrozenMoney(parseInt(req.body.userId), parseInt(req.body.stockNum)*parseFloat(req.body.pricePer), function (result) {
                                                    if (result === "Error!") {
                                                        returnMessage = "转账时出现异常!";
                                                        res.end(returnMessage);
                                                        resolve(returnState);
                                                    } else {
                                                        instructions.addInstructions("sell", personid, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                            if (result === "Add Failed!") {
                                                                returnMessage = "指令插入数据库时出现异常!";
                                                            } else {
                                                                returnState = true;
                                                                returnMessage = "股票购买指令发布成功!";
=======
                                    let availableMoney = result.availableMoney;
                                    let moneyThisTime = parseInt(req.body.stockNum)*parseFloat(req.body.pricePer);
                                    if (availableMoney < moneyThisTime) {
                                        res0.remark = "资金账户可用资金不足, 仅剩" + availableMoney + "元!";
                                        resolve(res0);
                                    } else {
                                        // 买家资金流水记录
                                        capitalAccount.ioAndInterest(parseInt(req.body.userId), -moneyThisTime, "股票购买支出", function (result) {
                                            if (result === true) {
                                                capitalAccount.convertAvailableMoneyToFrozenMoney(parseInt(req.body.userId), moneyThisTime, function (result) {
                                                    if (result === true) {
                                                        instructions.addTempInstructions('buy', result0.personId, req.body.stockId, parseInt(req.body.stockNum), parseFloat(req.body.pricePer), function (result) {
                                                            if (result.status === false) {
                                                                res0.remark = "指令存在问题：" + result.info;
                                                            } else {
                                                                res0.result = true;
                                                                res0.remark = "股票出售指令发布成功!";
>>>>>>> master
                                                            }
                                                            res.end(returnMessage);
                                                            resolve(returnState);
                                                        });
                                                    }
                                                });
                                            }
                                        } catch (error) {
                                            console.log(error.message);
                                            returnMessage = "资金账户可用资金存在问题!";
                                            res.end(returnMessage);
                                            resolve(returnState);
                                        }
                                    });
                                }
                            }
                        });
                    } catch (error) {
                        console.log(error.message);
                        returnMessage = "资金账户不存在对应的证券账户!";
                        res.end(returnMessage);
                        resolve(returnState);
                    }
                });
            }
        });
    });
    // 步骤二 查询新入指令对应股票的全部出售指令
    var promise2 = new Promise(function (resolve, reject) {
        var instructions = new Instructions();
        instructions.getPartialInstructionsByStockid("sell", req.body.stockId, function (result) {
            resolve(result);
        });
    });
    // 步骤三 查询新入指令对应股票的全部购买指令
    var promise3 = new Promise(function (resolve, reject) {
        var instructions = new Instructions();
        instructions.getPartialInstructionsByStockid("buy", req.body.stockId, function (result) {
            resolve(result);
        });
    });
    // 执行代码
    promise1.then(function (reState) {
        if (reState) {
            promise2.then(function (result) {
                let asks = result;
                promise3.then(function (result) {
                    let bids = result;
                    console.log(asks);
                    console.log(bids);
                    //todo: 股票撮合代码填充处 建议使用promise强制执行顺序
                });
            });
        }
    });
});

router.post('/queryCell', function (req, res) {
    let getSql = "select * from asks";
    dbConnection.query(getSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('SELECT result:', result);
        res.end(JSON.stringify(result));
    });
});

router.post('/queryBuy', function (req, res) {
    let getSql = "SELECT * FROM bids";
    dbConnection.query(getSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('SELECT result:', result);
        res.end(JSON.stringify(result));
    });
});

<<<<<<< HEAD
router.post('/test', function (req, res) {
    var accounts = new Accounts();
    accounts.getAccountidByPersonid(parseInt(req.body.userId), function (result) {
        let returnText = "" + result;
        res.end(returnText);
=======
router.post('/queryTemp', function (req, res) {
    let getSql = "SELECT * FROM tempinstructions";
    dbConnection.query(getSql, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        console.log('SELECT result:', result);
        res.end(JSON.stringify(result));
    });
});

router.post('/start', function (req, res) {
    let match = new Match();
    match.startMatching(function (result) {
        res.end("Start successfully!");
        match.convertTempInstructionsToInstructions(function (result) {
            //res.end(result.remark);
        });
    });
});

router.post('/stop', function (req, res) {
    let match = new Match();
    match.stopMatching(function (result) {
        res.end("Stop successfully!");
>>>>>>> master
    });
});

module.exports = router;
