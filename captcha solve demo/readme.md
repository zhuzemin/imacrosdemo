	The demo for captcha solve ,by use site ("www.ruokuai.com")
	
	Create by "Zemin Zhu" https://github.com/zhuzemin
	
	Require: Firefox 45 - 47
	
	If you want give me some reward for my work, 
	you can pay me by "Paypal" or "Alipay", click the link below.
	
	[Paypal](http://htmlpreview.github.io/?https://github.com/zhuzemin/51job_filter_addr/blob/master/paypalreceipt.html)
	
	[Alipay account](朱泽民 18357028716) 

	##this demo also include "file I/O utils", below I will list all API.##

	#Firstep add below code into you script:#


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

	#Then you to use it:#

//load file I/O Utils

loadScriptFromURL("file:///" + SCRIPTDIR + "lib\\fileUtils.js");

//object initialize 

window.fileUtils = fileUtils;

	#Now you can use the API below:#

    //writeFile(String content, String path, Boolean append)

fileUtils.writeFile(String content, String path, Boolean append)

    //read file line by line, return "array"

fileUtils.readFile(String path)

    //writeBinary(Blob file, String path)

fileUtils.writeBinary(Blob file, String path)

    //create dir

fileUtils.createDirectory(String path)

    //read files name from dir, return "array"

fileUtils.readDirectory(String path)

    //delete Directory(include Dir)

fileUtils.removeDirectory(String path)

    //delete File

fileUtils.removeFile(path)