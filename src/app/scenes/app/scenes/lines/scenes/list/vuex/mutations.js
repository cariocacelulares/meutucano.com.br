import { default as LineTransformer } from '../../../transformer'

export default {
  'lines/list/RECEIVED' (state, lines) {
    lines = lines.map((line) =>
      LineTransformer.transform(line)
    )

    state.lines = lines
  },
}
