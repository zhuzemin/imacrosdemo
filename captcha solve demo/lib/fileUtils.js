/*	Create by "Zemin Zhu" https://github.com/zhuzemin
	
	Require: Firefox 45 - 47
	
	If you want give me some reward for my work, 
	you can pay me by "Paypal" or "Alipay", click the link below.
	
	[Paypal](http://htmlpreview.github.io/?https://github.com/zhuzemin/51job_filter_addr/blob/master/paypalreceipt.html)
	
	[Alipay account](朱泽民 18357028716) */
fileUtils = {
    //delete File
    removeFile: function(path) {
        var aFile = Components.classes["@mozilla.org/file/local;1"].createInstance();
        if (aFile instanceof Components.interfaces.nsILocalFile) {
            aFile.initWithPath(path);
            //avoid error for not found file
            try {
                aFile.remove(false);
            } catch (err) {}
        }
    },
    //delete Directory(include Dir)
    removeDirectory: function(path) {

        var file = imns.FIO.openNode(path);

        if (file.isDirectory()) {

            var children = file.directoryEntries;

            while (children.hasMoreElements()) {

                var child = children.getNext().QueryInterface(Components.interfaces.nsILocalFile);

                if (child.isDirectory()) {

                    this.removeFiles(child.path);

                }

                child.remove(false);

            }

        }

    },
    //read files name from dir, return "array"
    readDirectory: function(path) {

        var file = imns.FIO.openNode(path);

        var list = [];

        if (file.isDirectory()) {

            var children = file.directoryEntries;

            while (children.hasMoreElements()) {

                child = children.getNext().QueryInterface(Components.interfaces.nsILocalFile);

                list.push(child.leafName);

            }

        }

        return list;

    },
    //create dir
    makeDirectory: function(path) {

        imns.FIO.makeDirectory(path);

    },
    //writeBinary(Blob file, String path)
    writeBinary: function(file, path) {
        var aFile = Components.classes["@mozilla.org/file/local;1"].
        createInstance(Components.interfaces.nsILocalFile);

        aFile.initWithPath(path);
        //delete file frist
        aFile.remove(false);

        var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"].
        createInstance(Components.interfaces.nsIFileOutputStream);
        stream.init(aFile, 0x04 | 0x08 | 0x20, 664, 0);

        stream.write(file, file.length);
        if (stream instanceof Components.interfaces.nsISafeOutputStream) {
            stream.finish();
        } else {
            stream.close();

        }
    },
    //read file line by line, return "array"
    readFile: function(path) {
        // COUNT THE NUMBERS OF ROWS IN CSV FOR LOOP
        const CRLF = "\r\n";
        const LF = "\n";

        var lines = new Array();

        var file_i = imns.FIO.openNode(path);
        var text = imns.FIO.readTextFile(file_i); // Read file into one string

        // Determine end-of-line marker
        var eol = (text.indexOf(CRLF) == -1) ? LF : CRLF;

        // Split into lines (number of lines) NUMBER OF LINES IN CSV
        lines = text.split(eol);
        return lines;
    },
    //writeFile(String content, String path, Boolean append)
    writeFile: function(content, path, append) {
        var file = imns.FIO.openNode(path);
        if (append) {
            imns.FIO.appendTextFile(file, content);
        } else {
            imns.FIO.writeTextFile(file, content);
        }
    }
}

//window.fileUtils = fileUtils;