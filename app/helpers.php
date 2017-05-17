<?php

include_once 'Helpers/Date.php';
include_once 'Helpers/Formatters.php';
include_once 'Helpers/ApiResponse.php';
include_once 'Helpers/Integrations.php';

/**
 * Retorna a mensagem de log formatada
 *
 * @param $data
 * @return int
 */
function logMessage($exception, $message = 'Erro')
{
    return sprintf("%s
        Arquivo: %s
        Linha: %s
        Mensagem: %s
        ------------------------
        %s
    ",
        $message,
        $exception ? $exception->getFile() : '',
        $exception ? $exception->getLine() : '',
        $exception ? $exception->getMessage() : '',
        htmlentities($exception->getTraceAsString())
    );
}

/**
 * Envia um e-mail informando o erro para o desenvolvedor
 *
 * @param  string $error a mensagem completa de erro
 * @return void
 */
function reportError($error)
{
    if (getenv('APP_ENV') !== 'testing') {
        \Mail::send('emails.error', [
            'error' => $error
        ], function ($m) {
            $m->from(\Config('core.report_email'), 'Meu Tucano');
            $m->to(\Config('core.report_email'), 'DEV')->subject('Erro no sistema!');
        });
    }
}

/**
 * Retorna o id do usuário logado
 *
 * @return int
 */
function getCurrentUserId()
{
    try {
        return Tymon\JWTAuth\Facades\JWTAuth::parseToken()->authenticate()->id;
    } catch (\Exception $e) {
    }

    return null;
}

/**
 * Check if module is active based in your config file
 *
 * @param  string  $module nome do modulo
 * @return boolean         if module is active
 */
function hasModule($module)
{
    return !is_null(\Config::get(str_slug($module)));
}

/**
 * Create API routes except create and edit
 *
 * @param  string $url
 * @param  string $controller
 * @return void
 */
function api($url, $controller, $except = [])
{
    \Route::resource($url, $controller, ['except' =>
        array_merge(['create', 'edit'], $except)
    ]);
}

/**
 * Return URL for files
 *
 * @param  string $path
 * @return string
 */
function fileUrl($path)
{
    return url('api/file/' . $path . '?token=' . \JWTAuth::getToken());
}
