package com.linyk3.service;

import com.linyk3.vo.ImageUploadRes;
import com.linyk3.vo.WebResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
public class ImageService {
    @Value("${file.filePath}")
    String filePath;

    @Value("${file.download.prefix}")
    String prefix;

    public WebResponse<ImageUploadRes> uplaodImage(HttpServletResponse response, MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        File dest = new File(filePath + uuid + fileName);
        try {
            file.transferTo(dest);
            ImageUploadRes res = new ImageUploadRes();
            res.setUrl(prefix + uuid + fileName);
            response.setHeader("Content-Type","text/html");
            response.setHeader("Access-Control-Allow-Origin","*");
            log.info("上传成功:" + res.getUrl());
            return new WebResponse().success(res, "上传成功");

        } catch (IOException e) {
            log.error(e.toString(), e);
        }
        return new WebResponse().fail("上传失败！");
    }

    public void downlaodImage(String fileName, HttpServletResponse res) {
        if (fileName == null) {
            throw new RuntimeException("文件名不能为空");
        }

        //设置响应头
        res.setContentType("application/force-download");// 设置强制下载不打开
        res.addHeader("Content-Disposition", "attachment;fileName=" + fileName);// 设置文件名
        res.setHeader("Context-Type", "application/xmsdownload");

        //判断文件是否存在
        File file = new File(Paths.get(filePath, fileName).toString());
        if (file.exists()) {
            byte[] buffer = new byte[1024];
            FileInputStream fis = null;
            BufferedInputStream bis = null;
            try {
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                OutputStream os = res.getOutputStream();
                int i = bis.read(buffer);
                while (i != -1) {
                    os.write(buffer, 0, i);
                    i = bis.read(buffer);
                }
                log.info("下载成功");
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException(e.getMessage());
            } finally {
                if (bis != null) {
                    try {
                        bis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                if (fis != null) {
                    try {
                        fis.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
