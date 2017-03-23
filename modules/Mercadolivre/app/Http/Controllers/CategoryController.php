<?php namespace Mercadolivre\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Input;
use App\Http\Controllers\Rest\RestResponseTrait;
use Mercadolivre\Http\Services\PublicApi;

class CategoryController extends Controller
{
    use RestResponseTrait;

    /**
     * Fetch all categories from Mercado Livre
     *
     * @return array
     */
    protected function fetchAllCategories(PublicApi $api)
    {
        $categories = $api->getAllCategories();

        $return = [];
        foreach ($categories as $category) {
            $return[$category['id']] = [
                'id'    => $category['id'],
                'title' => $category['name']
            ];
        }

        return $return;
    }

    /**
     * Fetch children categories from category
     *
     * @param  string $id
     * @return array
     */
    protected function fetchChildrenCategories(PublicApi $api, $id)
    {
        $category = $api->getCategoryById($id);

        $categories = [];
        if (sizeof($category['children_categories']) > 0) {
            foreach ($category['children_categories'] as $key => $subCategory) {
                $categories[$subCategory['id']] = [
                    'id'    => $subCategory['id'],
                    'title' => $subCategory['name']
                ];
            }
        }

        return [
            'max_title_length' => $category['settings']['max_title_length'],
            'children'         => $categories
        ];
    }

    /**
     * Fetch categories from child category path
     *
     * @param  string $id Category ID
     * @return Response
     */
    public function fetchCategoriesFromPath(PublicApi $api, $id)
    {
        try {
            $main         = $this->fetchAllCategories($api);
            $pathCategory = $api->getCategoryById($id);

            $categories = [];
            $lastCategoryChildren = null;
            foreach (array_reverse($pathCategory['path_from_root']) as $parentCategory) {
                $children = $this->fetchChildrenCategories($api,
                    $parentCategory['id']
                )['children'];

                if ($lastCategoryChildren) {
                    $children[$lastCategoryChildren['id']] = $lastCategoryChildren;
                }

                $lastCategoryChildren = [
                    'id'       => $parentCategory['id'],
                    'title'    => $parentCategory['name'],
                    'children' => $children
                ];
            }

            $main[$lastCategoryChildren['id']] = $lastCategoryChildren;

            return $this->showResponse([
                'selected_id'      => $id,
                'max_title_length' => $pathCategory['settings']['max_title_length'],
                'categories'       => $main
            ]);
        } catch (\Exception $e) {
            Log::error('Impossível realizar a busca de categorias do Mercado Livre.');
        }
    }

    /**
     * Fetch all subcategories from main category
     * @return array
     */
    public function fetchSubCategories(PublicApi $api, $id)
    {
        $response = $this->fetchChildrenCategories($api, $id);

        return $this->showResponse($response);
    }

    /**
     * Predict category by product title
     * @return array
     */
    public function predictCategory(PublicApi $api)
    {
        $category = $api->getCategoryByPredict(Input::get('title'));

        return $this->fetchCategoriesFromPath($api, $category['id']);
    }
}
