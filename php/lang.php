<?php

    // This file sets up the basis for supporting multiple languages. It detects
    // the language set by the user and is storred in a Session variable, which can later
    // be used to change dictionaries and update the text.

    session_start();
    if (!isset($_SESSION['lang'])) {
        $_SESSION['lang'] = "en";
    } else if (isset($_GET['lang']) && !empty($_GET['lang']) && $_SESSION['lang'] != $_GET['lang']) {
        switch ($_GET['lang']) {
            case "es":
                $_SESSION['lang'] = "es";
                break;
            case "en":
            default:
                $_SESSION['lang'] = "en";
        }
    }
?>