<?php

session_start();

include "php_serial.class.php"; 

function init()
{
  $ret = false;

  $serial = new phpSerial;
  $_SESSION['serial'] = serialize($serial);
  
  if($serial = unserialize($_SESSION['serial']))
  {
    if($serial->deviceSet("/dev/ttyACM0") && $serial->confBaudRate(9600))
    {
      if($serial->deviceOpen())
      {
        echo "Init : success !</br>";
        $ret = true;
      }
      else
      {
        echo "deviceOpen failed</br>";
      }
    }
    else
    {
      echo "deviceSet failed</br>";
    }
  }
  else
  {
    echo "Serial null</br>";
  }

  return $ret;
}

function send($content)
{
  $ret = false;

  if($serial = unserialize($_SESSION['serial']))
  {
    if($serial->deviceOpen())
    {
      if($serial->sendMessage($content))
      {
        echo "Send $content : success !</br>";
        $ret = true;
      }
      else
      {
        echo "sendMessage failed</br>";
      }
    }
    else
    {
      echo "deviceOpen failed</br>";
    }
  }
  else
  {
    echo "Serial null</br>";
  }

  return $ret;
}

function close()
{
  $ret = false;

  if($serial = unserialize($_SESSION['serial']))
  {
    if($serial->deviceClose())
    {
      echo "Close : success !</br>";
      $ret = true;
    }
    else
    {
      echo "deviceClose failed</br>";
    }
  }
  else
  {
    echo "Serial null</br>";
  }
  
  return $ret;
}

if(isset($_POST['action']) && !empty($_POST['action']))
{
    $action = $_POST['action'];
    $content = $_POST['content'];

    switch($action)
    {
        case 'init' : init();break;
        case 'send' : send($content);break;
        case 'close' : close();break;
    }
}

?>
