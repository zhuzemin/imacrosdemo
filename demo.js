/*
	The demo for captcha solve ,by use site ("www.ruokuai.com")
	
	create by "Zemin Zhu" https://github.com/zhuzemin
	
	If you want give me some reward for my work, 
	you can pay me by "Paypal" or "Alipay", click the link below.
	
	[Paypal](http://htmlpreview.github.io/?https://github.com/zhuzemin/51job_filter_addr/blob/master/paypalreceipt.html)
	
	[Alipay account](÷Ï‘Û√Ò 18357028716) 
*/
//get dir ("/iMacros/Macros") absolute path 
const SAVEPATH = imns.Pref.getFilePref("defsavepath").path;
const SCRIPTDIR = SAVEPATH + "\\captcha demo\\";
const CODEPATH = SCRIPTDIR + "code.jpg";
const REPORTERR = SCRIPTDIR + "report error.txt";
//load file I/O Utils
loadScriptFromURL("file:///" + SCRIPTDIR + "lib\\fileUtils.js");
//object initialize 
window.fileUtils = fileUtils;
//load http request Utils
loadScriptFromURL("file:///" + SCRIPTDIR + "lib\\reqUtils.js");
window.reqUtils = reqUtils;
//object for request, to get captcha cookie
class GETSID {
    constructor() {
        this.method = "GET";
        this.url = "http://apply.hzcb.gov.cn";
        this.mimetype = null;
        this.Cookie = null;
        this.ContentType = null;
        this.body = null;
    }
}
//object for request, to get captcha image    
class GETCODE {
    constructor(sid) {
        this.method = "GET";
        this.url = "http://apply.hzcb.gov.cn/apply/app/validCodeImage?ee=2";
        //download binary file must set by 'text/plain; charset=x-user-defined'
        this.mimetype = 'text/plain; charset=x-user-defined';
        this.Cookie = "JSESSIONID=" + sid;
        this.ContentType = null;
        this.body = null;
        this.Referer = "http://xkctk.hangzhou.gov.cn/";
    }
}
//object for request,
//captcha solve site "www.ruokuai.com"
//define account info
class RUOKUAI {
    constructor() {
        this.uid = "username"; //"ruokuai" account username
        this.pwd = "*******"; //"ruokuai" account password
        this.softid = "48019"; //for must have one, can use my, will give me bonus, otherwise you need register yourown
        this.softkey = "7dd5e6df52d545c18518a7597779e462";
    }
}
//object for request, use to captcha image upload
class UPLOAD extends RUOKUAI {
    constructor(uid, pwd, softid, softkey) {
        super(uid, pwd, softid, softkey);
        this.url = "http://api.ruokuai.com/create.json";
        this.path = CODEPATH;
        this.typeid = "3040"; //captcha type. "3040" mean "length is 4, digit & letter mixed" you can find all type code from "http://www.ruokuai.com/home/pricetype"
        this.timeout = "90";
        this.codeid = null;
    }
}
//object for request, use to report  if captcha recognize wrong
class REPORT extends RUOKUAI {
    constructor(uid, pwd, softid, softkey, codeid) {
        super(uid, pwd, softid, softkey);
        this.url = "http://api.ruokuai.com/reporterror.json";
        this.path = null;
        this.typeid = null;
        this.timeout = null;
        this.codeid = codeid; //the "captcha recognize process id", get from "UPLOAD" result
    }
}

iimPlay("CODE:CLEAR");
//init getsid
let getsid = new GETSID();
//send request
//httpRequest(Object object), return "Object response"
let ret = reqUtils.httpRequest(getsid);
//get all cookie
let setcookie = ret.getResponseHeader("Set-Cookie");
//extract "sid"
let sid = setcookie.match(/JSESSIONID=([^;]*)/)[1];
//init getcode
let getcode = new GETCODE(sid);
//"GETCODE" response object
ret = reqUtils.httpRequest(getcode);
//get captcha binary data
let codeimg = ret.responseText;
//save captcha image to file
//writeBinary(Blob file, String path)
fileUtils.writeBinary(codeimg, CODEPATH);
//init "UPLOAD"
let upload = new UPLOAD();
//send request
//fileUpload(Object object), return "responseText"	
ret = reqUtils.fileUpload(upload);
//response is "JSON" format string
//convert to JSON object
let codejson = JSON.parse(ret);
//object length ==3 mean got error, maybe runout balance ,so PAUSE
if (Object.keys(codejson).length == 3) {
    //display error message
    iimDisplay(codejson.Error);
    iimPlay("CODE:PAUSE");
}
//get captcha code
let code = codejson.Result;
iimDisplay(code);
//below this part well not be run in demo
let condition = false;
if (condition) {
    iimDisplay("Captcha recognize wrong");
    //init REPORT
    let report = new REPORT(codejson.Id);
    //send request
    ret = fileUpload(report);
    //response is "JSON" format string
    //convert to JSON object
    let repoerr = JSON.parse(ret);
    //format to readable
    repoerr = JSON.stringify(repoerr, null, 2);
    //Store to file
    //writeFile(String content, String path, Boolean append)
    fileUtils.writeFile('codeid: ' + code.Id + repoerr + "\r\n", REPORTERR, true);
}

//load script from other file	
function loadScriptFromURL(url) {
    let request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest),
        async = false;
    request.open('GET', url, async);
    request.send();
    if (request.status !== 200) {
        let message = 'an error occurred while loading script at url: ' + url + ', status: ' + request.status;
        iimDisplay(message);
        return false;
    }
    eval(request.response);
    return true;
}