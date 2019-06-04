<?php
    require '../../php/lang.php';
    require '../../php/data.php';
    $active         = $nav_items['divyx'];
    $active_sim     = $active['sim']['app'];
?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Universidad de Monterrey">
    <link rel="icon" href="../../favicon.ico">
    <title><?php echo $active_sim['name']; ?> - NewtonDreams</title>
    <link href="../../css/bootstrap.min.css" rel="stylesheet">
    <link href="../../css/nouislider.css" rel="stylesheet">
    <link href="../../css/index.css" rel="stylesheet">
    <style>

        .controls button:not(:last-child), .controls label {
            margin-right: 0.5rem;
        }

        #video {
            display: none;
        }

        #bottomCanvas {
            z-index: 1;
            border: 0px;
            position: absolute;
            background-color: black;
            background: black;
        }

        #middleCanvas {
            z-index: 2;
            border: 0px;
            position: absolute;
        }

        #topCanvas {
            z-index: 2;
            border: 0px;
            cursor: default;
            position: absolute;
        }

        #topControls {
            margin-bottom: 2rem;
        }

        #bottomControls {
            text-align: center;
            margin-top: 2rem;
        }

        #dataContainer {
            border: 1px solid #DDDDDD;
            padding-right: 0;
            padding-left: 0;
        }

        #tableExportContainer {
            padding: 1.3rem 1rem 1rem 1rem;
            background-color: #F5F5F5;
            vertical-align: middle;
        }
        
        #tableContainer {
            text-align: center;
            border-top: 1px solid #DDDDDD;
            height: auto;
            overflow-y: auto;
        }

        #dataTableBody > tr > td {
            vertical-align: middle;
        }

        .container {
            margin: 0 auto;
            width: 1140px;
            max-width: none !important;
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
                <div class="row d-lg-none mb-3">
                    <div class="col">
                        <div class="alert alert-warning" role="alert">
                            Please increase your screen resolution to view the application properly.
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="topControls" class="col controls clearfix">
                        <form class="form-inline">
                            <label class="btn btn-sm btn-primary">
                                <i data-feather="file"></i>
                                <span>Browse</span>
                                <input type="file" id="import" accept="video/mp4" style="display: none;">
                            </label>
                            <button type="button" id="set_axis" class="btn btn-sm btn-primary">
                                <i data-feather="crosshair"></i>
                                <span>Set Axis</span>
                            </button>
                            <button type="button" id="set_ruler" class="btn btn-sm btn-primary">
                                <i data-feather="maximize-2"></i>
                                <span>Set Ruler</span>
                            </button>
                            <button type="button" id="add_marker" class="btn btn-sm btn-success">
                                <i data-feather="plus"></i>
                                <span>Add Marker</span>
                            </button>
                            <button type="button" id="delete_marker" class="btn btn-sm btn-danger">
                                <i data-feather="x"></i>
                                <span>Delete Marker</span>
                            </button>
                            <button type="button" id="set_fps" class="btn btn-sm btn-outline-secondary">
                                <i data-feather="film"></i>
                                <span>Set FPS</span>
                            </button>
                            <button type="button" id="zoom" class="btn btn-sm btn-outline-secondary">
                                <i data-feather="search"></i>
                                <span>Zoom On</span>
                            </button>
                            <button type="button" id="clear" class="btn btn-sm btn-danger ml-auto">
                                <i data-feather="trash-2"></i>
                                <span>Clear</span>
                            </button>
                        </form>
                    </div> 
                </div>
                <div class="row">
                    <div class="col-sm-8" id="canvasContainer">
                        <video id="video">
                            <source type="video/mp4" src="" muted preload="auto"></source>
                        </video>
                        <canvas id="bottomCanvas" width="0" height="0"></canvas>
                        <canvas id="middleCanvas" width="0" height="0"></canvas>
                        <canvas id="topCanvas" width="0" height="0"></canvas>
                    </div>
                    <div class="col-sm-4" id="dataContainer">
                        <div id="tableExportContainer" class="clearfix">
                            <h4 class="float-left">DivYX Data</h4>
                            <a id="export" class="btn btn-outline-success btn-sm float-right" href="#" role="button" aria-disabled="true">
                                <i data-feather="download"></i>
                                <span>Export</span>
                            </a>
                        </div>
                        <div id="tableContainer">
                            <table id="dataTable" class="table table-striped table-hover">
                                <thead id="dataTableHead">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">t</th>
                                        <th scope="col">X</th>
                                        <th scope="col">Y</th>
                                    </tr>
                                </thead>
                                <tbody id="dataTableBody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div id="bottomControls" class="col-sm-8 controls">
                        <button type="button" id="backward" class="btn btn-sm btn-outline-secondary">
                            <i data-feather="skip-back"></i>
                            <span></span>
                        </button>
                        <button type="button" id="play" class="btn btn-sm btn-outline-secondary">
                            <i data-feather="play"></i>
                            <span></span>
                        </button>
                        <button type="button" id="pause" class="btn btn-sm btn-outline-secondary">
                            <i data-feather="pause"></i>
                            <span></span>
                        </button>
                        <button type="button" id="forward" class="btn btn-sm btn-outline-secondary">
                            <i data-feather="skip-forward"></i>
                            <span></span>
                        </button>
                        <button type="button" id="mute" class="btn btn-sm btn-outline-secondary">
                            <i id="volume-x" data-feather="volume-x"></i>
                            <i id="volume" data-feather="volume" class="d-none"></i>
                            <span></span>
                        </button>
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
    <script src="../../js/footer-fix.js"></script>
    <script src="../../js/nouislider.min.js"></script>
    <script src="../../js/feather.min.js"></script>
    <script src="../../js/jquery.scrollintoview.min.js"></script>
    <script src="js/Globals.js"></script>
    <script src="js/Video.js"></script>
    <script src="js/Button.js"></script>
    <script src="js/Axis.js"></script>
    <script src="js/Ruler.js"></script>
    <script src="js/Timeline.js"></script>
    <script src="js/Markers.js"></script>
    <script src="js/Table.js"></script>
    <script src="js/main.js"></script>
    <script>
        feather.replace()
    </script>
    
</body>
</html>
