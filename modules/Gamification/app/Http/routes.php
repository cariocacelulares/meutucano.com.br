<?php

/**
 * Module routes
 */
Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api/gamification', 'namespace' => 'Gamification\Http\Controllers'], function () {
    Route::post('upload', 'UploadController@upload');
    Route::post('avatar/{gamification_id}', 'GamificationController@avatar');

    Route::get('', 'GamificationController@show');
    Route::get('perfil/{id?}', 'GamificationController@perfil');
    Route::get('ranking', 'GamificationController@ranking');
    Route::get('rank-info', 'GamificationController@rankInfo');

    Route::post('solicitacao/solicitar', 'SolicitacaoController@solicitar');
    Route::get('solicitacao/list', 'SolicitacaoController@tableList');
    Route::resource('solicitacao', 'SolicitacaoController');

    Route::get('tarefas/list', 'TarefaController@tableList');
    Route::resource('tarefas', 'TarefaController');

    Route::get('recompensas/list', 'RecompensaController@tableList');
    Route::resource('recompensas', 'RecompensaController');

    Route::get('trocas/list', 'TrocaController@tableList');
    Route::resource('trocas', 'TrocaController');

    Route::get('conquistas/list', 'ConquistaController@tableList');
    Route::resource('conquistas', 'ConquistaController');

    Route::resource('votos', 'VotoController');
});
