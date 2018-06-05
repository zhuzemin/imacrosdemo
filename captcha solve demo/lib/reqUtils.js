/*	Create by "Zemin Zhu" https://github.com/zhuzemin
	
	Require: Firefox 45 - 47
	
	If you want give me some reward for my work, 
	you can pay me by "Paypal" or "Alipay", click the link below.
	
	[Paypal](http://htmlpreview.github.io/?https://github.com/zhuzemin/51job_filter_addr/blob/master/paypalreceipt.html)
	
	[Alipay account](朱泽民 18357028716) */
reqUtils = {
    //httpRequest(Object object) return "Object response"
    httpRequest: function(object) {
        var XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
        var Request = new XMLHttpRequest();
        //Request.open(method, url, async);
        Request.open(object.method, object.url, false);
        Request.overrideMimeType(object.mimetype);
        Request.setRequestHeader("Cookie", object.Cookie);
        Request.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 5.1; rv:16.0) Gecko/20100101 Firefox/16.0");
        Request.setRequestHeader("Accept-Language", "en,en-us;q=0.8,ja;q=0.6,zh-cn;q=0.4,zh;q=0.2");
        Request.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        Request.setRequestHeader("Content-Type", object.ContentType);
        Request.setRequestHeader("Referer", object.Referer);
        Request.timeout = 0;
        Request.send(object.body);
        return Request;
        //return Request.responseText
        //return Request.getResponseHeader("")
        //return Request.status
    },
    //fileUpload(Object object), return "responseText"	
    fileUpload: function(object) {
        var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
            .createInstance(Components.interfaces.nsIXMLHttpRequest);
        var boundary = "--------XX" + Math.random();
        if (object.constructor.name == "UPLOAD") {
            var file = Components.classes["@mozilla.org/file/local;1"].
            createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(object.path);
            // Try to determine the MIME type of the file
            var mimeType = "image/jpeg";
            try {
                var mimeService = Components.classes["@mozilla.org/mime;1"]
                    .createInstance(Components.interfaces.nsIMIMEService);
                mimeType = mimeService.getTypeFromFile(file); // file is an nsIFile instance
            } catch (e) { /* eat it; just use text/plain */ }


            //file stream
            var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                .createInstance(Components.interfaces.nsIFileInputStream);
            fstream.init(file, -1, -1, false); // file is an nsIFile instance
            // first boundary and field header
            var data_header = "--" + boundary + "\r\n" +
                "Content-Disposition: form-data; name=\"image\"; filename=\"" +
                file.leafName + "\"\r\nContent-type: " + mimeType + "\r\n\r\n";
            var data_header_stream = Components.classes["@mozilla.org/io/string-input-stream;1"]
                .createInstance(Components.interfaces.nsIStringInputStream);
            data_header_stream.setData(data_header, data_header.length);
        }
        // last boundary
        var data_tail =
            "\r\n--" + boundary +
            "\r\nContent-Disposition: form-data; name=\"username\"\r\n\r\n" + object.uid +
            "\r\n--" + boundary +
            "\r\nContent-Disposition: form-data; name=\"password\"\r\n\r\n" + object.pwd +
            "\r\n--" + boundary +
            "\r\nContent-Disposition: form-data; name=\"softid\"\r\n\r\n" + object.softid +
            "\r\n--" + boundary +
            "\r\nContent-Disposition: form-data; name=\"softkey\"\r\n\r\n" + object.softkey +
            "\r\n--" + boundary
        if (object.constructor.name == "UPLOAD") {
            data_tail = data_tail.concat(
                "\r\nContent-Disposition: form-data; name=\"typeid\"\r\n\r\n" + object.typeid +
                "\r\n--" + boundary +
                "\r\nContent-Disposition: form-data; name=\"timeout\"\r\n\r\n" + object.timeout +
                "\r\n--" + boundary + "--\r\n"
            )
        } else if (object.constructor.name == "REPORT") {
            data_tail = data_tail.concat(
                "\r\nContent-Disposition: form-data; name=\"id\"\r\n\r\n" + object.id +
                "\r\n--" + boundary + "--\r\n"
            )
        }
        var data_tail_stream = Components.classes["@mozilla.org/io/string-input-stream;1"]
            .createInstance(Components.interfaces.nsIStringInputStream);
        data_tail_stream.setData(data_tail, data_tail.length);

        // mix multi-stream
        var mux_stream = Components.classes["@mozilla.org/io/multiplex-input-stream;1"]
            .createInstance(Components.interfaces.nsIMultiplexInputStream);
        if (object.constructor.name == "UPLOAD") {
            mux_stream.appendStream(data_header_stream);
            mux_stream.appendStream(fstream);
        }
        mux_stream.appendStream(data_tail_stream);

        // Send
        req.open('POST', object.url, false); /* synchronous! */
        req.setRequestHeader("Content-type", "multipart/form-data; boundary=" + boundary);
        req.setRequestHeader("Content-length", mux_stream.available());
        req.send(mux_stream);
        if (object.constructor.name == "UPLOAD") {
            fstream.close();
        }
        return req.responseText;
    }
}