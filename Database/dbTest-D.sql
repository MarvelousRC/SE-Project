-- 清除全部表中的内容
delete from tempinstructions;
delete from dealsask;
delete from dealsbid;
delete from matchs;
delete from asks;
delete from bids;
delete from capitalaccountio;
delete from jobberworker;
delete from capitalaccount;
delete from stockhold;
delete from corporateaccount;
delete from personalaccount;
delete from idreference;
delete from stock_history;
delete from stock;

-- Group-E
insert into 
	stock(code, name_stock, current_price, last_endprice, today_startprice, amount, permission, notification, percentagePriceChange, st) 
	values
	("000001", "平安银行", 12.75, 12.79, 12.68, 1000000000, true, null, 0.1, false), 
	("000002", "万科A", 29.53, 29.15, 29.15, 1000000000, true, null, 0.1, false), 
	("000003", "国农科技", 19.6, 19.64, 19.99, 1000000000, true, null, 0.1, false), 
	("000004", "世纪星源", 3.73, 3.72, 3.72, 1000000000, true, null, 0.1, false), 
	("000005", "深振业A", 6.5, 6.5, 6.44, 1000000000, true, null, 0.1, false), 
	("000006", "全新好", 8.26, 8.41, 8.12, 1000000000, true, null, 0.1, false), 
	("000007", "神州高铁", 4.67, 4.59, 4.59, 1000000000, true, null, 0.1, false), 
	("000008", "中国宝安", 6.88, 6.57, 6.58, 1000000000, true, null, 0.1, false), 
	("000009", "美丽生态", 3.97, 3.87, 3.87, 1000000000, true, null, 0.1, false), 
	("000010", "深物业A", 11.15, 11.09, 11.09, 1000000000, true, null, 0.1, false);

-- Group-A
insert into 
	idreference(accountid, personid) 
	values
	(1, 1), 
	(2, 2), 
	(3, 3), 
	(4, 4), 
	(5, 5), 
	(6, 2), 
	(1000000001, 1000000001), 
	(1000000002, 1000000002), 
	(1000000003, 1000000003), 
	(1000000004, 1000000004), 
	(1000000005, 1000000005);

insert into 
	personalaccount(accountid, registertime, name, gender, identityid, homeaddress, work, educationback, workaddress, phonenumber, agentid, state, personid) 
	values
	(1, "2019-2-25 15:23:33", "张三", "male", "33000119770422003X", "浙江省杭州市港湾家园1幢202", "待业", "高中", "无", "17697390598", null, "normal", 1),
	(2, "2019-2-26 09:15:20", "李四", "female", "330001198711040223", "浙江省杭州市信义坊3幢402", "家庭主妇", "本科", "无", "13809382267", null, "frozen", 2),
	(3, "2019-2-27 17:06:55", "王五", "female", "33000119770422003X", "浙江省宁波市鄞州区永达西路", "工厂工人", "高中", "开发区金地工厂", "18965703689", null, "logout", 3),
	(4, "2019-2-28 16:41:11", "赵六", "male", "11010119910507005X", "北京市朝阳区金叶地王花园11幢601", "销售经理", "研究生", "传奇奢华汽车4S店", "15820770108", "110101198710210000", "normal", 4),
	(5, "2019-3-1 19:04:32", "孙七", "male", "430103198810132772", "湖南省长沙市碧桂园山湖城5幢502", "工人", "初中", "睿临汽车零部件加工厂", "15487338739", null, "normal", 5),
	(6, "2019-3-12 08:10:20", "李四", "female", "330001198711040223", "浙江省杭州市信义坊3幢402", "家庭主妇", "本科", "无", "13809382267", null, "normal", 2);

insert into 
	corporateaccount(accountid, registrationid, licenseid, identityid, name, phonenumber, workaddress, authorizername, authorizeridentityid, authorizerphonenumber, authorizeraddress, state, personid) 
	values
	(1000000001, "1", "11", "330726199904037050", "黄金", "17868767175", "杭州大厦", "黄金金", "330726198906093212", "17468767175", "杭州大厦", "normal", 1000000001),
	(1000000002, "2", "12", "654322199007086832", "白银", "17868767176", "杭州老和山", "白银银", "654322197702086277", "17468767176", "杭州老和山", "normal", 1000000002),
	(1000000003, "3", "13", "330103199802129042", "钱多", "17868767177", "北京王府井全聚德", "钱多多", "330103198212127296", "17468767177", "北京王府井全聚德", "normal", 1000000003),
	(1000000004, "4", "14", "210213188912217311", "金钱", "17868767178", "温州江南皮革厂", "金钱钱", "210213188107212235", "17468767178", "温州江南皮革厂", "normal", 1000000004),
	(1000000005, "5", "15", "522125199811220912", "买银行", "17868767179", "义乌小商品市场", "买行行", "522125197605223467", "17468767179", "义乌小商品市场", "normal", 1000000005);

-- temp stockhold
insert into
	stockhold(personid, stockid, stocknum, stockcost) 
	select distinct personid, code, 0 as stocknum, 0.00 as stockcost from idreference cross join stock;
update stockhold set stocknum = 10000, stockcost = 120000 where personid <> 3 and stockid = "000001";
update stockhold set stocknum = 59124, stockcost = 240015 where personid <> 3 and stockid = "000004";
-- 请根据需要进一步补充

-- Group-B
insert into 
	capitalaccount(capitalaccountid, tradepassword, cashpassword, identificationid, relatedsecuritiesaccountid, capitalaccountstate, availablemoney, frozenmoney, interestremained)
	values
	(2019101, '115165', '495165', '412726198412232666', 1, 'normal', 4124.38, 0.00, 3.45),
	(2019102, '198273', '976164', '481892196608162588', 2, 'normal', 56127.96, 0.00, 8.96),
	(2019103, '847922', '254929', '456387199006252698', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019104, '516951', '717921', '464892198509152896', 3, 'logout', 0.00, 0.00, 0.00),
	(2019105, '115165', '495385', '412726199705168866', 4, 'normal', 4124.38, 0.00, 3.45),
	(2019106, '196273', '972194', '419252196608162588', 1000000005, 'normal', 56127.96, 0.00, 8.96),
	(2019107, '896922', '289229', '491527199006252698', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019108, '516921', '714921', '429891198509152896', null, 'logout', 0.00, 0.00, 0.00),
	(2019109, '113965', '493965', '481192198412232666', 1000000004, 'normal', 4124.38, 0.00, 3.45),
	(2019110, '198783', '977964', '429212196608162588', 1000000003, 'normal', 56127.96, 0.00, 8.96),
	(2019111, '846952', '254829', '491470199006252698', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019112, '518951', '799921', '464098198509152896', null, 'logout', 0.00, 0.00, 0.00),
	(2019113, '585165', '491865', '419126198412232666', 1000000001, 'normal', 4124.38, 0.00, 3.45),
	(2019114, '168273', '992164', '481892196908162588', 1000000002, 'normal', 56127.96, 0.00, 8.96),
	(2019115, '848922', '251489', '456387199908526998', null, 'frozen', 0.00, 9551.16, 2.39),
	(2019116, '511851', '715591', '464892198908091796', 5, 'normal', 0.00, 0.00, 0.00);

insert into 
	jobberworker(jobberworkerid, jobberworkerpassword)
	values
	(2019001, '1111'), 
	(2019002, '1111'), 
	(2019003, '1111'), 
	(2019004, '1111'), 
	(2019005, '1111'), 
	(2019006, '1111'), 
	(2019007, '1111'), 
	(2019008, '1111'), 
	(2019010, '1111'), 
	(2019011, '1111'), 
	(2019012, '1111'), 
	(2019013, '1111'), 
	(2019014, '1111'), 
	(2019015, '1111'), 
	(2019016, '1111');

insert into 
	capitalaccountio(capitalaccountid, ioamount, moneytype, iodescription)
	values
	(2019101, 4124.389, 'RMB', '无'), 
	(2019102, 3162.431, 'RMB', '无'), 
	(2019103, 7126.334, 'RMB', '无'), 
	(2019104, 9743.464, 'RMB', '无'), 
	(2019105, 1297.137, 'RMB', '无'), 
	(2019106, 4522.941, 'RMB', '无'), 
	(2019107, 4175.549, 'RMB', '无'), 
	(2019108, 1762.912, 'RMB', '无'), 
	(2019109, 7527.136, 'RMB', '无'), 
	(2019110, 4524.961, 'RMB', '无'), 
	(2019111, 2452.314, 'RMB', '无'), 
	(2019112, 3124.527, 'RMB', '无'), 
	(2019113, 8524.452, 'RMB', '无'), 
	(2019114, 8964.372, 'RMB', '无'), 
	(2019115, 4524.278, 'RMB', '无'), 
	(2019116, 2724.878, 'RMB', '无'); 

insert into 
	bids(id, time, uid, code, shares, price, shares2trade, timearchived, status) 
	values
	(1, '2018-04-01 09:01:26', 4, '000001', 74, 12.68, 74, null, 'partial'), 
	(2, '2018-04-01 09:15:10', 1, '000002', 69, 4.28, 69, null, 'partial'), 
	(3, '2018-04-01 09:17:03', 4, '000001', 78, 11.71, 78, null, 'partial'), 
	(4, '2018-04-01 09:19:03', 1, '000003', 19, 3.71, 19, null, 'partial'), 
	(5, '2018-04-01 09:19:22', 4, '000004', 60, 3.88, 60, null, 'partial'), 
	(6, '2018-04-01 09:22:36', 4, '000001', 64, 10, 64, null, 'partial'), 
	(7, '2018-04-01 09:30:30', 4, '000001', 63, 15, 63, null, 'partial'), 
	(8, '2018-04-01 09:31:11', 4, '000001', 56, 12.5, 56, null, 'partial'), 
	(9, '2018-04-01 09:33:59', 1, '000003', 67, 11.71, 67, null, 'partial'), 
	(10, '2018-04-01 09:37:11', 1, '000009', 16, 7.09, 16, null, 'partial')
