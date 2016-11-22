<?php

Route::group(['middleware' => ['sentry', 'jwt.auth'], 'prefix' => 'api/gamification', 'namespace' => 'Modules\Gamification\Http\Controllers'], function()
{
    Route::post('upload', 'Gamification\UploadController@upload');
    Route::post('avatar/{gamification_id}', 'Gamification\GamificationController@avatar');

    Route::get('', 'Gamification\GamificationController@show');
    Route::get('perfil/{id?}', 'Gamification\GamificationController@perfil');
    Route::get('ranking', 'Gamification\GamificationController@ranking');
    Route::get('rank-info', 'Gamification\GamificationController@rankInfo');

    Route::post('solicitacao/solicitar', 'Gamification\SolicitacaoController@solicitar');
    Route::get('solicitacao/list', 'Gamification\SolicitacaoController@tableList');
    Route::resource('solicitacao', 'Gamification\SolicitacaoController');

    Route::get('tarefas/list', 'Gamification\TarefaController@tableList');
    Route::resource('tarefas', 'Gamification\TarefaController');

    Route::get('recompensas/list', 'Gamification\RecompensaController@tableList');
    Route::resource('recompensas', 'Gamification\RecompensaController');

    Route::get('trocas/list', 'Gamification\TrocaController@tableList');
    Route::resource('trocas', 'Gamification\TrocaController');

    Route::get('conquistas/list', 'Gamification\ConquistaController@tableList');
    Route::resource('conquistas', 'Gamification\ConquistaController');

    Route::resource('votos', 'Gamification\VotoController');
});
