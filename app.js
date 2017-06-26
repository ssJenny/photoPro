var http = require("http");
var url = require("url");
var fs = require("fs");
var ejs = require("ejs");


http.createServer(function (req, res) {
    var pathname ="./photo"+url.parse(req.url, true).pathname;

    var Files = {
        fileName: [],       //文件夹名
        imgSrc: []          //文件夹内图片文件
    }

    //根据pathname读取资源
    fs.readFile(pathname, function (err, data) {
        if (err) {
            console.log("未读取到文件");
            return;
        };
        console.log("ok")
        res.writeHead(200, {"content-type": "img/png"});
        res.end(data);
    });
    //读取文件目录
    fs.readdir(pathname, function (err, files) {
        if (err) {
            return;
        }
        (function iterator(i) {
            if (i == files.length) {
                //渲染模板到页面
                fs.readFile("./static/index.ejs", function (err, data) {
                    var template = data.toString();
                    console.log(Files)
                    var html = ejs.render(template, Files);
                    res.writeHead(200, {"Content-Type": "text/html;charset=UTF8"});
                    res.end(html);
                })
                return;
            }
            fs.stat(pathname  +"/"+  files[i], function (err, stat) {
                //根据文件属性归类到不同的数组
                if (stat.isDirectory()) {
                    Files.fileName[i] = files[i];       //文件夹
                } else {
                    Files.imgSrc[i] = pathname.slice(7) +"/"+ files[i];     //图片
                }
                iterator(i + 1);
            })
        })(0);
    });
}).listen(3000, "127.0.0.1");