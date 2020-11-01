package ilab.api;

import java.io.File;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
	static final String REST_URL = "/api/digital-assets";
	@Value("${iLab.paths.images}")
	String imagesPath;
	@Value("${iLab.paths.files}")
	String filesPath;
	@Autowired
	private AssetService assetsService;

	@GetMapping("files/{id}")
	@ResponseBody
	public ResponseEntity<Resource> getFileAsResource(@PathVariable("id") UUID id, Authentication auth) throws Exception
	{
		Resource resource = new FileSystemResource(filesPath + id);
		String filename = id.toString();
		if (!resource.getFile().exists() && auth != null)
		{

			FileAsset fileAsset = assetsService.getAssetFile(id, auth).orElse(null);
			// TODO: We need to handle the files authorization?!
			if (fileAsset == null)
				fileAsset = assetsService.getAssetFile(id).orElse(null);
			if (fileAsset != null)
			{
				resource = new FileSystemResource(
						filesPath + fileAsset.getOrganization().getId() + File.separator + id);
				filename = fileAsset.getName();
			}

		}
		return ResponseEntity.ok().contentType(MediaType.parseMediaType("application/octet-stream"))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"").body(resource);
	}

	@GetMapping("files/admin/{id}")
	@ResponseBody
	@PreAuthorize("hasRole('ROLE_ADMIN')")
	public ResponseEntity<Resource> getAdminFileAsResource(@PathVariable("id") UUID id, Authentication auth)
			throws Exception
	{
		Resource resource = new FileSystemResource(filesPath + id);
		String filename = id.toString();
		if (!resource.getFile().exists() && auth != null)
		{

			FileAsset fileAsset = assetsService.getAssetFile(id).orElseThrow();
			resource = new FileSystemResource(filesPath + fileAsset.getOrganization().getId() + File.separator + id);
			filename = fileAsset.getName();
		}
		return ResponseEntity.ok().contentType(MediaType.parseMediaType("application/octet-stream"))
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"").body(resource);
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
		return assetsService.getAssetFile(id, authentication).orElseThrow();
	}
}
