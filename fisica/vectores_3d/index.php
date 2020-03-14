<?php
    require '../../php/lang.php';
    require '../../php/data.php';
    $active         = $nav_items['physics'];
    $active_sim     = $active['sim']['vectores_3d'];
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
    <link href="../../css/index.css" rel="stylesheet">
    <link href="../../css/index3d.css" rel="stylesheet">
    <style>
        .btn {
            background-color: #FAFAFA;
        }
        #controls-div {
            left: 1em;
            top: 1rem;
        }
        #input-div {
            top: 5em;
            left: 1em;
        }
        .form-control {
            width: 100px !important;
        }
        .form-check {
            margin-left: 0.25rem;
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
            <section id="sim">
                <div id="camera-controls-div" class="controls">
                    <div>
                        <button type="button" id="rotate-btn" class="btn mb-2 btn-outline-secondary">
                            <div id="rotate-btn-1"><i data-feather="video"></i></div>
                            <div id="rotate-btn-0"><i data-feather="video-off"></i></div>
                        </button>
                        <button type="button" id="zoom-in-btn" class="btn mb-2 btn-outline-secondary">
                            <i data-feather="zoom-in"></i>
                        </button>
                        <button type="button" id="zoom-out-btn" class="btn mb-2 btn-outline-secondary">
                            <i data-feather="zoom-out"></i>
                        </button>
                        <button type="button" id="fullscreen-btn" class="btn btn-outline-secondary">
                            <div id="fullscreen-btn-1"><i data-feather="minimize-2"></i></div>
                            <div id="fullscreen-btn-0"><i data-feather="maximize-2"></i></div>
                        </button>
                    </div>
                </div>
                <div id="input-div" class="controls controls-panel d-none">
                    <h5 class="mb-2">Vector <span id="vector-label">A</span></h5>
                    <div class="input-group input-group-sm mb-1">
                        <div class="input-group-prepend">
                            <span class="input-group-text serif"><i>x</i></span>
                        </div>
                        <input type="text" class="form-control" id="x">
                    </div>
                    <div class="input-group input-group-sm mb-1">
                        <div class="input-group-prepend">
                            <span class="input-group-text serif">y</span>
                        </div>
                        <input type="text" class="form-control" id="y">
                    </div>
                    <div class="input-group input-group-sm mb-2">
                        <div class="input-group-prepend">
                            <span class="input-group-text serif">z</span>
                        </div>
                        <input type="text" class="form-control" id="z">
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="components">
                        <label class="form-check-label" for="components">Componentes</label>
                    </div>
                </div>
                <div id="controls-div" class="controls controls-panel">
                    <div class="btn-group" id="operation" role="group">
                        <button type="button" id="none" class="px-2 active btn btn-sm btn-outline-secondary">
                            <i id="rotate-btn-0" data-feather="minus"></i> 
                        </button>
                        <button type="button" id="a+b" class="px-2 btn btn-sm btn-outline-secondary">A + B</button>
                        <button type="button" id="a-b" class="px-2 btn btn-sm btn-outline-secondary">A - B</button>
                        <button type="button" id="b-a" class="px-2 btn btn-sm btn-outline-secondary">B - A</button>
                        <button type="button" id="axb" class="px-2 btn btn-sm btn-outline-secondary">A x B</button>
                    </div>
                </div>
                <div class="row" style="z-index: 2">
                    <div class="col">
                        <canvas id="main-canvas"></canvas>
                    </div>
                </div>
                <div class="row" style="z-index: 1">
                    <div class="col align-self-center text-center">
                        <div>Cargando...</div>
                    </div>
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
    <script src="../../js/feather.min.js"></script>
    <script src="main.js"></script>
    <script>
        feather.replace()
    </script>
    
</body>
</html>
