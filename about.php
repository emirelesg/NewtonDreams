<?php 
    require 'php/lang.php';
    require 'php/data.php';
    $active = $nav_items['about'];
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
        .social a {
            margin: 0 .2rem;
        }

        .btn-linkedin {
            background-color: #0077B5;
            color: #FFFFFF;
        }

        .btn-linkedin:hover {
            background-color: #005682;
            color: #FFFFFF;
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
        <div class="container">
            <section>
                <div class="section-title row">
                    <div class="col">
                        <h1>Acerca de Nosotros</h1>
                        <p class="lead">Conoce la historia y al equipo de NewtonDreams.</p>
                    </div>        
                </div>
            </section>
            <section>
                <div class="row">
                    <div class="col-sm-8 mb-5 mb-sm-0">
                        <h2 class="section-title">Lo que hacemos</h2>
                        <p>NewtonDreams es un repositorio de simulaciones y herramientas cognitivas enfocadas al aprendizaje de la Física, Estadística y Matemáticas iniciado en el 2014 por la Universidad de Monterrey, México.</p>
                        <p>El objetivo el sitio es proveer a los alumnos de un ambiente de aprendizaje conformado por las simulaciones y la herramienta de análisis de videos digitales presentadas en el sitio, las cuales en conjunto con las secuencias didácticas apropiadas proveen las herramientas y situaciones adecuadas para que los alumnos logren su propio aprendizaje de una manera casi autónoma.</p>
                        <p>Creemos firmemente en que estas herramientas sean gratuitas y multiplataforma sin dependencia de algún software adicional. Por ello, NewtonDreams está desarrollado para poder ser utilizado en el celular, en la tablet o en la computadora. Esto ha logrado que NewtonDreams sea una tecnología pionera a nivel mundial en el ámbito educativo. Somos la única universidad en México y Latinoamérica con un sitio de esta naturaleza.</p>
                    </div>
                    <div class="col-sm-4">
                        <h2 class="section-title">Contactanos</h2>
                        <p>Queremos escuchar tus comentarios y sugerencias.</p>
                        <address>
                            <strong>Universidad de Monterrey - UDEM</strong>
                            <br>Oficina 6320 Edificio 6
                            <br>Av. Ignacio Morones Prieto #4500
                            <br>66238 San Pedro Garza García
                            <br>Nuevo León, México
                            <br>
                        </address>
                        <address>
                            <abbr title="Teléfono">Tel:</abbr>
                            01 (81) 8215 1000 Ext: 1211
                        </address>
                    </div>
                </div>
            </section>
            <section>
                <div class="section-title row">
                    <div class="col">
                        <h2>El Equipo</h2>
                    </div>
                </div>
                <div class="row text-center">
                    <div class="col-lg-4 col-sm-6 mb-4 mb-lg-0">
                        <img class="img-fluid d-block mx-auto mb-4" src="img/enrique.jpg" alt="Enrique Mireles">
                        <h4>Enrique Mireles</h4>
                        <h5 class="text-muted subtitle">Desarrollador</h5>
                        <p>Programación de simulaciones y mantenimiento del sitio.</p>
                        <div class="social">
                            <a class="btn btn-sm btn-linkedin" href="https://linkedin.com/in/emirelesg" role="button">
                                <i data-feather="linkedin"></i>
                            </a>
                            <a class="btn btn-sm btn-info" href="mailto:enrique.mireles@udem.edu" role="button">
                                <i data-feather="mail"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-4 col-sm-6 mb-4 mb-lg-0">
                        <img class="img-fluid d-block mx-auto mb-4" src="img/osvaldo.png" alt="Osvaldo Aquínes">
                        <h3>Osvaldo Aquínes</h3>
                        <h5 class="text-muted subtitle">Coordinador NewtonDreams</h5>
                        <p>Planeación, diseño y revisión de simulaciones del sitio.</p>
                        <div class="social">
                            <a class="btn btn-sm btn-warning" href="https://pure.udem.edu.mx/es/persons/osvaldo-aquines-guti%C3%A9rrez" role="button">
                                <i data-feather="book"></i>
                                <span>Pure UDEM</span>
                            </a>
                            <a class="btn btn-sm btn-info" href="mailto:osvaldo.aquines@udem.edu" role="button">
                                <i data-feather="mail"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-4 col-sm-6 mb-4 mb-lg-0">
                        <img class="img-fluid d-block mx-auto mb-4" src="img/hector.png" alt="Héctor González">
                        <h3>Héctor González</h3>
                        <h5 class="text-muted subtitle">Coordinador DivYX</h5>
                        <p>Planeación, diseño y revisión de la aplicación DivYX.<br> </p>
                        <div class="social">
                            <a class="btn btn-sm btn-warning" href="https://pure.udem.edu.mx/es/persons/h%C3%A9ctor-antonio-gonz%C3%A1lez-flores" role="button">
                                <i data-feather="book"></i>
                                <span>Pure UDEM</span>
                            </a>
                            <a class="btn btn-sm btn-info" href="mailto:hector.gonzalezf@udem.edu" role="button">
                                <i data-feather="mail"></i>
                            </a>
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
