<?php
    require '../../php/lang.php';
    require '../../php/data.php';
    $active         = $nav_items['physics'];
    $active_sim     = $active['sim']['operaciones_vectores'];
?>
<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Universidad de Monterrey">
    <link rel="icon" href="../../favicon.ico">
    <title><?php echo $active_sim['name'] . " - " . $active['name']; ?> - NewtonDreams</title>
    <link href="../../css/bootstrap.min.css" rel="stylesheet">
    <link href="../../css/nouislider.css" rel="stylesheet">
    <link href="../../css/index.css" rel="stylesheet">
    <style></style>
</head>

<body>
   
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="<?php echo $nav_items['home']['url'] ?>">NewtonDreams</a>
            <a class="navbar-brand" href="http://www.udem.edu.mx">
                <img src="../../img/logo_y.jpg" alt="UDEM">
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ml-auto">
                    <?php require '../../php/menu.php'; ?>
                </ul>
            </div>
        </div>
    </nav>

    <main role="main">
        <div class="container">
            <section>
                <div class="row">
                    <div class="col">
                        <h1><?php echo $active_sim['name']; ?></h1>
                        <h5 class="text-muted subtitle">Versión <?php echo $active_sim['ver']; ?></h5>
                        <p class="lead"><?php echo $active_sim['desc']; ?></p>
                    </div>        
                </div>
            </section>
            <section>
                <div class="row">
                    <div class="col-lg-5 controls">
                        <div class="row">
                            <div class="col">
                                <h4>Vector A</h4>
                            </div>
                        </div> <!-- end .row- -->
                        <div class="row">
                            <div class="col">
                                <table class="table slider-table">
                                    <tr>
                                        <td nowrap>Magnitud</td>
                                        <td class="w-100"><div id="a_mag_slider"></div></td>
                                        <td><input id="a_mag_label" type="text" class="input-80 form-control form-control-sm text-center" readonly></td>
                                    </tr>
                                    <tr>
                                        <td nowrap>Ángulo</td>
                                        <td class="w-100"><div id="a_ang_slider"></div></td>
                                        <td><input id="a_ang_label" type="text" class="input-80 form-control form-control-sm text-center" readonly></td>
                                    </tr>
                                </table>
                            </div>
                        </div> <!-- end .row- -->
                        <div class="row">
                            <div class="col">
                                <h4>Vector B</h4>
                            </div>
                        </div> <!-- end .row- -->
                        <div class="row">
                            <div class="col">
                                <table class="table slider-table">
                                    <tr>
                                        <td nowrap>Magnitud</td>
                                        <td class="w-100"><div id="b_mag_slider"></div></td>
                                        <td><input id="b_mag_label" type="text" class="input-80 form-control form-control-sm text-center" readonly></td>
                                    </tr>
                                    <tr>
                                        <td nowrap>Ángulo</td>
                                        <td class="w-100"><div id="b_ang_slider"></div></td>
                                        <td><input id="b_ang_label" type="text" class="input-80 form-control form-control-sm text-center" readonly></td>
                                    </tr>
                                </table>
                            </div>
                        </div> <!-- end .row- -->
                        <div class="row">
                            <div class="col">
                                <h4>Calcular</h4>
                            </div>
                        </div> <!-- end .row- -->
                        <div class="row">
                            <div class="col-8">
                                <div class="btn-group btn-block btn-group-toggle" data-toggle="buttons">
                                    <label class="btn btn-sm w-100 btn-outline-primary active">
                                        <input type="radio" name="options" value="option1" autocomplete="off" checked> A + B
                                    </label>
                                    <label class="btn btn-sm w-100 btn-outline-primary">
                                        <input type="radio" name="options" value="option2" autocomplete="off"> A - B
                                    </label>
                                    <label class="btn btn-sm w-100 btn-outline-primary">
                                        <input type="radio" name="options" value="option3" autocomplete="off"> B - A
                                    </label>
                                    <label class="btn btn-sm w-100 btn-outline-primary">
                                        <input type="radio" name="options" value="option4" autocomplete="off"> A &middot; B
                                    </label>
                                </div>
                            </div>
                            <div class="col-4">
                                <button type="button" id="calculate" class="btn btn-sm btn-success btn-block">
                                    <i data-feather="play"></i>
                                    <span>Calcular</span>
                                </button>
                            </div>
                        </div> <!-- end .row- -->
                    </div>
                    <div class="col-lg-7 mt-5 mt-lg-0" id="canvasContainer"></div>
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <span class="text-muted">Última Actualización <?php echo $active_sim['date']; ?> | Copyright &copy; 2014 - <?php echo date("Y") ?> Departamento de Física y Matemáticas | <a class="text-muted" href="http://www.udem.edu.mx">Universidad de Monterrey</a></span>
        </div>
    </footer>

    <script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="../../js/popper.min.js"></script>
    <script src="../../js/bootstrap.min.js"></script>
    <script src="../../js/footer-fix.js"></script>
    <script src="../../js/nouislider.min.js"></script>
    <script src="../../js/feather.min.js"></script>
    <script src="../../js/core/dist/app.bundle.js"></script>
    <script src="main.js"></script>
    <script>
        feather.replace()
    </script>
    
</body>
</html>