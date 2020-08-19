package ilab.core.service;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.StringUtils;
@Service
public class AmazonClient
{

	private AmazonS3 s3client;

	@Value("${amazonProperties.endpointUrl}")
	private String endpointUrl;
	@Value("${amazonProperties.bucketName}")
	private String bucketName;
	@Value("${amazonProperties.accessKey}")
	private String accessKey;
	@Value("${amazonProperties.secretKey}")
	private String secretKey;

	@PostConstruct
	private void initializeAmazon()
	{
		AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
		this.s3client = AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(Regions.US_EAST_1).build();
	}
	public void uploadContent(String content,String key)
	{
		 byte[] contentBytes = content.getBytes(StringUtils.UTF8);

	     InputStream is = new ByteArrayInputStream(contentBytes);
	     ObjectMetadata metadata = new ObjectMetadata();
	     metadata.setContentType("text/html");
	     metadata.setContentLength(contentBytes.length);


		s3client.putObject(new PutObjectRequest(bucketName+"/profiles", key, is, metadata).withCannedAcl(CannedAccessControlList.PublicRead));
	}
	public String uploadFile(MultipartFile multipartFile) {
	    String fileUrl = "";
	    try {
	        File file = convertMultiPartToFile(multipartFile);
	        String fileName = generateFileName(multipartFile);
	        fileUrl = endpointUrl + "/" + bucketName + "/" + fileName;
	        uploadFileTos3bucket(fileName, file);
	        file.delete();
	    } catch (Exception e) {
	       e.printStackTrace();
	    }
	    return fileUrl;
	}
	public String uploadFile(MultipartFile multipartFile,String key,String path) {
	    String fileUrl = "";
	    try {
	        File file = convertMultiPartToFile(multipartFile);
	        s3client.putObject(new PutObjectRequest(bucketName+"/"+path, key, file)
		            .withCannedAcl(CannedAccessControlList.PublicRead));
	        file.delete();
	    } catch (Exception e) {
	       e.printStackTrace();
	    }
	    return fileUrl;
	}
	private void uploadFileTos3bucket(String fileName, File file) {
	    s3client.putObject(new PutObjectRequest(bucketName, fileName, file)
	            .withCannedAcl(CannedAccessControlList.PublicRead));
	}
	private File convertMultiPartToFile(MultipartFile file) throws IOException {
	    File convFile = new File(file.getOriginalFilename());
	    FileOutputStream fos = new FileOutputStream(convFile);
	    fos.write(file.getBytes());
	    fos.close();
	    return convFile;
	}
	private String generateFileName(MultipartFile multiPart) {
	    return new Date().getTime() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
	}
}