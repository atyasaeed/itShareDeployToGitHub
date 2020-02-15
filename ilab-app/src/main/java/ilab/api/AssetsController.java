package ilab.api;


import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import ilab.core.domain.FileAsset;
import ilab.core.service.AssetService;

@Controller
public class AssetsController
{
	@Autowired
	private AssetService assetsService;
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
    public ResponseEntity<Resource> getFileAsResource(@PathVariable("id") UUID id,Authentication auth) throws Exception{
        Resource resource=new FileSystemResource("D:\\workspaces\\ilab\\resources\\files\\"+id);
        String filename=id.toString();
        if(!resource.getFile().exists()&&auth!=null)
        {
        	
        	Optional<FileAsset> optional= assetsService.getAssetFile(id, auth);
        	FileAsset fileAsset=optional.isEmpty()?null:optional.get();
        	if(fileAsset!=null)
        	{
        		resource=new FileSystemResource("D:\\workspaces\\ilab\\resources\\files\\"+fileAsset.getAccount().getId()+"\\"+id);
        		filename=fileAsset.getName();
        	}
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType("application/octet-stream"))
        	.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
        	.body(resource);
    }
}
