package ilab.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.web.multipart.MultipartFile;

import ilab.core.domain.user.Role;
import ilab.core.domain.user.User;

public class CSVHelper
{
	public static String TYPE = "text/csv";
	static String[] HEADERs =
	{ "FirstName", "LastName", "Username", "Number", "Email", "Password" };

	public static boolean hasCSVFormat(MultipartFile file)
	{

		if (!TYPE.equals(file.getContentType()))
		{
			return false;
		}

		return true;
	}

	public static List<User> csvToUsers(InputStream is)
	{
		try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				CSVParser csvParser = new CSVParser(fileReader,
						CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());)
		{

			List<User> users = new ArrayList<User>();

			Iterable<CSVRecord> csvRecords = csvParser.getRecords();

			for (CSVRecord csvRecord : csvRecords)
			{
				User user = new User();
				user.setFirstName(csvRecord.get(0));
				user.setLastName(csvRecord.get(1));
				user.setUsername(csvRecord.get(3));
				user.setMobileNo(csvRecord.get(2));
				user.setEmail(csvRecord.get(3));
				user.setPassword(csvRecord.get(4));
				user.addRole(Role.ROLE_USER);
				users.add(user);
			}

			return users;
		} catch (IOException e)
		{
			throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
		}
	}

}