package com.linyk3.web.admin;

import com.linyk3.service.ImageService;
import com.linyk3.vo.ImageUploadRes;
import com.linyk3.vo.WebResponse;
import groovy.util.logging.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;

@Slf4j
@RestController
@RequestMapping("/image")
public class ImageController {
    @Value("${file.filePath}")
    private String filePath;

    @Autowired
    ImageService imageService;

    @RequestMapping("/upload")
    public WebResponse<ImageUploadRes> uploadImage(HttpServletResponse response, @RequestParam MultipartFile file) {
        if (file.isEmpty()) {
            return new WebResponse().fail("上传失败，请选择文件");
        }
        return imageService.uplaodImage(response, file);
    }

    /**
     * 文件下载
     * @param fileName
     * @param res
     */
    @RequestMapping(value = "/download/{fileName:.+}")
    public void downloadFile(@PathVariable("fileName") String fileName, HttpServletResponse res) {
        try {
            imageService.downlaodImage(fileName, res);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
