<?php 
    require 'php/lang.php';
    require 'php/data.php';
    $active = $nav_items['home'];
?>
<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Universidad de Monterrey">
    <link rel="icon" href="favicon.ico">
    <title><?php echo $active['name']; ?> - NewtonDreams</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/index.css" rel="stylesheet">
    <style>
        .feature-icon {
            font-size: 1.5rem;
            padding-right:15px;
            float: left;
        }

        .feature-description {
            overflow: hidden;
            margin-top: 15px;
        }
    </style>
</head>

<body>
   
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="<?php echo $nav_items['home']['url'] ?>">NewtonDreams</a>
            <a class="navbar-brand" href="http://www.udem.edu.mx">
                <img src="img/logo_y.jpg" alt="Universidad de Monterrey">
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ml-auto">
                    <?php require 'php/menu.php'; ?>
                </ul>
            </div>
        </div>
    </nav>

    <main role="main">        
        <div class="jumbotron bg-info">
            <div class="container text-light">
                <h1 class="display-5 d-sm-none">Simulaciones Interactivas</h1>
                <h1 class="display-4 d-none d-sm-block">Simulaciones Interactivas</h1>
                <p class="lead mb-3">Para el aprendizaje de Física, Matemáticas y Estadística centrado en el alumno.</p>
                <div>
                    <a class="btn btn-light mt-3" href="<?php echo $nav_items['about']['url']; ?>" role="button" aria-disabled="true">
                        <span>Acerca del proyecto</span>
                        <i data-feather="chevrons-right"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="container">
            <section>
                <div class="row section-title">
                    <div class="col">
                        <h2>Conoce las herramientas</h2>
                    </div>
                </div>   
                <div class="row text-center">
                    <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
                        <div class="card h-100 card-yellow">
                            <a href="<?php echo $nav_items['physics']['url']; ?>">
                                <div class="card-body">
                                    <h4 class="card-title"><?php echo $nav_items['physics']['name']; ?></h4>
                                    <p class="card-text"><?php echo $nav_items['physics']['desc']; ?></p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-4 mb-lg-0">
                        <div class="card h-100 card-red">
                            <a href="<?php echo $nav_items['statistics']['url']; ?>">
                                <div class="card-body">
                                    <h4 class="card-title"><?php echo $nav_items['statistics']['name']; ?></h4>
                                    <p class="card-text"><?php echo $nav_items['statistics']['desc']; ?></p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <div class="card h-100 card-blue">
                            <a href="<?php echo $nav_items['math']['url']; ?>">
                                <div class="card-body">
                                    <h4 class="card-title"><?php echo $nav_items['math']['name']; ?></h4>
                                    <p class="card-text"><?php echo $nav_items['math']['desc']; ?></p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="card h-100 card-green">
                            <a href="<?php echo $nav_items['divyx']['url']; ?>">
                                <div class="card-body">
                                    <h4 class="card-title"><?php echo $nav_items['divyx']['name']; ?></h4>
                                    <p class="card-text"><?php echo $nav_items['divyx']['desc']; ?></p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div class="row section-title">
                    <div class="col">
                        <h2>Reconocimientos</h2>        
                    </div>
                </div>  
                <div class="row">
                    <div class="col-sm-6 col-lg-4 mb-4 mb-lg-0">
                        <span class="feature-icon text-info">
                            <i data-feather="globe"></i>
                        </span>
                        <div class="feature-description">
                            <h6>Presencia Internacional</h6>
                            <p class="text-muted">Presencia en más de 25 paises con más de 6500 visitantes al año. Colaboración con universidades en España, Escocia y Latinoamérica. </p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-4 mb-4 mb-lg-0">
                        <span class="feature-icon text-info">
                            <i data-feather="book-open"></i>
                        </span>    
                        <div class="feature-description">
                            <h6>Ponencias</h6>
                            <p class="text-muted">NewtonDreams ha sido publicado 4 veces en revistas internacionales y 7 en congresos internacionales.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-4">
                        <span class="feature-icon text-info">
                            <i data-feather="award"></i>
                        </span>
                        <div class="feature-description">
                            <h6>Premios</h6>
                            <p class="text-muted">Ganador al premio Ser Sobresaliente en Innovación de la Universidad de Monterrey 2018.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <span class="text-muted"> Copyright &copy; 2014 - <?php echo date("Y") ?> Departamento de Física y Matemáticas | <a class="text-muted" href="http://www.udem.edu.mx">Universidad de Monterrey</a></span>
        </div>
    </footer>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="js/popper.min.js"></script>
    <script src="js/feather.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/footer-fix.js"></script>
    <script>
        feather.replace()
    </script>

</body>
</html>
