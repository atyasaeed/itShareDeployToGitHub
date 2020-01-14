package ilab.api;


import java.util.UUID;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AssetsController
{
	@GetMapping(value="assets/images/{id}",produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<Resource> getImageAsResource(@PathVariable("id") String id) {
        final HttpHeaders headers = new HttpHeaders();
//        Resource resource = new ServletContextResource(servletContext, "/WEB-INF/images/image-example.jpg");
        Resource resource=new FileSystemResource("D:\\workspaces\\ilab\\resources\\images\\"+id+".jpg");
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
	@GetMapping("assets/files/{id}")
    @ResponseBody
    public ResponseEntity<Resource> getFileAsResource(@PathVariable("id") String id) {
        final HttpHeaders headers = new HttpHeaders();
//        Resource resource = new ServletContextResource(servletContext, "/WEB-INF/images/image-example.jpg");
        Resource resource=new FileSystemResource("D:\\workspaces\\ilab\\resources\\files\\"+id);
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
}
