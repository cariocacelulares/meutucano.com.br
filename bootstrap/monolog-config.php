<?php

use Bootstrap\MongoFormatter;

try {
    $mongoClient = false;

    // Try to get any mongo client
    if (class_exists(\MongoClient::class)) {
        $mongoClient = '\MongoClient';
    } else if (class_exists(\Mongo::class)) {
        $mongoClient = '\Mongo';
    } else if (class_exists(\MongoDB\Client::class)) {
        $mongoClient = '\MongoDB\Client';
    }

    // If found
    if ($mongoClient) {
        $db = env('MONGODB_DATABASE', 'meutucano');
        $mongoClient = new $mongoClient('mongodb://' . env('MONGODB_HOST', 'localhost') . ':' . env('MONGODB_PORT', 27017));

        // Check if exists, if not an exception will be thrown
        $mongoClient->$db->logs->findOne();

        // Finnaly set MongoDBHandler instead of file
        $app->configureMonologUsing(function($monolog) use ($mongoClient, $db) {
            $mongoHandler = new Monolog\Handler\MongoDBHandler($mongoClient, $db, 'logs');
            $mongoHandler->setFormatter(new MongoFormatter('America/Sao_Paulo', 'Y-m-d H:i:s'));
            $monolog->pushHandler($mongoHandler);

            // Extra fields
            $monolog->pushProcessor(new Monolog\Processor\GitProcessor());
            $monolog->pushProcessor(new Monolog\Processor\WebProcessor());
            $monolog->pushProcessor(function ($record) {
                if (Tymon\JWTAuth\Facades\JWTAuth::getToken()) {
                    $jwtAuth = Tymon\JWTAuth\Facades\JWTAuth::parseToken()->authenticate();
                    $record['extra']['user_id'] = $jwtAuth->id;
                    $record['extra']['email'] = $jwtAuth->email;
                    $record['extra']['username'] = $jwtAuth->username;
                }

                return $record;
            });
        });
    }
} catch (\Exception $e) {
    // Cannot use Log:: here
    // If an exception has been thrown, laravel will use default logger (file)
}