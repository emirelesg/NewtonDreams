<?php
    require '../../php/lang.php';
    require '../../php/data.php';
    $active         = $nav_items['physics'];
    $active_sim     = $active['sim']['calculadora_vectores'];
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
    <style>
        .feather {
            width: 16px;
            height: 16px;
        }
        .btn-sm svg {
            width: 16px;
            height: 16px;
        }
        .data-table td {
            border: 0px;
            padding: 0.5rem 0.5rem 0.5rem 0.5rem;
            vertical-align: middle;
        }
        @media (max-width: 576px) {
            .data-table td {
                padding: 0.5rem 0.25rem 0.5rem 0.25rem;
            }
        }
    </style>
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
                    <div class="col-lg-6 controls">
                        <div class="row">
                            <div class="col">
                                <table class="table text-center data-table" id="vectorTable">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>|V|</th>
                                            <th><span class="d-none d-sm-block">Áng (°)</span><span class="d-block d-sm-none">Áng</span></th>
                                            <th>X</th>
                                            <th>Y</th>
                                            <th><i data-feather="eye"></i></span></th>
                                            <th><i data-feather="settings"></i></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="font-weight-bold" style="color: #F44336">A</td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0"></td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0"></td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0"></td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0"></td>
                                            <td>
                                                <button type="button" class="btn btn-sm toggleComponents btn-block">
                                                    <i data-feather="eye" class="d-none"></i>
                                                    <i data-feather="eye-off"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button type="button" id="addVector" class="btn btn-sm btn-success btn-block">
                                                    <i data-feather="plus"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="font-weight-bold" style="color: #607D8B;">=</td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0" readonly></td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0" readonly></td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0" readonly></td>
                                            <td><input type="text" class="form-control-sm form-control" placeholder="0" readonly></td>
                                            <td>
                                                <button type="button" class="btn btn-sm toggleComponents btn-block">
                                                    <i data-feather="eye" class="d-none"></i>
                                                    <i data-feather="eye-off"></i>
                                                </button>
                                            </td>
                                            <td>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> <!-- end .row- -->
                    </div>
                    <div class="col-lg-6 mt-5 mt-lg-0" id="canvasContainer"></div>
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
