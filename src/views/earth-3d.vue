<template>
  <div class="map-box">
    <div id="earth" class="earth"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import 'echarts-gl';
import 'echarts/map/js/world.js';
import echartsNameMap from '../utils/echartsNameMap.js';

export default {
  data() {
    return {
      mapChart: null,
      originData: [],
      mapOption: {},
      earthOption: {},
      earthChart: null,
    };
  },
  beforeDestroy() {
    this.disposeMap();
  },
  mounted() {
    // 获取地图数据
    // this.getData();
    this.initWorldMap('world', []);
  },
  methods: {
    disposeMap() {
      // 销毁地图实例
      // if (!this.myChart) {
      //   return;
      // }
      if (this.mapChart) {
        this.mapChart.dispose();
        this.mapChart = null;
      }
      if (this.earthChart) {
        this.earthChart.dispose();
        this.earthChart = null;
      }
    },
    // 地图
    initWorldMap(name, data) {
      const canvas = document.createElement('canvas');
      this.mapChart = echarts.init(canvas, null, {
        width: 4096,
        height: 2048,
      });
      this.mapOption = {
        geo: {
          show: true,
          type: 'map',
          map: name,
          nameMap: echartsNameMap,
          label: {
            fontSize: 20,
          },
          itemStyle: {
            areaColor: 'transparent',
            borderColor: '#00FDFF',
            borderWidth: 2,
          },
          emphasis: {
            areaColor: 'transparent',
          },
          // 绘制完整尺寸的 echarts 实例
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          boundingCoords: [ // 设置为一张完整经纬度的世界地图
            [-180, 90],
            [180, -90],
          ],
        },
        data: [],
      };
      this.mapChart.setOption(this.mapOption);
      this.initEarth();
    },
    // 地球
    initEarth() {
      this.earthChart = echarts.init(document.getElementById('earth'));
      this.earthOption = {
        backgroundColor: '#333',
        // visualMap: [{
        //   show: false,
        //   type: 'continuous',
        //   seriesIndex: 0,
        //   text: ['scatter3D'],
        //   textStyle: {
        //     color: '#fff',
        //   },
        //   calculable: true,
        //   max: 3000,
        //   inRange: {
        //     color: ['#87aa66', '#eba438', '#d94d4c'],
        //     symbolSize: [8, 30],
        //   },
        // },
        // ],
        globe: {
          baseTexture: require('../assets/data-1565167424629-_VRUzTZn2.jpg'),
          heightTexture: require('../assets/data-1491889019097-rJQYikcpl.jpg'),
          displacementScale: 0.04,
          shading: 'lambert',
          environment: require('../assets/data-1491837999815-H1_44Qtal.jpg'),
          light: { // 光照阴影
            main: {
              color: '#fff', // 光照颜色
              intensity: 1.2, // 光照强度
              shadow: false, // 是否显示阴影
              alpha: 40,
              beta: -30,
            },
            ambient: {
              intensity: 0.5,
            },
          },
          viewControl: {
            projection: 'perspective',
            alpha: 90,
            beta: 0,
            // center: [0, 50, 0], // 视角
            targetCoord: [100.46, 39.92],
            autoRotate: true,
            autoRotateAfterStill: 5,
            distance: 150, // 视距
          },
          postEffectL: {
            enable: true,
            depthOfFieldL: {
              enable: true,
              focalDistance: 1000,
              fstop: 100,
            },
          },
          layers: [{
            type: 'blend',
            texture: this.mapChart,
          }],
        },
      };
      this.earthChart.setOption(this.earthOption);
    },
  },
};
</script>

<style lang="stylus" scoped>
.map-box {
  position: relative;
  width: 1000px;
  height: 800px;
  margin: auto;

  .earth {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 240, 245, 1);
  }
}
</style>
