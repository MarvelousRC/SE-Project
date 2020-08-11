// 数据库连接
let dbQuery = require('../database/MySQLquery');

// 引用的其他功能类
let Stock = require('../sqlClasses/Stock');
let CapitalAccount = require('../sqlClasses/CapitalAccount');
let User = require('../publicFunctionInterfaces/Users');
/*
* Instructions类：包含对数据库表格bids、asks、matchs、dealsbid、dealsask的直接SQL操作
* 维护小组：D组
* */
function Instructions() {
    this.stock = new Stock();
    this.capitalAccount = new CapitalAccount();
    this.user = new User();
    /****查询方法****/
    //Info查询
    /*
    方法名称：getInstructionsInfoByPersonId
    实现功能：通过personid获取股票指令发布信息
    传入参数：tradeType（'sell', 'buy'）、personId（整数）、回调函数
    回调参数：json：直接承接result
    编程者：孙克染
    备注：调用时需要判断结果length>0；按时间从新到旧的顺序排列
    * */
    this.getInstructionsInfoByPersonId = function (tradeType, personId, callback) {
        let getSql = "SELECT * FROM ";
        if (tradeType === "sell") {
            getSql += "asks WHERE uid = ? ORDER BY time DESC";
        } else {
            getSql += "bids WHERE uid = ? ORDER BY time DESC";
        }
        let getSqlParams = [personId];
        dbQuery(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: getInstructionsInfoByPersonId");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    /*
    方法名称：getTheFirstTempInstructionInfo
    实现功能：获取优先级最高的一条临时缓存交易指令
    传入参数：回调函数
    回调参数：json：直接承接result
    编程者：孙克染
    备注：调用时需要判断结果length>0；按时间从新到旧的顺序排列；D组外小组请勿调用
    * */
    this.getTheFirstTempInstructionInfo = function (callback) {
        let getSql = "SELECT * FROM tempinstructions ORDER BY time ASC LIMIT 1";
        dbQuery(getSql, [], function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: getTheFirstTempInstructionInfo");
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }
            callback(result);
        });
    };
    //单项查询
    /*
    方法名称：getCorInstructionHiPriority
    实现功能：获取对应的撮合优先级最高的指令
    传入参数：tradeType（'sell', 'buy'）、stockId（字符串）、priceThreshold（浮点数）、回调函数
    回调参数：res = {result: false, id: 0, personId: 0, shares2trade: 0, price: 0, shares: 0};
    编程者：孙克染、陈玮烨
    * */
    this.getCorInstructionHiPriority = function (tradeType, stockId, priceThreshold, callback) {
        let res = {result: false, id: 0, personId: 0, shares2trade: 0, price: 0, shares: 0};
        let getSql = "SELECT * FROM ";
        // 注意此处传进来的时需要匹配的交易类型，查找的指令表应当与传入参数相反
        if (tradeType === "buy") {
            getSql += "asks WHERE code = ? AND status = 'partial' AND price <= ? ORDER BY price ASC, time ASC limit 1";
        } else {
            getSql += "bids WHERE code = ? AND status = 'partial' AND price >= ? ORDER BY price DESC, time ASC limit 1";
        }
        let getSqlParams = [stockId, priceThreshold];
        dbQuery(getSql, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: getCorInstructionHiPriority");
                console.log('[SELECT ERROR] - ', err.message);
                callback(res);
                return;
            }
            if (result.length > 0) {
                res.personId = result[0].uid;
                res.result = true;
                res.id = result[0].id;
                res.price = result[0].price;
                res.shares = result[0].shares;
                res.shares2trade = result[0].shares2trade;
                callback(res);
            } else {
                callback(res);
            }
        });
    };
    /*
    方法名称：getOrderInfoByID
    实现功能：根据指令编号和类型获取指令信息
    传入参数：orderType（'sell', 'buy'）、instructionID、回调函数
    回调参数：res = {result: false, status: '', id: 0, time: undefined, uid: 0, code: '', shares2trade: 0, price: 0, shares: 0};
    编程者：陈玮烨、孙克染、杨清杰
    * */
    this.getOrderInfoByID = function (instructionID, orderType, callback) {
        let res = {result: false, status: '',
            id: 0, time: undefined, uid: 0, code: '', shares2trade: 0, price: 0, shares: 0};
        let getSQL = "select * from ? where id = ?;";
        let getSQLParams = [];
        if (orderType === "sell"){
            getSQLParams.push("asks", instructionID);
        }
        else {
            getSQLParams.push("bids", instructionID);
        }
        dbQuery(getSQL, getSQLParams, function(err, result) {
            if (err) {
                console.log("ERROR: Instructions: getOrderInfoByID");
                console.log('[SELECT ERROR] - ', err.message);
                callback(res);
                return;
            }
            if (result.length === 0){
                callback(res);
                return;
            }
            res.result = true;
            res.status = result[0].status;
            res.id = result[0].id;
            res.time = result[0].time;
            res.uid = result[0].uid;
            res.code = result[0].code;
            res.shares2trade = result[0].shares2trade;
            res.price = result[0].price;
            res.shares = result[0].shares;
            callback(res);
        });
    };
    /*
    方法名称：getIfCanLogout
    实现功能：获取能否销户
    传入参数：personId、回调函数
    回调参数：res = false / true
    编程者：孙克染
    * */
    this.getIfCanLogout = function (personId, callback) {
        let res = false;
        let getSql1 = "SELECT * FROM asks WHERE status = ? AND uid = ?";
        let getSql2 = "SELECT * FROM bids WHERE status = ? AND uid = ?";
        let getSqlParams = ['partial', personId];
        dbQuery(getSql1, getSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: getIfHaveValidInstruction1");
                console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            if (result.length > 0) {
                callback(res);
            } else {
                dbQuery(getSql2, getSqlParams, function (err, result) {
                    if (err) {
                        console.log("ERROR: Instructions: getIfHaveValidInstruction2");
                        console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    if (result.length > 0) {
                        callback(res);
                    } else {
                        res = true;
                        callback(res);
                    }
                });
            }
        });
    };
    /****插入方法****/
    /*
    方法名称：addTempInstructions
    实现功能：插入缓存交易指令
    传入参数：tradeType（'sell', 'buy'）、personId（整数）、stockId（字符串）、shares（整数）、price（浮点数）、回调函数
    回调参数：res={info: (Message), status: (Bool, true for success}
    编程者：陈玮烨、孙克染
    * */
    this.addTempInstructions = function (tradeType, personId, stockId, shares, price, callback) {
        let res = {info: "", status: false};
        if (shares <= 0)
        {
            res.info = "交易股数必须为正整数。";
            res.status = false;
            callback(res);
            return;
        }
        if (price <= 0)
        {
            res.info = "价格必须为正数。";
            res.status = false;
            callback(res);
            return;
        }

        this.stock.getPriceCeilFloor(stockId, function (result) {
            if (result.status === false){
                res.info = result.message;  // 没有指定代号的股票
                res.status = false;
                callback(res);
                return;
            }
            const low = result.low;
            const high = result.high;
            if (price < low && tradeType === 'buy'){
                res.info = "非法的交易价格; " + result.message;  // 没有指定代号的股票
                res.status = false;
                callback(res);
                return;
            }

            let addSql = "INSERT INTO tempinstructions(tradetype, uid, code, shares, price) VALUES(?,?,?,?,?)";
            let addSqlParams = [tradeType, personId, stockId, shares, price];
            dbQuery(addSql, addSqlParams, function (err, result) {
                if (err) {
                    console.log("ERROR: Instructions: addTempInstructions");
                    console.log('[INSERT ERROR] - ', err.message);
                    res.info = "插入数据库时出现问题。";
                    res.status = false;
                    callback(res);
                    return;
                }
                res.info = "发布成功。";
                res.status = true;
                callback(res);
            });
        });
    };
    /*
    方法名称：addMatchs
    实现功能：插入撮合记录
    传入参数：askId、bidId、shares（整数）、askPrice（浮点数）、bidPrice（浮点数）、matchPrice（浮点数）、stockId（字符串）、回调函数
    回调参数：true（插入成功）, false（插入失败）
    编程者：孙克染
    * */
    this.addMatchs = function (askId, bidId, shares, askPrice, bidPrice, matchPrice, stockId, callback) {
        let addSql = "INSERT INTO matchs(askid, bidid, shares, askprice, bidprice, matchprice, code) VALUES(?,?,?,?,?,?,?)";
        let addSqlParams = [askId, bidId, shares, askPrice, bidPrice, matchPrice, stockId];
        dbQuery(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: addMatchs");
                console.log('[INSERT ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /*
    方法名称：addDeals
    实现功能：插入成交记录
    传入参数：tradeType、instructionId, shares, sharesDealed, price, stockId,、回调函数
    回调参数：true（插入成功）, false（插入失败）
    编程者：孙克染
    * */
    this.addDeals = function (tradeType, instructionId, shares, sharesDealed, price, stockId, callback) {
        let addSql = "INSERT INTO ";
        if (tradeType === "sell") {
            addSql += 'dealsask(id, shares, sharesdealed, price, code) VALUES(?,?,?,?,?)';
        } else {
            addSql += 'dealsbid(id, shares, sharesdealed, price, code) VALUES(?,?,?,?,?)';
        }
        let addSqlParams = [instructionId, shares, sharesDealed, price, stockId];
        dbQuery(addSql, addSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: addDeals");
                console.log('[INSERT ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
    /****更新方法****/
    /*
    方法名称：modifyShares2TradeByInstructionId
    实现功能：更新撮合的指令信息
    传入参数：tradeType（'sell', 'buy'）、instructionId（整数）、deltaShares（整数）、回调函数
    回调参数：true（更新成功）, false（更新失败）
    编程者：孙克染
    * */
    this.modifyShares2TradeByInstructionId = function (tradeType, instructionId, deltaShares, callback) {
        let modSql = "UPDATE ";
        let modSqlParams = [deltaShares, instructionId];
        if (tradeType === "sell") {
            modSql += 'asks SET shares2trade = shares2trade - ? WHERE id = ?';
        } else {
            modSql += 'bids SET shares2trade = shares2trade - ? WHERE id = ?';
        }
        dbQuery(modSql, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: modifyShares2TradeByInstructionId");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            Instructions.completeInstructions(function (result) {
                callback(result);
            });
        });
    };
    /*
    方法名称：completeInstructions
    实现功能：完成指令状态更新
    传入参数：回调函数
    回调参数：true（更新成功）, false（更新失败）
    编程者：孙克染
    备注：类成员函数，仅限于类内调用
    * */
    Instructions.completeInstructions = function (callback) {
        let modSql1 = "UPDATE asks SET status = ?, timearchived = current_timestamp(6) WHERE shares2trade = 0 AND status = ?;";
        let modSql2 = "UPDATE bids SET status = ?, timearchived = current_timestamp(6) WHERE shares2trade = 0 AND status = ?;";
        let modSqlParams = ['complete', 'partial'];
        dbQuery(modSql1, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: completeInstructions1");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            dbQuery(modSql2, modSqlParams, function (err, result) {
                if (err) {
                    console.log("ERROR: Instructions: completeInstructions2");
                    console.log('[UPDATE ERROR] - ', err.message);
                    callback(false);
                    return;
                }
                callback(true);
            });
        });
    };
    /*
    方法名称：withdrawInstruction
    实现功能：撤回指令
    传入参数：tradeType（'sell', 'buy'）、instructionId（整数）、回调函数
    回调参数：true（更新成功）, false（更新失败）
    编程者：孙克染、陈玮烨
    * */
    this.withdrawInstruction = function (tradeType, instructionId, callback) {
        let instruct = this;
        Instructions.completeInstructions(function (result) {
            if (result === false){
                callback(false);
                return;
            }
            let modSql = "UPDATE ";
            let modSqlParams = [instructionId];
            if (tradeType === "sell") {
                modSql += "asks SET status = 'withdrawn', timearchived = current_timestamp() WHERE id = ?;";
            } else {
                modSql += "bids SET status = 'withdrawn', timearchived = current_timestamp() WHERE id = ?;";
            }
            dbQuery(modSql, modSqlParams, function (err, result) {
                if (err) {
                    console.log("ERROR: Instructions: withdrawInstruction");
                    console.log('[UPDATE ERROR] - ', err.message);
                    callback(false);
                    return;
                }
                instruct.getOrderInfoByID(instructionId, tradeType, function (res) {
                    const shares2trade = res.shares2trade;
                    const price = res.price;
                    const uid = res.uid;
                    const code = res.code;
                    if (tradeType === "sell"){
                        instruct.stock.modifyFrozenStockHoldNumber(uid, code, -shares2trade, function (result) {
                            if (result === false){
                                callback(false);
                                return;
                            }
                            instruct.stock.modifyStockHoldNumber(uid, code, shares2trade, function (result) {
                                callback(result);
                            });
                        });
                    }
                    else {  // 撤回买指令
                        let returnedFund = shares2trade * price;
                        instruct.user.getCapitalAccountIdByPersonId(uid, function (result) {
                            if (result.result === true) {
                                let capitalAccountId = result.capitalAccountId;
                                instruct.capitalAccount.ioAndInterest(capitalAccountId, returnedFund, "撤回指令 (bidid: " + instructionId + ") 资金解冻", function (result) {
                                    instruct.capitalAccount.convertFrozenMoneyToAvailableMoney(capitalAccountId, returnedFund, function (result) {
                                        callback(true);
                                    });
                                });
                            } else {
                                callback(false);
                            }
                        });
                    }
                });
            });
        });
    };
    /*
    方法名称：expireInstructions
    实现功能：指令过期
    传入参数：回调函数
    回调参数：true（删除成功）, false（删除失败）
    编程者：陈玮烨、杨清杰、孙克染
    备注：仅限于D组调用！
    * */
    this.expireInstructions = function (callback){
        let modSql1 = "UPDATE asks SET status = ?, timearchived = current_timestamp(6) WHERE status = 'partial';";
        let modSql2 = "UPDATE bids SET status = ?, timearchived = current_timestamp(6) WHERE status = 'partial';";
        let modSqlParams = ['expired'];
        dbQuery(modSql1, modSqlParams, function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: expireInstructions1");
                console.log('[UPDATE ERROR] - ', err.message);
                callback(false);
                return;
            }
            dbQuery(modSql2, modSqlParams, function (err, result) {
                if (err) {
                    console.log("ERROR: Instructions: expireInstructions2");
                    console.log('[UPDATE ERROR] - ', err.message);
                    callback(false);
                    return;
                }
                callback(true);
            });
        });
    };
    /****删除方法****/
    /*
    方法名称：deleteTheFirstTempInstruction
    实现功能：删除第一位的缓存指令
    传入参数：回调函数
    回调参数：true（删除成功）, false（删除失败）
    编程者：孙克染
    备注：仅限于D组调用！
    * */
    this.deleteTheFirstTempInstruction = function (callback) {
        let delSql = "DELETE FROM tempinstructions ORDER BY id ASC LIMIT 1";
        dbQuery(delSql, [], function (err, result) {
            if (err) {
                console.log("ERROR: Instructions: deleteTheFirstTempInstruction");
                console.log('[DELETE ERROR] - ', err.message);
                callback(false);
                return;
            }
            callback(true);
        });
    };
}

module.exports = Instructions;
