package ilab.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import ilab.utils.MessageUtil;
import ilab.utils.ValidationUtil;
import ilab.utils.exception.ApplicationException;
import ilab.utils.exception.ErrorInfo;
import ilab.utils.exception.ErrorType;

@RestControllerAdvice(annotations = RestController.class)
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class ExceptionInfoHandler
{
	// https://github.com/gkislin/topjava/blob/master/src/main/java/ru/javawebinar/topjava/web/ExceptionInfoHandler.java
	private static Logger log = LoggerFactory.getLogger(ExceptionInfoHandler.class);

	public static final String EXCEPTION_DUPLICATE_EMAIL = "exception.user.duplicateEmail";
	public static final String EXCEPTION_DUPLICATE_USERNAME = "exception.user.duplicateName";
	public static final String EXCEPTION_DUPLICATE_ARNAME = "exception.user.duplicateArName";
	public static final String EXCEPTION_DUPLICATE_ENNAME = "exception.user.duplicateEnName";
	public static final String EXCEPTION_DUPLICATE_PHONENO = "exception.user.duplicatePhoneNo";
	public static final String EXCEPTION_DUPLICATE_IDNUMBER = "exception.user.duplicateIdNumber";
	public static final String EXCEPTION_CONSTRAINTVIOLATION = "exception.user.constraintViolationException";

	private static final Map<String, String> CONSTRAINS_I18N_MAP = Map.of("user_unique_email_idx",
			EXCEPTION_DUPLICATE_EMAIL, "user_unique_username_idx", EXCEPTION_DUPLICATE_USERNAME,
			"user_unique_arname_idx", EXCEPTION_DUPLICATE_ARNAME, "user_unique_enname_idx", EXCEPTION_DUPLICATE_ENNAME,
			"user_unique_phone_idx", EXCEPTION_DUPLICATE_PHONENO, "user_unique_idnumber_idx",
			EXCEPTION_DUPLICATE_IDNUMBER, "user_unique_user_id_org_id_idx", EXCEPTION_CONSTRAINTVIOLATION);

	@Autowired
	private MessageUtil messageUtil;

	@ExceptionHandler(ApplicationException.class)
	public ResponseEntity<ErrorInfo> applicationError(HttpServletRequest req, ApplicationException appEx)
	{
		ErrorInfo errorInfo = logAndGetErrorInfo(req, appEx, false, appEx.getType(), messageUtil.getMessage(appEx));
		return ResponseEntity.status(appEx.getType().getStatus()).body(errorInfo);
	}

	@ResponseStatus(value = HttpStatus.CONFLICT) // 409
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ErrorInfo conflict(HttpServletRequest req, DataIntegrityViolationException e)
	{
		String rootMsg = e.getRootCause().getMessage();
		if (rootMsg != null)
		{
			String lowerCaseMsg = rootMsg.toLowerCase();
			Optional<Map.Entry<String, String>> entry = CONSTRAINS_I18N_MAP.entrySet().stream()
					.filter(it -> lowerCaseMsg.contains(it.getKey())).findAny();
			if (entry.isPresent())
			{
				return logAndGetErrorInfo(req, e, false, ErrorType.VALIDATION_ERROR,
						messageUtil.getMessage(entry.get().getValue()));
			}
		}
		return logAndGetErrorInfo(req, e, true, ErrorType.DATA_ERROR);
	}

	@ResponseStatus(value = HttpStatus.UNPROCESSABLE_ENTITY) // 422
	@ExceptionHandler(
	{ BindException.class, MethodArgumentNotValidException.class })
	public ErrorInfo bindValidationError(HttpServletRequest req, Exception e)
	{
		BindingResult result = e instanceof BindException ? ((BindException) e).getBindingResult()
				: ((MethodArgumentNotValidException) e).getBindingResult();

		String[] details = result.getFieldErrors().stream().map(fe -> messageUtil.getMessage(fe))
				.toArray(String[]::new);

		return logAndGetErrorInfo(req, e, false, ErrorType.VALIDATION_ERROR, details);
	}

	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(Exception.class)
	public ErrorInfo handleError(HttpServletRequest req, Exception e)
	{
		return logAndGetErrorInfo(req, e, true, ErrorType.APP_ERROR);
	}

//  https://stackoverflow.com/questions/538870/should-private-helper-methods-be-static-if-they-can-be-static
	private ErrorInfo logAndGetErrorInfo(HttpServletRequest req, Exception e, boolean logException, ErrorType errorType,
			String... details)
	{
		Throwable rootCause = ValidationUtil.logAndGetRootCause(log, req, e, logException, errorType);
		return new ErrorInfo(req.getRequestURL(), errorType, messageUtil.getMessage(errorType.getErrorCode()),
				details.length != 0 ? details : new String[]
				{ ValidationUtil.getMessage(rootCause) });
	}
}
