<?php
    require '../../php/lang.php';
    require '../../php/data.php';
    $active         = $nav_items['statistics'];
    $active_sim     = $active['sim']['visualizacion_datos'];
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
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
        }
        input[type="number"] {
            -moz-appearance: textfield;
        }
        .w-1 {
            width: 1% !important;
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
                    <div class="col-lg-5 controls">
                        <div class="row">
                            <div class="col clearfix">
                                <h4 class="float-left">Controles</h4>
                            </div>
                        </div> <!-- end .row- -->
                        <div class="row">
                            <div class="col">
                                <div class="alert alert-danger d-none" id="range-warning" role="alert"></div>
                                <table class="table slider-table">
                                    <tr>
                                        <td class="w-1" nowrap>Tipo</td>
                                        <td colspan="3" class="w-100">
                                            <select class="form-control form-control-sm" id="graphType" name="graphType" required>
                                                <option value="line">Línea</option>
                                                <option selected value="scatter">Dispersión</option>
                                                <option value="histogram">Histograma</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="w-1" nowrap>Eje X</td>
                                        <td colspan="3" class="w-100">
                                            <div class="btn-group btn-block btn-group-toggle" data-toggle="buttons">
                                                <label class="btn btn-sm w-100 btn-outline-primary active">
                                                    <input type="radio" name="xAxis" value="0" autocomplete="off" checked> Var 1
                                                </label>
                                                <label class="btn btn-sm w-100 btn-outline-primary">
                                                    <input type="radio" name="xAxis" value="1" autocomplete="off"> Var 2
                                                </label>
                                                <label class="btn btn-sm w-100 btn-outline-primary">
                                                    <input type="radio" name="xAxis" value="2" autocomplete="off"> Var 3
                                                </label>
                                                <label class="btn btn-sm w-100 btn-outline-primary">
                                                    <input type="radio" name="xAxis" value="3" autocomplete="off"> Var 4
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="y-axis">
                                        <td class="w-1" nowrap>Eje Y</td>
                                        <td colspan="3" class="w-100">
                                            <div class="btn-group btn-block btn-group-toggle" data-toggle="buttons">
                                                <label class="btn btn-sm w-100 btn-outline-primary">
                                                    <input type="radio" name="yAxis" value="0" autocomplete="off"> Var 1
                                                </label>
                                                <label class="btn btn-sm w-100 btn-outline-primary active">
                                                    <input type="radio" name="yAxis" value="1" autocomplete="off" checked> Var 2
                                                </label>
                                                <label class="btn btn-sm w-100 btn-outline-primary">
                                                    <input type="radio" name="yAxis" value="2" autocomplete="off"> Var 3
                                                </label>
                                                <label class="btn btn-sm w-100 btn-outline-primary">
                                                    <input type="radio" name="yAxis" value="3" autocomplete="off"> Var 4
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr id="bins" class="d-none">
                                        <td class="w-1" id="bins-label" nowrap>Cajas</td>
                                        <td colspan="2" class="w-100"><div id="bins_slider"></div></td>
                                        <td class="w-1"><input id="bins_label" type="text" class="input-80 form-control form-control-sm text-center" readonly></td>
                                    </tr>
                                </table>
                                <table class="table slider-table">
                                    <tr id="range" class="d-none">
                                        <td id="min-label" nowrap>Min</td>
                                        <td><input type="number" step="0.001" id="min" class="range form-control-sm form-control" placeholder="0"></td>
                                        <td class="w-1" nowrap>Max</td>
                                        <td><input type="number" step="0.001" id="max" class="range form-control-sm form-control" placeholder="0"></td>
                                    </tr>
                                </table>
                            </div>
                        </div> <!-- end .row- -->
                        <div class="row">
                            <div class="col clearfix">
                                <h4 class="float-left">Datos</h4>
                                <form class="form-inline float-right">
                                    <label id="filename" class="text-secondary"></label>
                                    <label id="fileBrowser" class="ml-3 d-none btn btn-sm btn-primary">
                                        <i data-feather="upload"></i>
                                        <span>Subir CSV</span>
                                        <input type="file" name="files[]" accept=".csv" id="files" hidden>
                                    </label>
                                </form>
                            </div>
                        </div> <!-- end .row- -->
                        <table class="table text-center data-table" id="varTable">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        <span class="d-none d-sm-block">Var 1</span>
                                        <span class="d-block d-sm-none">Var 1</span>
                                    </th>
                                    <th>
                                        <span class="d-none d-sm-block">Var 2</span>
                                        <span class="d-block d-sm-none">Var 2</span>
                                    </th>
                                    <th>
                                        <span class="d-none d-sm-block">Var 3</span>
                                        <span class="d-block d-sm-none">Var 3</span>
                                    </th>
                                    <th>
                                        <span class="d-none d-sm-block">Var 4</span>
                                        <span class="d-block d-sm-none">Var 4</span>
                                    </th>
                                    <th><i data-feather="settings"></i></span></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="font-weight-bold text-secondary">1</td>
                                    <td><input type="number" step="0.001" class="var var-1 form-control-sm form-control" placeholder="0"></td>
                                    <td><input type="number" step="0.001" class="var var-2 form-control-sm form-control" placeholder="0"></td>
                                    <td><input type="number" step="0.001" class="var var-3 form-control-sm form-control" placeholder="0"></td>
                                    <td><input type="number" step="0.001" class="var var-4 form-control-sm form-control" placeholder="0"></td>
                                    <td>
                                        <button type="button" id="add" class="btn btn-sm btn-success btn-block">
                                            <i data-feather="plus"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>                        
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
    <script src="../../js/jquery.csv.min.js"></script>
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
