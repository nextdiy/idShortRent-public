<template>
    <div class="image-upload-picker clearfix">
        <ul class="image-reader-list">
            <li
                class="image-reader-item"
                v-for="(item, index) in images"
                :key="index"
                @click="openReview(index)"
                :style="{
                'backgroundImage': `url(${item.dataUrl})`,
                'backgroundPosition': 'center center',
                'backgroundRepeat': 'no-repeat',
                'backgroundSize': 'cover'
                }">
                <md-tag
                    class="image-reader-item-del"
                    size="small"
                    shape="quarter"
                    fill-color="#111A34"
                    type="fill"
                    font-color="#fff"
                    @click.native.stop="onDeleteImage(index)">
                    <md-icon name="close"></md-icon>
                </md-tag>
            </li>
            <li v-show="images.length < imgNum" class="image-reader-item add">
                <md-image-reader
                    name="imageReader"
                    size="3072"
                    @select="onReaderSelect"
                    @complete="onReaderComplete"
                    @error="onReaderError"
                    :mime="['bmp', 'png', 'jpg', 'jpeg']"
                    is-multiple
                ></md-image-reader>
                <md-icon name="camera" size="md" color="#CCC"></md-icon>
                <p>选择图片</p>
            </li>
        </ul>
        <md-image-viewer
            v-model="isViewerShow"
            :list="reviewImgs"
            :has-dots="true"
            :initial-index="viewerIndex">
        </md-image-viewer>
    </div>
</template>
<script>
import {Icon, ImageReader, Tag, ImageViewer } from 'mand-mobile'
export default {
    name: 'app-image-uplaod-picker',
    props: {
        images: {
            type: Array,
            default: () => {
                return []
            }
        },
        imgNum: {
            type: Number,
            default: () => {
                return 1
            }
        }
    },
    components: {
        [Icon.name]: Icon,
        [ImageReader.name]: ImageReader,
        [Tag.name]: Tag,
        [ImageViewer.name]: ImageViewer
    },
    data() {
        return {
            reviewImgs: [],
            isViewerShow: false,
            viewerIndex: 0
        }
    },
    methods: {
        openReview(index) {
            let url = this.images[index].dataUrl;
            this.reviewImgs = [].concat(url);
            this.isViewerShow = true;
        },
        onReaderSelect() {
            this.$Toast.loading('Loading...')
        },
        onReaderComplete(name, {dataUrl, blob, file}) {
            //this.$emit('onReaderComplete', { dataUrl, blob });
            this.$imageProcessor({
                dataUrl,
                quality: 0.9,
            }).then((res) => {
                //let {dataUrl, blob} = res;
                console.log(res);
                this.$emit('onReaderComplete', {...res, file});
            })
            this.$Toast.hide();
        },
        onReaderError(name, {code}) {
            let msg = '未知错误' + ' - ' + code;
            switch(code) {
                case 100:
                    msg = '浏览器不支持';
                    break;
                case 101:
                    msg = '图片大小超出限制，请选择 3M 以下';
                    break;
                case 102:
                    msg = '图片读取失败';
                    break;
                case 103:
                    msg = '图片数量超出限制';
                    break;
            }
            this.$Toast.failed(msg)
        },
        onDeleteImage(index) {
            //this.imageList.splice(index, 1)
            this.$emit('onDeleteImage', index);
        },
    }
}
</script>
<style lang="scss" scope>
.image-upload-picker {
  .image-reader-list {
    float: left;
    width: 100%;
    .image-reader-item {
      position: relative;
      float: left;
      width: 148px;
      height: 148px;
      padding: 16px;
      margin-bottom: 2%;
      margin-right: 2%;
      background: #FFF;
      box-shadow: 0 5px 20px rgba(197, 202, 213, .25);
      box-sizing: border-box;
      list-style: none;
      border-radius: 4px;
      background-size: cover;
      &:nth-of-type(4n) {
        margin-right: 0;
      }
      &.add {
        .md-icon {
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.5;
        }
        p {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          margin-top: 15px;
          font-size: 22px;
          color: #CCC;
          text-align: center;
        }
      }
      .image-reader-item-del {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 3;
        opacity: .8;
        .md-icon-close {
          font-size: 24px;
        }
      }
    }
  }
}
</style>