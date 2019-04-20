<?php
    
    // This file is reponsible for exporting the screnshots for simulations. Blob data is passed
    // via an ajax request to this file and a screenshot with name sc.png is saved in simulation's
    // directory.

    // Only run post requests.
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        if (in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])) {

            // Get data from POST request.
            $path = '..' . $_POST['path'];
            $img = $_POST['data'];
            
            if (is_dir($path)) {
                
                // Generate output filename.
                $output_file = $path . 'sc.png';
                
                // Delete file if it already exists.
                if (file_exists($output_file)) {
                    unlink($output_file);
                }
        
                // Split the string on commas.
                // $data[ 0 ] == "data:image/png;base64"
                // $data[ 1 ] == <actual base64 string>
                $data = explode(',', $img);
                
                // Write and close file.
                $ifp = fopen($output_file, 'wb'); 
                fwrite($ifp, base64_decode($data[ 1 ]));
                fclose($ifp); 

                echo 'Img saved to ' . $output_file;

            } else {

                echo $path . ' is not a valid directory.';

            }

        } else {

            echo "Run only in localhost.";

        }

    }

?>