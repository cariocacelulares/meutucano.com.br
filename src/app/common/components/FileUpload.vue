<template>
  <form :class="{ hovering: hovering, FileUpload: true }" enctype="multipart/form-data" @submit.prevent>
    <div class="container">
      <div @dragenter="hovering = true" @dragleave="hovering = false">
        <div v-if="!file" class="drag-content">
          <Icon name="cloud-upload" />
          <span>{{ placeholder }}</span>
        </div>
        <input type="file" @change="onFileChange">
        <div v-if="file" class="dropzone-preview">
          <Icon name="file-pdf-o" />
          <strong>{{ file.name }}</strong>
          <small class="block m-t-10">{{ editText }}</small>
          <!-- <TButton v-if="file" @click="removeImage" leftIcon="close">Remover</TButton> -->
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    value: {
      type: String | Number
    },
    placeholder: {
      type: String,
      default: 'Arraste o arquivo ou clique aqui'
    },
    editText: {
      type: String,
      default: 'Arraste o arquivo ou clique aqui para alterar'
    },
  },

  data() {
    return {
      file: null,
      hovering: false,
    }
  },

  computed: {
    classList() {
      let classList = []

      classList.push('FileUpload')

      return notEmpty(classList).join(' ')
    }
  },

  methods: {
    onFileChange(event) {
      var files = event.target.files || event.dataTransfer.files

      if (files.length) {
        this.file = files[0]
        this.$emit('input', this.file)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~style/vars';

.FileUpload {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100px;
  padding: 10px;
  color: $dark;
  border-radius: $borderRadius;
  background-color: $lighter;
  cursor: pointer;

  input {
    position: absolute;
    cursor: pointer;
    top: 0px;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
    padding: 20px 0;
    border-radius: $borderRadius;
    border: 2px dashed transparent;
    transition: all linear 200ms;
  }

  &[disabled] {
    opacity: .3;

    &, > * {
      cursor: not-allowed;
    }
  }

  &.hovering,
  &:focus,
  &:hover {
    color: $darker;
    background-color: darken($lighter, 1);

    .container {
      border-color: $default;
    }
  }

  .Icon {
    margin-right: 10px;
  }
}
</style>
