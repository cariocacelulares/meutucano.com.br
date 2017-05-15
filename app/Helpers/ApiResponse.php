<?php

/**
 * @param $data
 * @return \Symfony\Component\HttpFoundation\Response
 */
function createdResponse($data)
{
    $response = [
        'code'   => 201,
        'status' => 'success',
        'data'   => $data
    ];

    return response()->json($response, $response['code']);
}

/**
 * @param $data
 * @return \Symfony\Component\HttpFoundation\Response
 */
function showResponse($data)
{
    $response = [
        'code'   => 200,
        'status' => 'success',
        'data'   => $data
    ];

    return response()->json($response, $response['code']);
}

/**
 * @param $data
 * @return \Symfony\Component\HttpFoundation\Response
 */
function listResponse($data)
{
    $response = [
        'code'   => 200,
        'status' => 'success',
        'data'   => $data
    ];

    return response()->json($response, $response['code']);
}

/**
 * @return \Symfony\Component\HttpFoundation\Response
 */
function notFoundResponse()
{
    $response = [
        'code'    => 404,
        'status'  => 'error',
        'data'    => 'Resource Not Found',
        'message' => 'Not Found'
    ];

    return response()->json($response, $response['code']);
}

/**
 * @return \Symfony\Component\HttpFoundation\Response
 */
function deletedResponse()
{
    $response = [
        'code'    => 204,
        'status'  => 'success',
        'data'    => [],
        'message' => 'Resource deleted'
    ];

    return response()->json($response, $response['code']);
}

/**
 * @param $data
 * @return \Symfony\Component\HttpFoundation\Response
 */
function clientErrorResponse($data)
{
    $response = [
        'code'    => 422,
        'status'  => 'error',
        'data'    => $data,
        'message' => 'Unprocessable entity'
    ];

    return response()->json($response, $response['code']);
}

/**
 * @param $data
 * @return \Symfony\Component\HttpFoundation\Response
 */
function validationFailResponse($data)
{
    $response = [
        'code'   => 400,
        'status' => 'ValidationFail',
        'data'   => $data
    ];

    return response()->json($response, $response['code']);
}
