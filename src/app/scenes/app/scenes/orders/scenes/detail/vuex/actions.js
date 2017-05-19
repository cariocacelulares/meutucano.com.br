export default {
  'orders/detail/FETCH_ORDER' (context, id) {
    if (!id) {
      return;
    }

    return axios.get(`orders/${id}`).then(
      (response) => {
        context.commit('orders/detail/ORDER_RECEIVED', response.data)
      }
    )
  },
}
