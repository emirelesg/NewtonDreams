<?php

    // Generates the cards displayed on the physics, statistics, and math section.
    // It uses the data from data.php.

    /**
     * Variables
     */
    $len            = count($active['sim']);            // Amout of simulations available.
    $i              = 0;                                // Index of the current simulation.
    $last_row_cards = ($len % 4 == 0 ? 4 : $len % 4);   // Amout of cards in the last row.
    $limit          = $len - $last_row_cards;           // Calculate the index of last card before the last row.

    foreach ($active['sim'] as $sim) {
        
        // Avoid printing space on the first line.
        if ($i > 0) echo "                    ";

        // Increase the count, therefore i corresponds to the length.
        $i = $i + 1;

        // Determine the margins depending on the position of the cards.
        // If the cards are in the last row and depending on how many
        // cards there are in the last row the margins will change.
        if ($i == $len) {
            echo "<div class=\"col-lg-3 col-sm-6 mb-0\">";
        } else if ($i == $limit + 1) {
            if ($last_row_cards == 2) {
                echo "<div class=\"col-lg-3 col-sm-6 mb-4 mb-md-0\">";
            } else {
                echo "<div class=\"col-lg-3 col-sm-6 mb-4 mb-lg-0\">";
            }
        } else if ($i == $limit + 2) {
            echo "<div class=\"col-lg-3 col-sm-6 mb-4 mb-lg-0\">";
        } else if ($i == $limit + 3) {
            echo "<div class=\"col-lg-3 col-sm-6 mb-4 mb-md-0\">";
        } else {
            echo "<div class=\"col-lg-3 col-sm-6 mb-4\">";
        }

        // Draw badge if the url of the simulation has the characters 3d in it.
        $badge = "";
        if (strpos(strtolower($sim['url']), '3d') > -1) {
            $badge = "<h5 class=\"badge-3d\"><span class=\"badge badge-primary\">3D</span></h5>";
        }

        // Create html
        $html = <<<HTML
                        <div class="card h-100 card-default">    
                            <a href="$sim[url]">
                                $badge
                                <img class="card-img-top d-none d-sm-block" src="$sim[url]/sc.png" alt="Captura Simulación $sim[name]">
                                <div class="card-body">
                                    <h4 class="card-title">$sim[name]</h4>
                                    <p class="card-text">$sim[desc]</p>
                                </div>
                            </a>
                        </div>
                    </div>
HTML;

        echo $html;

    }

?>