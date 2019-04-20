<?php

    // This file starts the download process. If an active session is still valid, then
    // the requeste file will be downloaded.

    // Open session.
    session_start();

    // Check if a valid session is active.
    if (isset($_SESSION['id']) && isset($_SESSION['time']) && isset($_SESSION['filename'])) {

        // Check that the session has not expired.
        if (time() - $_SESSION['time'] < 30) {

            // Get filename.
            $filename   = $_SESSION["filename"];
            $filepath   = $_SESSION["path"];

            // Start download
            ob_start();
            header("Cache-Control: public, must-revalidate");
            header("Pragma: no-cache");
            header("Content-Type: application/octet-stream");
            header("Content-Length: " .(string)(filesize($filepath)) );
            header('Content-Disposition: attachment; filename="'.$filename.'"');
            header("Content-Transfer-Encoding: binary\n");
            ob_end_clean();
            readfile($filepath);

        } else {

            session_destroy();
            echo "<meta http-equiv=\"refresh\" content=\"3;url=index.php\"/>";
            echo "La solicitud de descarga ha expirado.";
        
        }


    } else {

        // If no session is active, then report back.
        echo "<meta http-equiv=\"refresh\" content=\"3;url=index.php\"/>";
        echo "Solicitud invalida.";

    }

?>