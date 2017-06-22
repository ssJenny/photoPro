/**
 * Created by ciyel on 2017/6/22.
 */

var http = require("http");
var url = require("url");
var fs = require("fs");
var ejs = require("ejs");


http.createServer(function (req, res) {
    var pathname = "./photo" + url.parse(req.url, true).pathname;

    var Files = {
        fileName: [],  //文件夹名
        imgSrc: []  // 图片文件
    }

    //根据pathname读取资源
    fs.readFile(pathname, function (err, data) {
        if(err){
            console.log("未读取到文件");
            return;
        }

        console.log("ok");

        var mime = getMime(path.extname(pathname), function (mime) {
            console.log(mime)
            res.writeHead(200,{"content-type":mime});
            res.end(data);
        });

    })

    //读取文件目录
    fs.readdir(pathname, function (err, files) {
        if (err){
            return;
        }

        //使用迭代器解决异步读取的问题
        (function interator(i) {

        //    读取完毕，将资源渲染到页面中
            if( i == files.length){
                fs.readFile("./static/index.ejs", function (err, data) {
                    var template =  data.toString();
                    console.log(Files);
                    var html = ejs.render(template, Files);
                    res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                    res.end(html);
                })
                return;
            }
            fs.stat(pathname + "/" + files[i], function (err, stat) {
                // 如果为目录
                if(stat.isDirectory()){
                    Files.fileName[i] = files[i];
                }else{
                    Files.imgSrc[i] = pathname.slice(7) + "/" + files[i];
                }
                interator(i + 1);
            })
        })(0)
    })


    //根据扩展名找到相应的请求头
    function getMime(extname, callback) {
        var mimeJson;
        fs.readFile('./static/mime.json', "utf8", function (err, data) {
            mimeJson = JSON.parse(data);

            callback(mimeJson[extname]);
        })
    }
}).listen(3000, "127.0.0.1");