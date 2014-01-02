<?php

$device = "ttyACM0";
$baudrate = 9600;
$filename = "/dev/$device";

function init()
{
  $ret = false;

  global $device;
  global $baudrate;
  global $filename;

  $deviceNotSet = shell_exec("stty -F $filename $baudrate");
  if(!$deviceNotSet && is_writable($filename))
  {
      echo "Success to initialize device $device ($filename is writable)<br/>";
      $ret = true;
  }
  else
  {
    echo "Impossible to set device $filename / $baudrate<br/>";
  }

  return $ret;
}

function send($content, &$output, &$response)
{
  $ret = false;

  global $filename;
  $method = 1;

  $output = "";
  $response = 0;

  switch($method)
  {
    case 1:
      if($file = fopen($filename, 'a+'))
      {
        if($nbBytesWritten = fwrite($file, $content))
        {
          $output.="Success to write $content ($nbBytesWritten byte(s)) on $filename<br/>";
          $time_start = microtime(true);

          usleep((int)(0.1 * 1000000));

          if($response = fgets($file))
          {
            $time_end = microtime(true);
            $time_interval = round(($time_end - $time_start), 2);
            $output.="Success to receive positive response from device after $time_interval s : $response<br/>";
            $ret = true;
          }
          else
          {
            $output.="Impossible to receive positive response from device</br>";
          }
          fclose($file);
        }
        else
        {
          $output.="Impossible to write $content on $filename<br/>";
        }
      }
      else
      {
        $output.="Impossible to open file $filename in a+<br/>";
      }
      break;

    case 2:
      $out = shell_exec("echo $content > $filename");
      if(!$out)
      {
        $output.="Success to write $content on $filename<br/>";
        $ret = true;
      }
      else
      {
        $output.="Impossible to write $content on $filename<br/>";
      }
      break;
  }

  return $ret;
}

if(isset($_POST['action']) && !empty($_POST['action']))
{
    $action = $_POST['action'];

    switch($action)
    {
      case 'init':
        init();
        break;
      case 'send':
        if(isset($_POST['content']) && !empty($_POST['content']))
        {
          $output = "";
          $response = 0.0;
          $ret = false;

          $content = $_POST['content'];

          usleep((int)(0.1 * 1000000));

          $ret = send($content, $output, $response);

          $test = array('ret' => $ret, 'output' => $output, 'response' => $response);

          header('Content-Type: application/json');
          echo json_encode($test);
        }
        break;
    }
}

?>
