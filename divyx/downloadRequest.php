<?php

    // This file is responsible for processing the form data from the user.
    // It parses it and writes it to the desired csv file.
    // Finally, a session is created which will allow the user to download the desired file.

    // Get DivYX versions available.
    require('../php/data.php');

    // JSON variables for AJAX request.
    $json = array(
        'success' => false
    );

    /**
     * Returns a safe string for storing it in the csv file.
     */
    function cleanText($string) {
        $string = trim($string);
        $string = stripslashes($string);
        $string = htmlspecialchars($string);
        return $string;
    }

    /**
     * Returns the user ip.
     */
    function getIP() {
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
            if (array_key_exists($key, $_SERVER) === true){
                foreach (explode(',', $_SERVER[$key]) as $ip){
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                        return $ip;
                    }
                }
            }
        }
        return "unknown";
    }

    /**
     * Return the country of the ip.
     */
    function getCountryFromIP($ip) {
        if ($ip != "unknown") {
            $data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=" . $ip));
            if (@strlen(trim($data->geoplugin_countryCode)) == 2) {
                return @$data->geoplugin_countryName;
            } else {
                return "unknown";
            }
        } else {
            return "unknown";
        }
    }

    // Check that the form was submitted.
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {

        // Get user ip data from user.
        $user_ip = getIP();
        $user_country = getCountryFromIP($user_ip);

        // Generate the unique download key
        $id = uniqid(md5(rand()));

        // Get the desired DivYX version.
        $divyx_download = $divyx_versions[intval($_POST['version'])];

        // Get fields.
        $data = array(
            'id'            => $id,
            'unix_time'     => date('U'),
            'date'          => date("Y-m-d H:i:s"),
            'ip'            => $user_ip,
            'country'       => $user_country,
            'name'          => cleanText($_POST['name']),
            'email'         => cleanText($_POST['email']),
            'use'           => cleanText($_POST['use']),
            'organization'  => cleanText($_POST['organization']),
            'version'       => cleanText($divyx_download['ver'])
        );

        // Create csv if it doesn't exist.
        if (!file_exists('protected/log.csv')) {
            $fh = fopen('protected/log.csv', 'w'); 
            fputcsv($fh, array_keys($data));
            fclose($fh);
        }

        // Open csv and write data to table.
        $fh = fopen('protected/log.csv', 'a');
        fputcsv($fh, $data);
        fclose($fh);

        // Create session and store the id.
        session_start();
        $_SESSION['id'] = $id;
        $_SESSION['time'] = time();
        $_SESSION['filename'] = $divyx_download['filename'];
        $_SESSION['path'] = 'protected/' . $divyx_download['filename'];
        
        // Send data back.
        $json['success'] = true;

    }

    header('Content-type: application/json; charset=utf-8');
    echo json_encode($json);
    exit();

?>