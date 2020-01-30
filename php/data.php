<?php

    // This file is a text-based database for all simulations and pages on the website.
    // Updating this file will result in an update on the webpage.

    // Update base address if the site is on localhost.
    // This means that if the server is on localhost all webpages will start with /localhost/
    // If the server is on newtondreams.com all webpages will start with newtondreams.com.
    $base = ($_SERVER['SERVER_NAME'] == "localhost" || in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1']) ? "/NewtonDreams" : "");
    // $base = (filter_var($_SERVER['REMOTE_ADDR'], FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) ? "" : "/newtondreams-bs4");

    // Physics simulations.
    $physics = array(
        "barra_cargada" => array(
            "name"  => "Barra Cargada",
            "desc"  => "Calcula el campo eléctrico en un punto producido por una barra uniformemente cargada.",
            "url"   => "$base/fisica/barra_cargada/",
            "ver"   => "2.0.0",
            "date"  => "22/01/2019"
        ),
        /*"bernoulli" => array(
            "name"  => "Bernoulli",
            "desc"  => "Conoce la física del vuelo de un avión.",
            "url"   => "$base/fisica/bernoulli/",
            "ver"   => "1.0.0",
            "date"  => "22/01/2019"
        ),*/
        "caida_libre" => array(
            "name"  => "Caída Libre",
            "desc"  => "Simula el movimiento en caida libre de un proyectil.",
            "url"   => "$base/fisica/caida_libre/",
            "ver"   => "2.1.0",
            "date"  => "27/01/2020"
        ),
        "calculadora_vectores" => array(
            "name"  => "Calculadora de Vectores",
            "desc"  => "Calcula la suma o diferencia de dos o más vectores.",
            "url"   => "$base/fisica/calculadora_vectores/",
            "ver"   => "1.3.0",
            "date"  => "29/01/2019"
        ),
        "carga_campo" => array(
            "name"  => "Carga en un Campo Eléctrico",
            "desc"  => "Varía el campo electrico y calcula la fuerza ejercida sobre la carga de prueba Q.",
            "url"   => "$base/fisica/carga_campo/",
            "ver"   => "2.0.0",
            "date"  => "22/01/2019"
        ),
        "circuito_electrico" => array(
            "name"  => "Circuito Eléctrico",
            "desc"  => "Calcula las caídas de voltaje y corrientes de cada resistencia.",
            "url"   => "$base/fisica/circuito_electrico/",
            "ver"   => "2.0.0",
            "date"  => "22/01/2019"
        ),
        "flujo" => array(
            "name"  => "Flujo de Corriente por un Tubo",
            "desc"  => "Comprueba el Principio de Bernoulli.",
            "url"   => "$base/fisica/flujo/",
            "ver"   => "2.0.0",
            "date"  => "22/01/2019"
        ),
        "fuerza_electrica" => array(
            "name"  => "Fuerza Eléctrica",
            "desc"  => "Calcula la fuerza resultante sobre partícula cargada.",
            "url"   => "$base/fisica/fuerza_electrica/",
            "ver"   => "2.0.0",
            "date"  => "22/01/2019"
        ),
        "gauss" => array(
            "name"  => "Ley de Gauss",
            "desc"  => "Calcula el campo eléctrico para una esféra de carga uniforme.",
            "url"   => "$base/fisica/gauss/",
            "ver"   => "2.0.0",
            "date"  => "22/01/2019"
        ),
        "momento_inercia" => array(
            "name"  => "Momento de Inercia",
            "desc"  => "Compara diversos objetos rodando por un plano inclinado.",
            "url"   => "$base/fisica/momento_inercia/",
            "ver"   => "1.1.0",
            "date"  => "27/01/2020"
        ),
        "operaciones_vectores" => array(
            "name"  => "Operaciones Básicas con Vectores",
            "desc"  => "Realiza operaciones de suma, resta y producto punto entre dos vectores.",
            "url"   => "$base/fisica/operaciones_vectores/",
            "ver"   => "2.0.0",
            "date"  => "22/01/2019"
        ),
        "pendulo_simple" => array(
            "name"  => "Péndulo Simple",
            "desc"  => "Simula un péndulo para ángulos pequeños.",
            "url"   => "$base/fisica/pendulo_simple/",
            "ver"   => "2.1.0",
            "date"  => "27/01/2020"
        ),
        "plano_inclinado" => array(
            "name"  => "Plano Inclinado",
            "desc"  => "Calcula la aceleración de los cuerpos y la tensión del cable en un plano inclinado sin fricción.",
            "url"   => "$base/fisica/plano_inclinado/",
            "ver"   => "2.1.0",
            "date"  => "27/01/2020"
        ),
        "resorte" => array(
            "name"  => "Resorte",
            "desc"  => "Simula un resorte utilizando la Ley de Hooke.",
            "url"   => "$base/fisica/resorte/",
            "ver"   => "3.0.0",
            "date"  => "27/20/2020"
        ),
        "teoria_cinetica" => array(
            "name"  => "Teoría Cinética Molecular",
            "desc"  => "Simula un gas ideal.",
            "url"   => "$base/fisica/teoria_cinetica/",
            "ver"   => "2.1.0",
            "date"  => "27/01/2020"
        ),
        "tiro_parabolico" => array(
            "name"  => "Tiro Parabólico",
            "desc"  => "Simula el movimiento de un proyectil.",
            "url"   => "$base/fisica/tiro_parabolico/",
            "ver"   => "2.1.0",
            "date"  => "27/01/2020"
        ),
        "transferencia_calor" => array(
           "name"  => "Transferencia de calor",
           "desc"  => "Simula la transferencia de calor entre dos cuerpos.",
           "url"   => "$base/fisica/transferencia_calor/",
           "ver"   => "1.0.0",
           "date"  => "16/01/2020"
        )
    );

    // Statistics simulations.
    $statistics = array(
        "distribucion_normal" => array(
            "name"  => "Distribución Normal",
            "desc"  => "Cambia la media (&mu;) y desviación típica (&sigma;) de dos distribuciones normales.",
            "url"   => "$base/estadistica/distribucion_normal/",
            "ver"   => "2.1.0",
            "date"  => "27/01/2020"
        ),
        "visualizacion_datos" => array(
            "name"  => "Visualizador de Datos",
            "desc"  => "Grafica datos en forma de histograma, dispersión o línea y realiza una regresión con ellos.",
            "url"   => "$base/estadistica/visualizacion_datos/",
            "ver"   => "1.1.0",
            "date"  => "27/01/2020"
        )
    );

    // Math simulations.
    $math = array(
        "funciones" => array(
            "name"  => "Funciones Paramétricas",
            "desc"  => "Simula distintas funciones paramétricas.",
            "url"   => "$base/matematicas/funciones/",
            "ver"   => "2.0.0",
            "date"  => "10/04/2019"
        ),
        "polinomio" => array(
            "name"  => "Polinomio",
            "desc"  => "Grafica una función de la forma: A<sub>0</sub> + A<sub>1</sub>x<sup>1</sup> +  A<sub>2</sub>x<sup>2</sup> + A<sub>3</sub>x<sup>3</sup> + A<sub>4</sub>x<sup>4</sup>",
            "url"   => "$base/matematicas/polinomio/",
            "ver"   => "1.1.0",
            "date"  => "27/01/2020"
        ),
        "translacion_simetria" => array(
            "name"  => "Traslación y Simetría",
            "desc"  => "Traslada una función de la forma: x<sup>2<sup>",
            "url"   => "$base/matematicas/translacion_simetria/",
            "ver"   => "1.0.0",
            "date"  => "23/01/2020"
        )
    );

    // Divyx App.
    $divyx = array(
        "app" => array(
            "name"  => "DivYX",
            "desc"  => "Online video analysis.",
            "url"   => "$base/divyx/app/",
            "ver"   => "3.1.0",
            "date"  => "14/04/2019"
        )
    );

    // Divyx Versions.
    $divyx_versions = array(
        array(
            "name"      => "2.2 (Windows 7) - 5.8 MB",
            "ver"       => "2.2",
            "filename"  => "Divyx_2_2.zip",
            "date"      => "23/11/2016"
        ),
        array(
            "name"      => "1.0 (Windows XP) - 7.7 MB",
            "ver"       => "1.0",
            "filename"  => "Divyx_1.zip",
            "date"      => ""
        )
    );

    // Main nav.
    $nav_items = array(
        "home" => array(
            "name"  => "Inicio",
            "desc"  => "",
            "url"   => "$base/",
            "sim"   => array()
        ),
        "physics" => array(
            "name"  => "Física",
            "desc"  => "Conoce sobre Fuerzas, Vectores, Electricidad, Dinámica y Magnetismo.",
            "url"   => "$base/display.php?s=physics",
            "sim"   => $physics
        ),
        "statistics" => array(
            "name"  => "Estadística",
            "desc"  => "Conoce sobre Distribuciones y Gráficas.",
            "url"   => "$base/display.php?s=statistics",
            "sim"   => $statistics
        ),
        "math" => array(
            "name"  => "Matemáticas",
            "desc"  => "Conoce sobre Funciones y Polinomios.",
            "url"   => "$base/display.php?s=math",
            "sim"   => $math
        ),
        "divyx" => array(
            "name"  => "DivYX",
            "desc"  => "Analiza el movimiento de objetos por video.",
            "url"   => "$base/divyx/",
            "sim"   => $divyx
        ),
        "about" => array(
            "name"  => "Acerca",
            "desc"  => "",
            "url"   => "$base/about.php",
            "sim"   => array()
        )
    );
?>