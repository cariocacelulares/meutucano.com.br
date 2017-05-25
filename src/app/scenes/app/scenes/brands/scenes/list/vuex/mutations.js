import { default as BrandTransformer } from '../../../transformer'

export default {
  'brands/list/RECEIVED' (state, brands) {
    brands = brands.map((brand) =>
      BrandTransformer.transform(brand)
    )

    state.brands = brands
  },
}
