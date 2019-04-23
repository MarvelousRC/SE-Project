-- 清除全部表中的内容
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

-- Group D
insert into 
	asks(id, time, uid, code, shares, price, shares2trade, timearchived, status) 
	values
	(253, '2018-04-01 09:27:21', 1000000003, '000003', 64, 18.73, 64, null, 'partial'), 
	(254, '2018-04-01 09:27:51', 3, '000002', 28, 32.20, 28, null, 'partial'), 
	(255, '2018-04-01 10:42:27', 1000000005, '000002', 15, 32.04, 15, null, 'partial'), 
	(256, '2018-04-01 09:02:19', 1000000001, '000007', 78, 4.92, 78, null, 'partial'), 
	(257, '2018-04-01 10:25:31', 4, '000009', 74, 3.62, 74, null, 'partial'), 
	(258, '2018-04-01 10:42:09', 1000000005, '000001', 36, 11.50, 36, null, 'partial'), 
	(259, '2018-04-01 10:57:51', 4, '000006', 94, 8.86, 94, null, 'partial'), 
	(260, '2018-04-01 11:14:38', 1000000003, '000003', 65, 18.75, 65, null, 'partial'), 
	(261, '2018-04-01 09:50:31', 4, '000008', 29, 7.33, 29, null, 'partial'), 
	(262, '2018-04-01 11:10:19', 2, '000004', 50, 3.58, 50, null, 'partial'), 
	(263, '2018-04-01 09:57:40', 1, '000007', 45, 5.13, 45, null, 'partial'), 
	(264, '2018-04-01 10:38:21', 4, '000010', 69, 10.15, 69, null, 'partial'), 
	(265, '2018-04-01 09:28:03', 3, '000009', 99, 3.81, 99, null, 'partial'), 
	(266, '2018-04-01 09:05:25', 5, '000010', 45, 10.80, 45, null, 'partial'), 
	(267, '2018-04-01 10:52:51', 3, '000002', 53, 31.43, 53, null, 'partial'), 
	(268, '2018-04-01 09:37:34', 2, '000007', 77, 4.27, 77, null, 'partial'), 
	(269, '2018-04-01 10:09:16', 5, '000002', 67, 31.88, 67, null, 'partial'), 
	(270, '2018-04-01 10:27:07', 1, '000002', 66, 28.17, 66, null, 'partial'), 
	(271, '2018-04-01 10:51:51', 2, '000009', 20, 4.09, 20, null, 'partial'), 
	(272, '2018-04-01 10:25:59', 1000000003, '000003', 41, 19.48, 41, null, 'partial'), 
	(273, '2018-04-01 10:42:43', 1000000001, '000006', 62, 8.06, 62, null, 'partial'), 
	(274, '2018-04-01 11:01:07', 1000000001, '000010', 33, 11.13, 33, null, 'partial'), 
	(275, '2018-04-01 09:50:22', 2, '000006', 83, 7.97, 83, null, 'partial'), 
	(276, '2018-04-01 09:19:20', 5, '000007', 67, 4.33, 67, null, 'partial'), 
	(277, '2018-04-01 09:06:40', 4, '000008', 70, 7.18, 70, null, 'partial'), 
	(278, '2018-04-01 09:15:19', 1000000005, '000001', 58, 11.94, 58, null, 'partial'), 
	(279, '2018-04-01 09:08:32', 1000000003, '000010', 59, 11.73, 59, null, 'partial'), 
	(280, '2018-04-01 10:57:07', 1000000003, '000002', 63, 28.03, 63, null, 'partial'), 
	(281, '2018-04-01 09:30:35', 2, '000004', 16, 4.07, 16, null, 'partial'), 
	(282, '2018-04-01 11:16:03', 1, '000009', 58, 3.60, 58, null, 'partial'), 
	(283, '2018-04-01 11:27:45', 1000000004, '000002', 42, 28.27, 42, null, 'partial'), 
	(284, '2018-04-01 10:52:17', 1, '000005', 75, 6.29, 75, null, 'partial'), 
	(285, '2018-04-01 10:27:54', 2, '000010', 24, 11.93, 24, null, 'partial'), 
	(286, '2018-04-01 10:32:20', 2, '000010', 73, 10.52, 73, null, 'partial'), 
	(287, '2018-04-01 09:08:17', 1000000001, '000002', 9, 29.80, 9, null, 'partial'), 
	(288, '2018-04-01 09:04:16', 4, '000009', 29, 3.63, 29, null, 'partial'), 
	(289, '2018-04-01 10:09:53', 2, '000001', 17, 13.35, 17, null, 'partial'), 
	(290, '2018-04-01 10:32:45', 1000000001, '000010', 56, 11.06, 56, null, 'partial'), 
	(291, '2018-04-01 11:22:03', 5, '000009', 70, 3.64, 70, null, 'partial'), 
	(292, '2018-04-01 11:24:08', 1000000002, '000001', 68, 11.54, 68, null, 'partial'), 
	(293, '2018-04-01 09:52:34', 1000000005, '000001', 48, 13.74, 48, null, 'partial'), 
	(294, '2018-04-01 10:06:45', 2, '000002', 30, 28.78, 30, null, 'partial'), 
	(295, '2018-04-01 10:32:47', 1000000005, '000007', 10, 4.38, 10, null, 'partial'), 
	(296, '2018-04-01 09:58:27', 2, '000006', 73, 8.84, 73, null, 'partial'), 
	(297, '2018-04-01 09:22:16', 1000000001, '000001', 70, 13.19, 70, null, 'partial'), 
	(298, '2018-04-01 10:34:50', 1000000002, '000002', 23, 31.34, 23, null, 'partial'), 
	(299, '2018-04-01 09:58:36', 2, '000009', 84, 3.59, 84, null, 'partial'), 
	(300, '2018-04-01 09:26:04', 1000000001, '000006', 53, 8.55, 53, null, 'partial'), 
	(301, '2018-04-01 09:41:30', 3, '000004', 5, 3.60, 5, null, 'partial'), 
	(302, '2018-04-01 10:26:25', 1000000005, '000004', 44, 3.80, 44, null, 'partial');

insert into 
	bids(id, time, uid, code, shares, price, shares2trade, timearchived, status) 
	values
	(1, '2018-04-01 09:01:26', 3, '000006', 74, 8.68, 74, null, 'partial'), 
	(2, '2018-04-01 09:15:10', 1000000004, '000009', 69, 4.28, 69, null, 'partial'), 
	(3, '2018-04-01 09:17:03', 1000000004, '000009', 78, 3.71, 78, null, 'partial'), 
	(4, '2018-04-01 09:19:03', 1000000001, '000009', 19, 3.71, 19, null, 'partial'), 
	(5, '2018-04-01 09:19:22', 4, '000009', 60, 3.88, 60, null, 'partial'), 
	(6, '2018-04-01 09:22:36', 1000000004, '000007', 64, 4.56, 64, null, 'partial'), 
	(7, '2018-04-01 09:30:30', 1000000003, '000002', 63, 30.99, 63, null, 'partial'), 
	(8, '2018-04-01 09:31:11', 1000000001, '000010', 56, 11.37, 56, null, 'partial'), 
	(9, '2018-04-01 09:33:59', 1, '000010', 67, 11.71, 67, null, 'partial'), 
	(10, '2018-04-01 09:37:11', 1, '000005', 16, 7.09, 16, null, 'partial'), 
	(11, '2018-04-01 09:39:44', 2, '000002', 42, 29.62, 42, null, 'partial'), 
	(12, '2018-04-01 09:42:25', 1, '000006', 85, 8.62, 85, null, 'partial'), 
	(13, '2018-04-01 09:48:44', 2, '000005', 22, 5.92, 22, null, 'partial'), 
	(14, '2018-04-01 09:49:24', 2, '000002', 89, 27.21, 89, null, 'partial'), 
	(15, '2018-04-01 09:49:35', 1000000002, '000008', 76, 6.71, 76, null, 'partial'), 
	(16, '2018-04-01 09:55:30', 3, '000003', 27, 19.78, 27, null, 'partial'), 
	(17, '2018-04-01 09:56:40', 2, '000006', 25, 8.45, 25, null, 'partial'), 
	(18, '2018-04-01 10:04:21', 1000000004, '000003', 49, 19.31, 49, null, 'partial'), 
	(19, '2018-04-01 10:06:31', 1000000002, '000001', 81, 12.20, 81, null, 'partial'), 
	(20, '2018-04-01 10:06:39', 2, '000003', 3, 18.25, 3, null, 'partial'), 
	(21, '2018-04-01 10:14:37', 3, '000006', 58, 8.95, 58, null, 'partial'), 
	(22, '2018-04-01 10:15:21', 5, '000009', 43, 3.66, 43, null, 'partial'), 
	(23, '2018-04-01 10:16:34', 1000000004, '000008', 97, 7.30, 97, null, 'partial'), 
	(24, '2018-04-01 10:21:13', 2, '000005', 90, 6.76, 90, null, 'partial'), 
	(25, '2018-04-01 10:23:49', 2, '000007', 20, 4.29, 20, null, 'partial'), 
	(26, '2018-04-01 10:31:43', 2, '000005', 26, 6.33, 26, null, 'partial'), 
	(27, '2018-04-01 10:32:43', 2, '000005', 44, 6.59, 44, null, 'partial'), 
	(28, '2018-04-01 10:33:41', 1000000001, '000004', 6, 3.89, 6, null, 'partial'), 
	(29, '2018-04-01 10:35:05', 3, '000001', 64, 13.71, 64, null, 'partial'), 
	(30, '2018-04-01 10:40:05', 1000000005, '000007', 78, 4.43, 78, null, 'partial'), 
	(31, '2018-04-01 10:41:48', 1000000003, '000007', 24, 4.76, 24, null, 'partial'), 
	(32, '2018-04-01 10:43:41', 3, '000008', 70, 6.55, 70, null, 'partial'), 
	(33, '2018-04-01 10:58:48', 2, '000009', 28, 3.97, 28, null, 'partial'), 
	(34, '2018-04-01 10:58:54', 1000000004, '000007', 17, 4.87, 17, null, 'partial'), 
	(35, '2018-04-01 10:59:36', 4, '000007', 16, 4.26, 16, null, 'partial'), 
	(36, '2018-04-01 11:04:25', 2, '000010', 83, 10.43, 83, null, 'partial'), 
	(37, '2018-04-01 11:04:37', 3, '000006', 37, 8.60, 37, null, 'partial'), 
	(38, '2018-04-01 11:04:39', 5, '000001', 3, 11.49, 3, null, 'partial'), 
	(39, '2018-04-01 11:06:34', 2, '000008', 88, 7.43, 88, null, 'partial'), 
	(40, '2018-04-01 11:12:39', 1000000005, '000004', 45, 3.71, 45, null, 'partial'), 
	(41, '2018-04-01 11:13:44', 5, '000009', 19, 4.10, 19, null, 'partial'), 
	(42, '2018-04-01 11:13:59', 1, '000008', 32, 7.45, 32, null, 'partial'), 
	(43, '2018-04-01 11:16:01', 1000000005, '000010', 90, 11.34, 90, null, 'partial'), 
	(44, '2018-04-01 11:16:16', 5, '000007', 36, 4.36, 36, null, 'partial'), 
	(45, '2018-04-01 11:19:57', 5, '000009', 100, 3.66, 100, null, 'partial'), 
	(46, '2018-04-01 11:20:53', 2, '000007', 92, 4.22, 92, null, 'partial'), 
	(47, '2018-04-01 11:24:16', 3, '000006', 78, 8.69, 78, null, 'partial'), 
	(48, '2018-04-01 11:25:41', 1000000001, '000006', 4, 8.69, 4, null, 'partial'), 
	(49, '2018-04-01 11:29:16', 5, '000003', 100, 19.71, 100, null, 'partial'), 
	(50, '2018-04-01 11:29:18', 1000000002, '000002', 4, 28.67, 4, null, 'partial');
