// 数据库连接
var dbConnection = require('../database/MySQLconnection');

function Instructions() {
    this.addInstructions = function (tradeType, personid, stockid, shares, pricePer, callback) {
        let addSql = "INSERT INTO ";
        if (tradeType === "sell") {
            addSql += 'asks(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        } else {
            addSql += 'bids(uid, code, shares, price, shares2trade) VALUES(?,?,?,?,?)';
        }
        let addSqlParams = [personid, stockid, shares, pricePer, shares];
        let returnText = "";
        //// cwy修改：添加参数
        dbConnection.query(addSql, addSqlParams, function (err, results) {
            if (err) {
                console.log('[INSERT ERROR] - ', err.message);
                returnText = "Add Failed!";
                callback(returnText);
                return;
            }
            const istID = results.insertId;    // 需要记录刚刚插入的指令的编号
            //console.log('INSERT ID:', result);
            returnText = "Add Successfully!";
            callback(returnText);

            matchOnInsertion(istID, tradeType, shares, pricePer, code);
        });
    };
}

/***
 * 插入新指令后进行撮合
 * @param istID     新插入的指令的编号
 * @param tradeType 新插入的指令的类型
 * @param shares    新插入的指令指定的需要交易的股份数
 * @param price     新插入的指令指定的最低的交易价格
 * @param code      新插入的指令对应的股票代码
 */
let matchOnInsertion = function (istID, tradeType, shares, price, code)
{
    let sharesRemaining = shares; // 刚发送的指令还有多少股没有撮合
    if (tradeType == 'sell')
    {
        let flag = 1;
        while (flag)
        {
            // 查询可撮合的买指令的第一条
            let getFirstBidInLine = "select id, shares2trade " +
                "from bids " +
                "where code = ? and price >= ? " +
                "order by price desc, time asc limit 1;"; // 价高者得，时间优先
            dbConnection.query(getFirstBidInLine, [code, price], function (err, results) {
                if (err){
                    console.log("ERROR - " + err.message);
                }
                if (results.length == 0) {
                    flag = 0;
                    return; // 注意退出回调函数不退出循环，所以要改flag
                }
                const shares2trade = results[0].shares2trade;
                const oppoID = results[0].id;
                if (shares2trade < sharesRemaining)
                {
                    // 使得对应的买指令成交
                    // * 清零买指令的shares2trade和status等
                    // * 减少本买指令的shares2trade
                    // * 提交到撮合表和成交表中
                    // * 继续循环 直到不能撮合完为之
                }
                else if (shares2trade == sharesRemaining)
                {
                    // 使得两个指令都被撮合
                    // * 清零买卖指令的shares2trade和status等
                    // * 提交到撮合表和成交表中
                    // * 停止循环
                }
                else
                {
                    // 使得本买指令成交
                    // * 清零卖指令的shares2trade和status等
                    // * 减少对应买指令的shares2trade
                    // * 提交到撮合表和成交表中
                    // * 停止循环
                }
            });
        }
    }
    else // 买指令
    {
        // 反向
    }
}

module.exports = Instructions;
