<?php namespace Magento\Console\Commands;

use Illuminate\Console\Command;
use Core\Models\Produto\Produto;
use Magento\Http\Controllers\MagentoController;

class RefreshMagentoStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'refresh:stock {produto}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Atualiza o estoque do magento baseado no tucano';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        if ($this->argument('produto') && $produto = Produto::find($this->argument('produto'))) {
            $return = with(new MagentoController())->updateStock($produto);
            $this->comment($return);
        } else {
            throw new \Exception('O sku de um produto válido precisa ser passado como parâmetro', 1);
        }
    }
}