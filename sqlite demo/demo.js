/*
	The demo for Sqlite
	
	Create by "Zemin Zhu" https://github.com/zhuzemin
	
	Require: Firefox 45 - 47
	
	If you want give me some reward for my work, 
	you can pay me by "Paypal" or "Alipay", click the link below.
	
	[Paypal](http://htmlpreview.github.io/?https://github.com/zhuzemin/51job_filter_addr/blob/master/paypalreceipt.html)
	
	[Alipay account](朱泽民 18357028716) 
*/
//get dir ("/iMacros/Macros") absolute path 
const SAVEPATH = imns.Pref.getFilePref("defsavepath").path;
const SCRIPTDIR = SAVEPATH + "\\demo\\sqlite demo\\";
const DBPATH = SCRIPTDIR + "demo.db";
const storageService = Components.classes['@mozilla.org/storage/service;1'].getService(Components.interfaces.mozIStorageService);
let db = imns.FIO.openNode(DBPATH);
let dbConn = storageService.openDatabase(db);
let insert = "INSERT INTO Account ( Username,Password) VALUES(?,?)";
let insertStmt = dbConn.createStatement(insert);
insertStmt.bindByIndex(0, "Zhu");
insertStmt.bindByIndex(1, "123456");
insertStmt.execute();
insertStmt.finalize();
let select = 'SELECT * FROM Account'
let stmt = dbConn.createStatement(select);
stmt.execute();
while (stmt.executeStep()) {
    iimDisplay(stmt.row["Username"]);
}
stmt.finalize();
dbConn.close();