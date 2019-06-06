<?php
    require '../php/lang.php';
    require '../php/data.php';
    $active = $nav_items['divyx'];
?>
<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="Universidad de Monterrey">
    <link rel="icon" href="../favicon.ico">
    <title><?php echo $active['name']; ?> - NewtonDreams</title>
    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/index.css" rel="stylesheet">
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

        .text-green {
            color: #00B688;
        }

        a {
            color: #008664;
        }

        a:hover {
            text-decoration: none;
            color: #00B688;
        }

        .bg-green {
            background-color: #00B688;
        }

        #downloadForm {
            border: 1px solid #DDDDDD;
            background-color: #F5F5F5;
            padding: 1.5rem;
        }

        #downloadForm button {
            background-color: #00B688;
            border-color: #00B688;
        }

        #downloadForm button:hover {
            background-color: #008664;
        }

        #download > img {
            max-width: 200px;
            width: 100%;
        }

    </style>
</head>

<body>
   
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="<?php echo $nav_items['home']['url'] ?>">NewtonDreams</a>
            <a class="navbar-brand" href="http://www.udem.edu.mx">
                <img src="../img/logo_y.jpg" alt="Universidad de Monterrey">
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav ml-auto">
                    <?php require '../php/menu.php'; ?>
                </ul>
            </div>
        </div>
    </nav>

    <main role="main">        
        <div class="jumbotron bg-green">
            <div class="container text-light">
                <h1 class="display-5 d-sm-none">DivYX</h1>
                <h1 class="display-4 d-none d-sm-block">DivYX</h1>
                <p class="lead">Software de análisis cinemático de videos en formato digital.</p>
                <div>
                    <a class="btn btn-secondary mt-3 mr-3" href="app/" role="button" aria-disabled="true">
                        <i data-feather="globe"></i>
                        <span>Versión Web (<?php echo $divyx['app']['ver']; ?>)</span>
                    </a>
                    <a class="btn btn-secondary mt-3" href="#download" role="button" aria-disabled="true">
                        <i data-feather="download"></i>
                        <span>Descargar (<?php echo $divyx_versions[0]['ver']; ?>)</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="container">

            <section>
                <div class="row section-title">
                    <div class="col">
                        <h2>¿Qué es DivYX?</h2>        
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <p>DivYX permite obtener la función de posición dependiente del tiempo de algún fenómeno relacionado con la cinemática a partir de un video. Con DivYX es posible elegir algún objeto y obtener sus coordenadas de posición.</p>
                        <p>DivYX fue creado en el Departamento de Física Y Matemáticas de la Universidad de Monterrey en el año 2005 y desde entonces se ha estado utilizando en diversas universidades alrededor del mundo. Gracias al apoyo obtenido del Fondo SEI 2016 de la Universidad de Monterrey se ha logrado actualizar la aplicación a su versión multiplataforma web.</p>
                    </div>
                    <div class="col-md-6">
                        <img src="../img/divyx3_screen_cropped2.jpg" alt="Captura de pantalla de DivYX 3." class="img-fluid">
                    </div>
                </div>
            </section>

            <section>
                <div class="row">
                    <div class="col-sm-6 col-lg-3 mb-4 mb-lg-0">
                        <span class="feature-icon text-green">
                            <i data-feather="user-plus"></i>
                        </span>
                        <div class="feature-description">
                            <h6>Aprendizaje</h6>
                            <p class="text-muted">Crea un ambiente de aprendizaje en donde los alumnos se sienten comprometidos con su aprendizaje.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3 mb-4 mb-lg-0">
                        <span class="feature-icon text-green">
                            <i data-feather="edit-3"></i>
                        </span>    
                        <div class="feature-description">
                            <h6>Independencia</h6>
                            <p class="text-muted">Permite a los alumnos resolver sus propios problemas y no solamente las situaciones planteadas por el profesor.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <span class="feature-icon text-green">
                            <i data-feather="book"></i>
                        </span>
                        <div class="feature-description">
                            <h6>Resultados</h6>
                            <p class="text-muted">Permite obtener resultados que pueden ser contrastados con el marco teórico visto en el curso.</p>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <span class="feature-icon text-green">
                            <i data-feather="trending-up"></i>
                        </span>
                        <div class="feature-description">
                            <h6>Herramienta Efectiva</h6>
                            <p class="text-muted">Proporciona una herramienta cognitiva que permite resolver de manera rápida y efectiva las cuestiones planteadas.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="download">
                <div class="row section-title">
                    <div class="col">
                        <h2>Descargar</h2>        
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-6 mb-4 mb-md-0">
                        <div class="alert alert-warning" role="alert">
                            DivYX 2 y 1 no se encuentran en desarrollo activo. La versión Web es la más actualizada.
                        </div>
                        <ul>
                            <li>Para <strong>Windows 7</strong> en adelante se requiere la última versión (<?php echo $divyx_versions[0]['ver']; ?>).</li>
                            <li>La versión para <strong>Windows 7</strong> no tiene instalador, solo es necesario abrir el archivo ejecutable.</li>
                            <li>Para <strong>Windows XP</strong> se require DivYX 1.
                            <li>DivYX 2 requiere de <a href="https://www.microsoft.com/download/details.aspx?id=17851" target="_blank">Net Framework 4.0</a>.</li>
                            <li>Archivos soportados por DivYX: *.avi, *.mpg y *.mpeg.</li>
                        </ul>
                        <div class="pr-0 pl-0 pr-lg-4 pl-lg-4">
                            <img src="../img/divyx_screen.jpg" alt="Captura de pantalla de DivYX 2.1" class="mt-3 img-fluid">
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="alert alert-danger d-none" id="fail" role="alert"></div>
                        <div class="alert alert-success d-none" id="success" role="alert"></div>
                        <form id="downloadForm" action="" method="post">
                            <div class="form-group">
                                <label for="name">Nombre completo:</label>
                                <input type="text" class="form-control" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Correo:</label>
                                <input type="text" class="form-control" id="email" name="email" required>
                                <small class="form-text text-muted">Nunca compartiremos tu información con alguién más.</small>
                            </div>
                            <div class="form-group">
                                <label for="use">Usaré DivYX como:</label>
                                <select class="form-control" id="use" name="use" required>
                                    <option value="" disabled selected>Por favor selecione</option>
                                    <option value="1">Científico</option>
                                    <option value="2">Estudiante - Asistente de Investigación / Doctorando</option>
                                    <option value="3">Estudiante - Universitario / otro</option>
                                    <option value="4">Ingeniero</option>
                                    <option value="5">Líder de Proyecto</option>
                                    <option value="6">Profesor / Instructor</option>
                                    <option value="7">Técnico</option>
                                    <option value="8">Otro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="organization">Universidad / Empresa:</label>
                                <input type="text" class="form-control" id="organization" name="organization" required>
                            </div>
                            <div class="form-group">
                                <label for="version">Versión:</label>
                                <select class="form-control" id="version" name="version" required>
                                    <?php
                                        $i = 0;
                                        foreach($divyx_versions as $ver) {
                                            if ($i == 0) {
                                                echo '<option value="' . $i . '" selected>' . $ver['name'] . '</option>';
                                            } else {
                                                echo '<option value="' . $i . '">' . $ver['name'] . '</option>';
                                            }
                                            $i += 1;
                                        }
                                    ?>
                                </select>
                            </div>
                            <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="accept" required checked>
                                <label class="form-check-label" for="accept">Acepto los <a href="descargas/terminos_y_condiciones.pdf">términos y condiciones</a> de DivYX</label>
                            </div>
                            <button type="submit" id="submit" class="btn btn-secondary btn-block">
                                <i data-feather="download"></i>
                                <span>Descargar</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section>
                <div class="row section-title">
                    <div class="col">
                        <h2>Ponencias, Artículos y Tutoriales</h2>        
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <p>DivYX ha aparecido en varios artículos y ha sido referenciado en varias ponencias en diferentes congresos nacionales e Internacionales.</p>
                        <b>Ponencias</b>
                        <ul>
                            <li><a href="descargas/Ponencias_HGF.pdf" target="_blank">Ponencias recientes</a> (16.7 MB)</li>
                            <li><a href="descargas/GIREP-MPTL 2014 Conference Proceedings.pdf" target="_blank">Ponencias del 2014 relacionadas con el uso de simulaciones</a> (pag. 533) (55.6 MB)</li>
                            <li><a href="descargas/LASERA_2015_Submission_79.pdf" target="_blank">Ponencias del 2015 relacionadas con el uso de simulaciones</a> (1.6 MB)</li>
                            <li><a href="descargas/Caracterización de DivYX 2, software de análisis.pdf" target="_blank">Ponencias del 2016 relacionadas con el uso de DivYX 2</a> (524 KB)</li>
                            <li><a href="descargas/DivYX_en_la_Web.ppsx" target="_blank">Ponencias del 2017 Relacionadas con la liberación de DivYX 3, completamente en la Web</a> (43 MB)</li>
                        </ul>
                        <b>Artículos</b>
                        <ul>
                            <li><a href="descargas/Validacion_de_DivYX.pdf" target="_blank">Validación de DivYX</a> (176 KB)</li>
                            <li><a href="descargas/DivYX_Viscosidad.pdf" target="_blank">DivYX y la viscosidad</a> (163 KB)</li>
                            <li><a href="descargas/Multiplataforma.pdf" target="_blank">Simulaciones Físicas Multiplataforma</a> (686 KB)</li>
                            <li><a href="descargas/DivYX_3.0.pdf" target="_blank">DivYX 3.0 Análisis de Vídeos Digitales en la Web</a> (1.83 MB)</li>
                        </ul>
                        <b>Tutoriales</b>
                        <ul>
                            <li><a href="https://www.youtube.com/watch?v=GaHu8vJY36M" target="_blank">Video Tutorial de DivYX 2.2</a></li>
                            <li><a href="https://youtu.be/iqHiqtnJnmk" target="_blank">Video Tutorial de DivYX 3.0</a></li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- <section>
                <div class="row section-title">
                    <div class="col-12">
                        <h2>Contacto</h2> 
                    </div>
                    <div class="col-12 mt-4">
                        <p>
                            Para mayor información favor de contactar a Héctor A. González Flores (<a href="mailto:hector.gonzalezf@udem.edu">hector.gonzalezf@udem.edu</a>), profesor asociado del Departamento de Física y Matemáticas de la <a href="http://www.udem.edu.mx">Universidad de Monterrey</a>. Esta actualización fue apoyada por el Fondo SEI 2016 de la <a href="http://www.udem.edu.mx">Universidad de Monterrey.</a>
                        </p>
                    </div>
                </div>
            </section> -->

            <section>
                <div class="row">
                    <div class="col">
                        <script type="text/javascript" id="clustrmaps" src="//cdn.clustrmaps.com/map_v2.js?cl=ffffff&w=342&t=tt&d=Zs8AhGwyCJkELzy93BB4_Kr2Kia_PBwHK1FAuN4cySI"></script>
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
    <script src="../js/popper.min.js"></script>
    <script src="../js/feather.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <script src="../js/footer-fix.js"></script>
    <script>
        feather.replace()

        $(function() {

            var download_time_counter = 0;      // Seconds to wait before redirecting the user for downlaod.

            /**
             * Controls if the download form is enabled or not.
             */
            function disableForm(status) {
                var submitButtonLabel = $("#submit span"); 
                if (status) {
                    submitButtonLabel.html("Enviando solicitud...");
                } else {
                    submitButtonLabel.html("Descargar");
                }
                $("#downloadForm input").prop("disabled", status);
                $("#downloadForm select").prop("disabled", status);
                $("#downloadForm button").prop("disabled", status);
            }
            
            /**
             * Controls the messages show to the user after submitting the request.
             */
            function showMessage(message, good) {

                // Get object ids.
                var failDiv = $("#fail");
                var successDiv = $("#success");

                // Show div with message.
                if (good) {
                    successDiv.html(message);
                    successDiv.removeClass("d-none");
                    failDiv.addClass("d-none");
                } else {
                    failDiv.html(message);
                    failDiv.removeClass("d-none");
                    successDiv.addClass("d-none");
                }

            }

            /**
             * Redirects the user to the download page after x amount of seconds.
             */
            function startDownloadSequence() {

                // Get the time counter span item.
                $("#downloadTime").html(download_time_counter);

                // If the counter has reached 0 redirect the user to the download.
                // It not, continue counting down.
                if (download_time_counter == 0) {
                    window.location = "download.php";
                } else {
                    download_time_counter -= 1;
                    setTimeout(startDownloadSequence, 1000);
                }

            }

            /**
             * When the download form is submitted.
             */
            $('form').submit(function(e) {

                // Disable items while form is submitted.
                disableForm(true);

                // Prevent the website from refreshing.
                e.preventDefault();
                
                // Format data to send to server.
                var data = {
                    "name":         $("#name").val(),
                    "email":        $("#email").val(),
                    "use":          $("#use option:selected").text(),
                    "organization": $("#organization").val(),
                    "version":      parseInt($("#version option:selected").val())
                };

                // Perform ajax request to server.
                $.ajax({
                    data:       data,
                    type:       "POST",
                    dataType:   "json",
                    url:        "downloadRequest.php"
                }).done(function(data, textStatus, jqXHR) {

                    // Reenable form.
                    disableForm(false);

                    // Check if download was successfull.
                    if (data["success"]) {

                        // Clear form and re-enable it.
                        $('form')[0].reset();
                        download_time_counter = 3;
                        var message = "Gracias por utilizar DivYX. La descarga comenzará en <b><span id=\"downloadTime\">" + download_time_counter + "</span></b>...";
                        message += "<br>En caso de la descarga no comience, utilice el siguiente <a href=\"download.php\" target=\"_blank\">link</a>.";
                        showMessage(message, true);
                        startDownloadSequence();

                    } else {

                        showMessage("La solicitud ha fallado, intenta nuevamente.", false);

                    }

                }).fail(function(data, textStatus, jqXHR) {
                    
                    // Show fail message an reenable form.
                    disableForm(false);
                    showMessage("Lo sentimos, la solicitud no puede ser procesada por el momento.", false);

                });

            });

        });
    </script>

</body>
</html>
