<?php

use Illuminate\Support\Facades\Input;

/**
 * Filter model based on request
 *
 * @param  Builder $query
 * @return Builder
 */
function filter($query)
{
    if (Input::get('filter')) {
        foreach (json_decode(Input::get('filter'), true) as $filter) {
            if ($filter['operator'] == 'LIKE') {
                $filter['value'] = '%' . $filter['value'] . '%';
            }

            if ($filter['operator'] == 'BETWEEN' && !is_array($filter['value'])) {
                $filter['operator'] = '=';
            }

            if ($filter['operator'] == 'BETWEEN') {
                if ((!isset($filter['value']['to']) || (!$filter['value']['to'] && $filter['value']['to'] !== 0)) && isset($filter['value']['from'])) {
                    $filter['operator'] = '>=';
                    $filter['value']    = $filter['value']['from'];
                } elseif ((!isset($filter['value']['from']) || (!$filter['value']['from'] && $filter['value']['from'] !== 0)) && isset($filter['value']['to'])) {
                    $filter['operator'] = '<=';
                    $filter['value']    = $filter['value']['to'];
                }
            }

            if ($filter['operator'] == 'BETWEEN') {
                foreach ($filter['value'] as $key => $value) {
                    if (is_string($value) && \DateTime::createFromFormat('d/m/Y', $value) !== false) {
                        $filter['value'][$key] = Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
                    }
                }

                $query = $query->whereBetween(
                    $filter['column'],
                    [
                        $filter['value']['from'],
                        $filter['value']['to']
                    ]
                );
            } elseif (is_string($filter['value']) && \DateTime::createFromFormat('d/m/Y', $filter['value']) !== false) {
                $query = $query->whereDate(
                    $filter['column'],
                    $filter['operator'],
                    Carbon::createFromFormat('d/m/Y', $filter['value'])->format('Y-m-d')
                );
            } else if ($filter['operator'] == 'IN') {
                $query = $query->whereIn(
                    $filter['column'],
                    $filter['value']
                );
            } else {
                $query = $query->where(
                    $filter['column'],
                    $filter['operator'],
                    $filter['value']
                );
            }
        }
    }

    return $query;
}

/**
 * Paginate model based on request
 *
 * @param  Builder $query
 * @return array
 */
function paginate($query = null) {
    return $query->paginate(
        Input::get('per_page', 10)
    );
}

/**
 * Return response with paginated and filtered results
 *
 * @param  array $data
 * @return array
 */
function tableListResponse($data)
{
    return listResponse(paginate(filter($data)));
}

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
