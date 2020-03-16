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
import worldAndChina from '../utils/map/worldAndChina.js';

export default {
  data() {
    return {
      mapChart: null,
      originData: [],
      mapOption: {},
      earthOption: {},
      earthChart: null,
      hoverIndex: 0,
      timer: null,
      interval: 5000,
      country: [{
        name: '四川',
        coord: [104.195397, 35.86166],
      }, {
        name: '德国',
        coord: [10.451526, 51.165691],
      }, {
        name: '英国',
        coord: [-3.435973, 55.378051],
      }, {
        name: '美国',
        coord: [-95.712891, 37.09024],
      }, {
        name: '日本',
        coord: [138.252924, 36.204824],
      }, {
        name: '意大利',
        coord: [12.56738, 41.87194],
      }, {
        name: '法国',
        coord: [2.213749, 46.227638],
      }],
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.disposeMap();
  },
  mounted() {
    // 获取地图数据
    this.getData();
  },
  methods: {
    disposeMap() {
      // 销毁地图实例
      if (this.mapChart) {
        this.mapChart.dispose();
        this.mapChart = null;
      }
      if (this.earthChart) {
        this.earthChart.dispose();
        this.earthChart = null;
      }
    },
    // 此处模拟请求数据
    getData() {
      this.originData = window.worldData;
      // 初始化地图
      this.initWorldMap('world', this.originData);
    },
    // 地图
    initWorldMap(name, data) {
      const canvas = document.createElement('canvas');
      this.mapChart = echarts.init(canvas, null, {
        width: 4096,
        height: 2048,
      });
      // 注册地球表层的世界地图
      echarts.registerMap(name, worldAndChina);
      this.mapOption = {
        // 数据映射
        visualMap: {
          show: true,
          type: 'piecewise',
          itemHeight: 10,
          itemGap: 8,
          pieces: [
            { min: 1000 }, // 不指定 max，表示 max 为无限大（Infinity）。
            { min: 100, max: 999 },
            { min: 10, max: 99 },
            { min: 1, max: 9 },
          ],
          showLabel: true,
          itemSymbol: 'circle',
          seriesIndex: [0],
          left: '2%',
          bottom: '2%',
          hoverLink: false,
          inRange: {
            color: [
              'rgba(247,229,190,0.8)',
              'rgba(245,180,145,0.8)',
              'rgba(213,111,69,0.8)',
              'rgba(112,31,17,0.8)',
            ],
          },
          textStyle: {
            color: 'rgba(144,143,143,1)',
            fontSize: 14,
          },
        },
        // map
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
        // 结合假数据
        series: [
          {
            type: 'map',
            map: name,
            name: '确诊病例',
            geoIndex: 0,
            label: {
              normal: {
                show: false,
              },
            },
            // itemStyle: {
            //   normal: {
            //     areaColor: '#031525',
            //     borderColor: '#3B5077',
            //   },
            //   emphasis: {
            //     areaColor: '#2B91B7',
            //   },
            // },
            animation: false,
            data,
          },
        ],
      };
      this.mapChart.setOption(this.mapOption);
      this.initEarth();
    },
    // 地球
    initEarth() {
      this.earthChart = echarts.init(document.getElementById('earth'));
      this.earthOption = {
        backgroundColor: '#333',
        globe: {
          baseTexture: require('../assets/data-1565167424629-_VRUzTZn2.jpg'),
          heightTexture: require('../assets/data-1491889019097-rJQYikcpl.jpg'),
          displacementScale: 0.04, // 地球顶点位移的大小，控制表层高度
          shading: 'lambert', // 通过经典的 lambert 着色表现光照带来的明暗
          environment: require('../assets/data-1491837999815-H1_44Qtal.jpg'),
          // 光照相关的设置
          light: {
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
          // 用于鼠标的旋转，缩放等视角控制。
          viewControl: {
            targetCoord: this.country[0].coord, // 初始位置
            autoRotate: false, // 自动旋转
            autoRotateAfterStill: 5, // 在鼠标静止操作后恢复自动旋转的时间间隔
            distance: 150, // 视距
            animation: true, // 开启过渡动画
            animationDurationUpdate: 1500, // 过渡时长
            animationEasingUpdate: 'cubicInOut', // 缓动动画
          },
          // 地球表面层的配置
          layers: [{
            type: 'blend', // 跟 baseTexture 混合
            texture: this.mapChart, // 表层
          }],
        },
      };
      this.earthChart.setOption(this.earthOption);
      // 开始动画
      this.setTimer();
    },
    // 设置定时器，循环播放
    setTimer() {
      this.timer = setInterval(() => {
        const { name, coord } = this.country[this.hoverIndex];
        this.setCenter(coord);
        this.highLight(name);
        this.hoverIndex++;
        if (this.hoverIndex === this.country.length) {
          this.hoverIndex = 0;
        }
      }, this.interval);
    },
    // 移动到某个点
    setCenter(coord) {
      this.earthChart.setOption({
        globe: {
          viewControl: {
            targetCoord: coord, // 目标经纬度，转到哪里
            autoRotate: false, // 自动旋转
            autoRotateAfterStill: 5, // 在鼠标静止操作后恢复自动旋转的时间间隔
            distance: 150, // 视距
            animation: true, // 开启过渡动画
            animationDurationUpdate: 1000, // 过渡时长
            animationEasingUpdate: 'cubicInOut', // 缓动动画
          },
        },
      });
    },
    // hover事件监听
    bindHover() {
      this.mapChart.on('mouseover', (d) => {
        console.log('hover', d);
      });
    },
    // 封装高亮方法
    highLight(val) {
      let index;
      for (let i = 0; i < this.originData.length; i++) {
        const oi = this.originData[i];
        if (val === oi.name) {
          index = i;
          break;
        }
      }
      // 取消高亮
      this.mapChart.dispatchAction({
        type: 'downplay',
        // dataIndex: index,
      });
      // 高亮
      this.mapChart.dispatchAction({
        type: 'highlight',
        dataIndex: index,
      });
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
