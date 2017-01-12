<?php namespace Core\Transformers;

use Core\Transformers\Parsers\ClientParser;
use Core\Transformers\Parsers\AddressParser;
use Core\Transformers\Parsers\OrderParser;

/**
 * Class ClientTransformer
 * @package Core\Transformers
 */
class ClientTransformer
{
    /**
     * @param  object $clients
     * @return array
     */
    public static function search($clients)
    {
        $transformed = [];
        foreach ($clients as $client) {
            $lastEndereco = (!$client->enderecos) ? [] : [
                'cep'          => $client->enderecos[0]['cep'],
                'cep_readable' => AddressParser::getCepReadable($client->enderecos[0]['cep']),
                'cidade'       => $client->enderecos[0]['cidade'],
                'uf'           => $client->enderecos[0]['uf'],
            ];

            $transformed[] = [
                'id'              => $client['id'],
                'nome'            => $client['nome'],
                'fone'            => $client['fone'],
                'email'           => $client['email'],
                'inscricao'       => $client['inscricao'],
                'taxvat'          => $client['taxvat'],
                'taxvat_readable' => ClientParser::getTaxvatReadable($client['taxvat'], $client['tipo']),
                'created_at'      => dateConvert($client['created_at']),
                'endereco'        => $lastEndereco,
            ];
        }

        return $transformed;
    }

    /**
     * @param  object $clients
     * @return array
     */
    public static function list($clients)
    {
        $pagination  = $clients->toArray();
        $transformed = [];

        foreach ($clients as $client) {
            $lastEndereco = (!$client->enderecos) ? [] : [
                'cep'          => $client->enderecos[0]['cep'],
                'cep_readable' => AddressParser::getCepReadable($client->enderecos[0]['cep']),
                'cidade'       => $client->enderecos[0]['cidade'],
                'uf'           => $client->enderecos[0]['uf'],
            ];

            $transformed[] = [
                'id'              => $client['id'],
                'nome'            => $client['nome'],
                'fone'            => $client['fone'],
                'email'           => $client['email'],
                'taxvat'          => $client['taxvat'],
                'taxvat_readable' => ClientParser::getTaxvatReadable($client['taxvat'], $client['tipo']),
                'created_at'      => dateConvert($client['created_at']),
                'last_endereco'   => $lastEndereco,
            ];
        }

        $pagination['data'] = $transformed;

        return $pagination;
    }

    /**
     * @param  object $client
     * @return array
     */
    public static function show($client)
    {
        $enderecos = [];
        foreach ($client->enderecos as $endereco) {
            $enderecos[] = [
                'id'           => $endereco->id,
                'rua'          => $endereco->rua,
                'numero'       => $endereco->numero,
                'bairro'       => $endereco->bairro,
                'complemento'  => $endereco->complemento,
                'cidade'       => $endereco->cidade,
                'uf'           => $endereco->uf,
                'cep'          => $endereco->cep,
                'cep_readable' => AddressParser::getCepReadable($endereco->cep),
            ];
        }

        $pedidos = [];
        foreach ($client->pedidos as $pedido) {
            $pedidos[] = [
                'id'                 => $pedido->id,
                'codigo_marketplace' => $pedido->codigo_marketplace,
                'marketplace'        => OrderParser::getMarketplaceReadable($pedido->marketplace_readable),
                'status'             => $pedido->status,
                'status_description' => OrderParser::getStatusDescription($pedido->status),
                'created_at'         => dateConvert($pedido->created_at),
                'total'              => $pedido->total,
            ];
        }

        return [
            'nome'            => $client->nome,
            'fone'            => $client->fone,
            'email'           => $client->email,
            'taxvat'          => $client->taxvat,
            'taxvat_readable' => ClientParser::getTaxvatReadable($client->taxvat, $client->tipo),
            'inscricao'       => $client->inscricao,
            'created_at'      => dateConvert($client['created_at']),
            'enderecos'       => $enderecos,
            'pedidos'         => $pedidos,
        ];
    }
}
