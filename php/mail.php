<?php

	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

	require 'PHPMailer/src/Exception.php';
	require 'PHPMailer/src/PHPMailer.php';
	require 'PHPMailer/src/SMTP.php';

	// require_once $_SERVER['DOCUMENT_ROOT']."\\cnf\\cnf.php";
	require_once "../cnf/cnf.php";

	$formData = [
		'error' => [],
		'send' => false
	];

	$checkList = [
		'ok' => true,
		'nameIsCorrect' => false,
		'phoneNumberIsCorrect' => false,
		'emailIsCorrect' => false,
		'infoIsCorrect' => false,
		'fileIsCorrect' => false
	];
	

	if (isset($_POST['submit']) || isset($_POST['hidden'])) {
		if (isset($_POST['personName'])) {
			personNameHandler($formData, $checkList);
		}
		if (isset($_POST['phoneNumber'])) {
			phoneNumberHandler($formData, $checkList);
		}
		if (isset($_POST['email'])) {
			emailHandler($formData, $checkList);
		}
		if (isset($_POST['info'])) {
			infoHandler($formData, $checkList);
		}
		if (isset($_FILES['file'])) {
			fileHandler($formData, $checkList);
		}
		
		foreach ($checkList as &$ck) {
			if ($ck == false) {
				$checkList['ok'] = false;
				break;
			}
		}

		if ($checkList['ok']) {
			sendEmail($formData, $gml);
		}
		
		sendJSON($formData);
	}

	function sendJSON(&$formData) {
		echo json_encode($formData, JSON_UNESCAPED_UNICODE);
	}

	function personNameHandler (&$formData, &$checkList) {
		$formData['personName'] = trim(filter_input(INPUT_POST, 'personName', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

		$personNameLength = mb_strlen($formData['personName']);
		if($personNameLength == 0) {
			array_push($formData['error'], 'nameIsNull');
		} else {
			if($personNameLength < 2) {
				array_push($formData['error'], 'nameIsTooShort');
			} else {
				if($personNameLength >= 100) {
					array_push($formData['error'], 'nameIsTooLong');
				} else {
					$checkList['nameIsCorrect'] = true;
				}
			}
		}
	}

	function phoneNumberHandler (&$formData, &$checkList) {
		$formData['phoneNumber'] = filter_input(INPUT_POST, 'phoneNumber', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$phoneNumberArr = preg_split('//', $formData['phoneNumber'], -1, PREG_SPLIT_NO_EMPTY);
		$phoneNumberArr = array_filter($phoneNumberArr, function($k) {
			    return preg_match("/\d/", $k);
			});
		$formData['phoneNumber'] = implode('', $phoneNumberArr);
		if (!filter_var($formData['phoneNumber'], 
						FILTER_VALIDATE_REGEXP,
						['options' => ['regexp' => "/^\d{11,20}$/"]
						]
						)) {
			$phoneNumberLenght = mb_strlen($formData['phoneNumber']);
			if($phoneNumberLenght > 0) {
				if($phoneNumberLenght < 11) {
					array_push($formData['error'], 'phoneNumberIsTooShort');
				} else {
					if($phoneNumberLenght > 20) {
						array_push($formData['error'], 'phoneNumberIsTooLong');
					} else {
						array_push($formData['error'], 'Incorrect phoneNumber');
					}
				}
			} else {
				$checkList['phoneNumberIsCorrect'] = true;
			}
		} else {
			$checkList['phoneNumberIsCorrect'] = true;
		}
	}

	function emailHandler (&$formData, &$checkList) {
		$formData['email'] = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

		if (!filter_var(trim($formData['email']), FILTER_VALIDATE_EMAIL)) {
			array_push($formData['error'], 'Incorrect email');
		} else {
			$formData['email'] = trim($formData['email']);
			$checkList['emailIsCorrect'] = true;
		}
	}

	function infoHandler (&$formData, &$checkList) {
		$formData['info'] = trim(filter_input(INPUT_POST, 'info', FILTER_SANITIZE_FULL_SPECIAL_CHARS));

		$infoLength = mb_strlen($formData['info']);

		$checkList['infoIsCorrect'] = true;

		if($infoLength == 0) {
			array_push($formData['error'], 'infoIsNull');
		} else {
			if($infoLength <= 2) {
				array_push($formData['error'], 'infoIsTooShort');
			} else {
				if($infoLength >= 2000) {
					array_push($formData['error'], 'infoIsTooLong');
					$checkList['infoIsCorrect'] = false;
				} else {
				}
			}
		}
	}

	function fileHandler (&$formData, &$checkList) {
		$data = $_FILES['file'];
		$tmp = $data['tmp_name'];
		if (is_uploaded_file($tmp)) {
			$formData['file'] = $_FILES['file'];
			if (preg_match('/.exe$/', $data['name'], $p)) {
				array_push($formData['error'], 'fileIsExe');
			} else {
				if ($data['size'] > 10485760) {
					array_push($formData['error'], 'fileIsTooBig');
				} else {
					$formData['fileName'] = $data['name'];
					$formData['filePath'] = $tmp;
					$checkList['fileIsCorrect'] = true;
				}
			}
		} else {
			if ($data['error'] == 1) {
				array_push($formData['error'], 'fileIsTooBig');
			} else {
				array_push($formData['error'], 'fileIsNotUploads');
				$checkList['fileIsCorrect'] = true;
			}
		}
	}

	function sendEmail(&$formData, $gml) {
		function mailBody(&$mailData, $forMe) {
			$data = '';
			if ($forMe) {
				$data = '<tr>
									<td>
										<table style="border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px" width="100%" cellspacing="0" cellpadding="0" border="0">
											<tbody>
												<tr>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">name</td>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">'.$mailData['personName'].'</td>
												</tr>
												<tr>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">phone</td>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">'.$mailData['phoneNumber'].'</td>
												</tr>
												<tr>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">email</td>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">'.$mailData['email'].'</td>
												</tr>
												<tr>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">info</td>
													<td style="font-size:18px;margin:0;padding:8px;border:1px solid black;">'.$mailData['info'].'</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>';
			}
			return '<table style="border-collapse:collapse" cellspacing="0" cellpadding="0" border="0" align="center">
			<tbody>
				<tr>
					<td colspan="3" style="line-height:20px" height="20">&nbsp;</td>
				</tr>
				<tr>
					<td style="width:16px" width="16"></td>
					<td style="background:#F2F2F2;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif">
						<table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
							<tbody>


								<tr>
									<td>
										<table style="background:#454C59;border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px;color:#F2F2F2;" width="100%" cellspacing="0" cellpadding="0" border="0">
											<tbody>
												<tr>
													<td style="width:100px;padding:8px;">
														<img src="cid:img" alt="Miroslav Petrov" border="0" width="100" height="100" style="display:block;border-radius:6px;"/>
													</td>
													<td style="padding:8px 0;vertical-align: bottom;">
														<table style="border-collapse:collapse" width="100%" cellspacing="0" cellpadding="0" border="0">
															<tbody>
																<tr>
																	<td style="padding:0 0 8px;font-size:16px;">Miroslav Petrov</td>
																</tr>
																<tr>
																	<td><a href="https://miroslavpetrov.ru/" style="color:#F24B59;text-decoration:none;font-size:14px;" target="_blank" rel="noopener noreferrer">miroslavpetrov.ru</a></td>
																</tr>
																<tr>
																	<td><a href="mailto:miroslavpetrov.collaboration@gmail.com" style="color:#F24B59;text-decoration:none;font-size:14px;" target="_blank" rel="noopener noreferrer">miroslavpetrov.collaboration@gmail.com</a></td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td>
										<table style="border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px" width="100%" cellspacing="0" cellpadding="0" border="0">
											<tbody>
												<tr>
													<td style="color:#454C59;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif;font-size:18px;margin:0;padding:64px 8px 0;text-align:center;width:300px">Hello '.$mailData['personName'].'!</td>
												</tr>
												<tr>
													<td style="color:#454C59;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif;font-size:16px;margin:0;padding:24px 24px 0;width:300px">Thank you for your email!<br>I will try to answer your letter as soon as possible.</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>'.$data.'
								<tr>
									<td>
										<table style="border-collapse:collapse;margin:0 auto 0 auto;text-align:center;width:430px" width="430" cellspacing="0" cellpadding="0" border="0" align="center">
											<tbody>
												<tr>
													<td style="line-height:48px" height="48">&nbsp;</td>
												</tr>
												<tr>
													<td style="width:100%;border-top-color:#dbdbdb;border-top-style:solid;border-top-width:1px"></td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>

								<tr>
									<td>
										<table style="border-collapse:collapse;margin:0 auto 5px auto;padding:3px 0 3px 0;width:430px" width="100%" cellspacing="0" cellpadding="0" border="0">
											<tbody>
												<tr>
													<td style="color:#454C59;font-family:\'helvetica neue\' , \'helvetica\' , \'roboto\' , \'arial\' , sans-serif;font-size:11px;margin:0;padding:8px;width:300px">The message was sent because email <a href="#" style="color:#F24B59;text-decoration:none;font-size:11px;" target="_blank" rel="noopener noreferrer">'.$mailData['email'].'</a> was indicated when filling out the feedback form on the website <a href="https://miroslavpetrov.ru/" style="color:#F24B59;text-decoration:none;font-size:11px;" target="_blank" rel="noopener noreferrer">miroslavpetrov.ru</a>. If you did not fill out the form, please disregard this letter. I apologize for the inconvenience caused.</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>


							</tbody>
						</table>
					</td>
					<td style="width:16px" width="16"></td>
				</tr>
				<tr>
					<td colspan="3" style="line-height:20px" height="20">&nbsp;</td>
				</tr>
			</tbody>
		</table>';
		}
		
		$mailData = [];
		if ($formData['personName']) {
			$mailData['personName'] = $formData['personName'];
		} else {
			$mailData['personName'] = false;
		}
		if ($formData['phoneNumber']) {
			$mailData['phoneNumber'] = $formData['phoneNumber'];
		} else {
			$mailData['phoneNumber'] = false;
		}
		if ($formData['email']) {
			$mailData['email'] = $formData['email'];
		} else {
			$mailData['email'] = false;
		}
		if ($formData['info']) {
			$mailData['info'] = $formData['info'];
		} else {
			$mailData['info'] = false;
		}
		if ($formData['info']) {
			$mailData['info'] = $formData['info'];
		} else {
			$mailData['info'] = false;
		}
		if (isset($formData['filePath'])) {
			/*$file = $_SERVER['DOCUMENT_ROOT']."\\php\\uploadFiles\\".$formData['fileName'];*/
			$file = "uploadFiles/".$formData['fileName'];

			if (move_uploaded_file($formData['filePath'], $file)) {
				$mailData['file'] = $file;
			} else {
				$mailData['file'] = false;
			}
		} else {
			$mailData['file'] = false;
		}

		$mail = new PHPMailer;
		$mail->isSMTP();
		// SMTP::DEBUG_OFF = off (for production use)
		// SMTP::DEBUG_CLIENT = client messages
		// SMTP::DEBUG_SERVER = client and server messages
		$mail->SMTPDebug = SMTP::DEBUG_OFF;
		$mail->Host = 'smtp.gmail.com';
		$mail->Port = 587;
		$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
		$mail->SMTPAuth = true;
		$mail->SMTPKeepAlive = true;
		$mail->CharSet = "utf-8";
		$mail->Username = 'petrovproweb.ultimatefreehost@gmail.com';
		$mail->Password = $gml;

		$mail->setFrom('no_reply@miroslavpetrov.ru', 'Miroslav Petrov');
		$mail->addReplyTo('miroslavpetrov.collaboration@gmail.com', 'Miroslav Petrov');
		$mail->addAddress($mailData['email'], $mailData['personName']);
		$mail->Subject = 'Dear '.$mailData['personName'].', your message has been received.';
		$mail->isHTML(true);
		$mail->Body = mailBody($mailData, false);
		$mail->AltBody = "Hello ".$mailData['personName']."!\r\nThank you for your email! I will try to answer your letter as soon as possible.\r\n\r\nMiroslav Petrov\r\n\r\nmiroslavpetrov.ru\r\nmiroslavpetrov.collaboration@gmail.com\r\n\r\n\r\nThe message was sent because email ".$mailData['email']." was indicated when filling out the feedback form on the website miroslavpetrov.ru. If you did not fill out the form, please disregard this letter. I apologize for the inconvenience caused.";
		$mail->addEmbeddedImage('../img/emailImg.jpg', 'img');

		function tryToSendMail(&$mail, &$formData) {
			try {
				if ($mail->send()) {
					$formData['send'] = true;
				} else {
					array_push($formData['error'], 'Mailer Error: '. $mail->ErrorInfo);
					$formData['send'] = false;
				}
	    } catch (Exception $e) {
	    	array_push($formData['error'], 'mailIsNotSend');
	    	array_push($formData['error'], 'Mailer Error: '. $mail->ErrorInfo);
	    	$formData['send'] = false;
	      $mail->getSMTPInstance()->reset();
	    }
		}
		tryToSendMail($mail, $formData);
		$mail->clearAddresses();
		
  	$mail->addAddress($mail->Username, $mailData['personName']);
  	$mail->Body = mailBody($mailData, true);
  	$mail->addAttachment($mailData['file']);
  	tryToSendMail($mail, $formData);
	}