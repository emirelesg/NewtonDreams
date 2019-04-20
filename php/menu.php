<?php

    // This file generates the nav bar. It uses the data from data.php and the status variables
    // set at the very top of every webpage.

    /**
     * Sort array of simulations by alphabetical order.
     */
    function sortByName($a, $b) {
        return $a['name'] > $b['name'];
    }
    
    /**
     * Variables
     */
    $nl         = "\n                    ";     // New line characters.
    $c          = 0;                            // Count of dropdown menus.
    $i          = 0;                            // Count of menu items.
    $is_active  = "";                           // Is the current url active?
    $dropdowns  = false;                        // Use dropdown menus for simulations.
    
    foreach ($nav_items as $item) {

        // Do not begin with space the first line.
        if ($i > 0) echo $nl;
        $i = $i + 1;
        
        // Check if the menu is active.
        $is_active = ($active['name'] == $item['name'] ? "active" : "");

        // Does the menu item has simulations?
        if (count($item['sim']) > 0 && $dropdowns) {
            
            // Sort simulations by name.
            uasort($item['sim'], "sortByName");

            $html =     "<li class=\"nav-item dropdown $is_active\">";
            $html .=    "$nl    <a class=\"nav-link dropdown-toggle\" href=\"$item[url]\" id=\"dropdown$c\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">$item[name]</a>";
            $html .=    "$nl    <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdown$c\">";
            foreach ($item['sim'] as $sim) {
                $html .=    "$nl        <a class=\"dropdown-item\" href=\"$sim[url]\">$sim[name]</a>";
            }
            $html .=    "$nl    </div>";
            $html .=    "$nl</li>";
            $c = $c + 1;
            
        } else {
            
            // Print simple nav link.
            $html =     "<li class=\"nav-item $is_active\">";
            $html .=    "$nl    <a class=\"nav-link\" href=\"$item[url]\">$item[name]</a>";
            $html .=    "$nl</li>";
            
        }

        echo $html;
        
    }

    echo "\n";


?>