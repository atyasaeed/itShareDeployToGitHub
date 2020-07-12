package ilab.api;


import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import ilab.core.domain.FileAsset;
import ilab.core.service.AssetService;

@RestController
@RequestMapping(path = AssetsController.REST_URL, produces = MediaType.APPLICATION_JSON_VALUE)
public class AssetsController implements AbstractRestController<FileAsset, UUID>
{
	static final String REST_URL="/digital-assets";
	@Value("${iLab.paths.images}")
	String imagesPath;
	@Value("${iLab.paths.files}")
	String filesPath;
	@Autowired
	private AssetService assetsService;
	@GetMapping(value="images/{id}",produces = MediaType.IMAGE_JPEG_VALUE)
    @ResponseBody
    public ResponseEntity<Resource> getImageAsResource(@PathVariable("id") String id) {
        final HttpHeaders headers = new HttpHeaders();
//        Resource resource = new ServletContextResource(servletContext, "/WEB-INF/images/image-example.jpg");
        Resource resource=new FileSystemResource(imagesPath+id+".jpg");
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
	@GetMapping("files/{id}")
    @ResponseBody
    public ResponseEntity<Resource> getFileAsResource(@PathVariable("id") UUID id,Authentication auth) throws Exception{
        Resource resource=new FileSystemResource(filesPath+id);
        String filename=id.toString();
        if(!resource.getFile().exists()&&auth!=null)
        {
        	
        	Optional<FileAsset> optional= assetsService.getAssetFile(id, auth);
        	FileAsset fileAsset=optional.isEmpty()?null:optional.get();
        	if(fileAsset!=null)
        	{
        		resource=new FileSystemResource(filesPath+fileAsset.getAccount().getId()+"\\"+id);
        		filename=fileAsset.getName();
        	}
        }
        return ResponseEntity.ok().contentType(MediaType.parseMediaType("application/octet-stream"))
        	.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
        	.body(resource);
    }
	@Override
	public Page<FileAsset> getPageable(Pageable page, Specification<FileAsset> specs, Authentication auth)
	{
		return assetsService.getFiles(page, specs, auth);
	}
	@Override
	public FileAsset create(FileAsset entity, Authentication auth)
	{
		throw new UnsupportedOperationException();
	}
	@Override
	public FileAsset update(FileAsset entity, Authentication auth)
	{
		throw new UnsupportedOperationException();
	}
	@Override
	public void delete(UUID id, Authentication authentication)
	{
		throw new UnsupportedOperationException();
		
	}
	@Override
	public FileAsset get(UUID id, Authentication authentication)
	{
		return assetsService.getAssetFile(id, authentication).orElse(null);
	}
}
