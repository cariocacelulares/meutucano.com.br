<?php

use Bootstrap\MongoFormatter;

try {
    $mongoClient = false;

    if (class_exists(\MongoClient::class)) {
        $mongoClient = '\MongoClient';
    } else if (class_exists(\Mongo::class)) {
        $mongoClient = '\Mongo';
    } else if (class_exists(\MongoDB\Client::class)) {
        $mongoClient = '\MongoDB\Client';
    }

    if ($mongoClient) {
        $db = env('MONGODB_DATABASE', 'meutucano');

        $mongoClient = new $mongoClient('mongodb://' . env('MONGODB_HOST', 'localhost') . ':' . env('MONGODB_PORT', 27017));
        $mongoClient->$db->logs->findOne();

        $app->configureMonologUsing(function($monolog) use ($mongoClient, $db) {
            $mongoHandler = new Monolog\Handler\MongoDBHandler(
                $mongoClient,
                $db,
                'logs'
            );

            $mongoHandler->setFormatter(
                new MongoFormatter(
                    'America/Sao_Paulo',
                    'Y-m-d H:i:s'
                )
            );

            $monolog->pushHandler($mongoHandler);

            $monolog->pushProcessor(new Monolog\Processor\WebProcessor($_SERVER));
            $monolog->pushProcessor(function ($record) {
                if (auth()->check()) {
                    $jwtAuth = Tymon\JWTAuth\Facades\JWTAuth::parseToken()->authenticate();
                    $record['extra']['user_id'] = $jwtAuth->id;
                    $record['extra']['email'] = $jwtAuth->email;
                    $record['extra']['username'] = $jwtAuth->username;
                }

                if (isset($_SERVER['REMOTE_ADDR'])) {
                    $record['extra']['user_ip'] = $_SERVER['REMOTE_ADDR'];
                }

                return $record;
            });
        });
    }
} catch (\Exception $e) {
    // Não é possível utilizar Log:: para registrar o erro,
    // pois o app ainda nao iniciou
}