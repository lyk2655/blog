//(function() {
//    console.log('AAAAAAAAAAAAAAAAAAA1')
//    var factory = function (exports) {
//        console.log('AAAAAAAAAAAAAAAAAAA11')
//        var $            = jQuery;           // if using module loader(Require.js/Sea.js).
//        var pluginName   = "image-handle-paste";  // 定义插件名称
//        //图片粘贴上传方法
//        exports.fn.imagePaste = function() {
//            console.log('AAAAAAAAAAAAAAAAAAA2')
//            var _this       = this;
//            var cm          = _this.cm;
//            var settings    = _this.settings;
//            var editor      = _this.editor;
//            var classPrefix = _this.classPrefix;
//            var id          = _this.id;
//            if(!settings.imageUpload || !settings.imageUploadURL){
//                console.log('你还未开启图片上传或者没有配置上传地址');
//                return false;
//            }
//            console.log('AAAAAAAAAAAAAAAAAAA')
//            //监听粘贴板事件
//            $('#' + id).on('paste', function (e) {
//                console.log('AAAAAAAAAAAAAAAAAAA3')
//                var items = (e.clipboardData || e.originalEvent.clipboardData).items;
//                //判断图片类型
//                if (items && items[0].type.indexOf('image') > -1) {
//                    var file = items[0].getAsFile();
//                    /*生成blob
//                    var blobImg = URL.createObjectURL(file);
//                    */
//                    /*base64
//                    var reader = new FileReader();
//                    reader.readAsDataURL(file);
//                    reader.onload = function (e) {
//                        var base64Img = e.target.result //图片的base64
//                    }
//                    */
//                    // 创建FormData对象进行ajax上传
//                    var forms = new FormData(document.forms[0]); //Filename
//                    forms.set(classPrefix + "image-file", file, "file_"+Date.parse(new Date())+".png"); // 文件
//                    _this.executePlugin("imageDialog", "image-dialog/image-dialog");
//                    _ajax(settings.imageUploadURL, forms, function(ret){
//                        if(ret.success == 1){
//                            $("." + classPrefix + "image-dialog").find("input[data-url]").val(ret.url);
//                            //cm.replaceSelection("![](" + ret.url  + ")");
//                        }
//                        console.log(ret.message);
//                    })
//                }
//            })
//        };
//        // ajax上传图片 可自行处理
//        var _ajax = function(url, data, callback) {
//            console.log('AAAAAAAAAAAAAAAAAAA4')
//            $.ajax({
//                "type": 'post',
//                "cache": false,
//                "url": url,
//                "data": data,
//                "dateType": "json",
//                "processData": false,
//                "contentType": false,
//                "mimeType": "multipart/form-data",
//                success: function(ret){
//                    callback(JSON.parse(ret));
//                },
//                error: function (err){
//                    console.log('请求失败')
//                }
//            })
//        }
//    };
//    // CommonJS/Node.js
//    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
//    {
//        module.exports = factory;
//    }
//    else if (typeof define === "function")  // AMD/CMD/Sea.js
//    {
//        if (define.amd) { // for Require.js
//            define(["editormd"], function(editormd) {
//                factory(editormd);
//            });
//        } else { // for Sea.js
//            define(function(require) {
//                var editormd = require("./../../editormd");
//                factory(editormd);
//            });
//        }
//    }
//    else
//    {
//        factory(window.editormd);
//    }
//})();
function initPasteDragImg(Editor){
    var doc = document.getElementById(Editor.id)
    doc.addEventListener('paste', function (event) {
        var items = (event.clipboardData || window.clipboardData).items;
        var file = null;
        if (items && items.length) {
            // 搜索剪切板items
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    file = items[i].getAsFile();
                    break;
                }
            }
        } else {
            console.log("当前浏览器不支持");
            return;
        }
        if (!file) {
            console.log("粘贴内容非图片");
            return;
        }
        uploadImg(file,Editor);
    });
    var dashboard = document.getElementById(Editor.id)
    dashboard.addEventListener("dragover", function (e) {
        e.preventDefault()
        e.stopPropagation()
    })
    dashboard.addEventListener("dragenter", function (e) {
        e.preventDefault()
        e.stopPropagation()
    })
    dashboard.addEventListener("drop", function (e) {
        e.preventDefault()
        e.stopPropagation()
     var files = this.files || e.dataTransfer.files;
     uploadImg(files[0],Editor);
     })
}
function uploadImg(file,Editor){
    var formData = new FormData();
    var fileName=new Date().getTime()+"."+file.name.split(".").pop();
    formData.append('editormd-image-file', file, fileName);
    $.ajax({
        url: Editor.settings.imageUploadURL,
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function (msg) {
            var success=msg['success'];
            if(success==1){
                var url=msg["url"];
                if(/\.(png|jpg|jpeg|gif|bmp|ico)$/.test(url)){
                    Editor.insertValue("![图片alt]("+msg["url"]+" ''图片title'')");
                }else{
                    Editor.insertValue("[下载附件]("+msg["url"]+")");
                }
            }else{
                console.log(msg);
                alert("上传失败");
            }
        }
    });
}