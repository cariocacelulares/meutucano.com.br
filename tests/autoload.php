<?php

passthru("php artisan migrate --database=tests --quiet");
require __DIR__ . '/../vendor/autoload.php';

\VCR\VCR::turnOn();
\VCR\VCR::turnOff();
