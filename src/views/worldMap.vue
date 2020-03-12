<template>
  <div class="map-box">
    <div id="worldmap" class="worldmap"></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import 'echarts/map/js/world.js';
import world from '../utils/map/world-highres3.geo';
import usa from '../utils/map/us-all.geo';
import nameMap from '../utils/echartsNameMap';

export default {
  data() {
    return {
      myChart: null,
      originData: [],
      mapFeatures: '',
      detail: false,
      zoom: 1,
      center: [4210, 7200],
    };
  },
  beforeDestroy() {
    this.disposeMap();
  },
  mounted() {
    // 获取地图数据
    this.getData();
  },
  methods: {
    disposeMap() {
      // 销毁地图实例
      if (!this.myChart) {
        return;
      }
      this.myChart.dispose();
      this.myChart = null;
    },
    getData() {
      // 此处模拟请求数据
      this.originData = window.worldData;
      // 初始化地图
      this.initWorldChart('world', this.originData, world);
    },
    initWorldChart(name, data, json) {
      this.worldChart = echarts.init(document.getElementById('worldmap'));
      // this.mapFeatures = echarts.getMap(name).geoJson.features;
      echarts.registerMap(name, json);
      this.worldChart.setOption({
        tooltip: {
          extraCssText: 'z-index: 5',
          trigger: 'item',
          triggerOn: 'click',
          transitionDuration: 0,
          alwaysShowContent: false,
          enterable: true,
          backgroundColor: 'rgba(61,61,61,0.9)',
          padding: [10, 15],
          textStyle: {
            color: 'rgba(255,255,255,1)',
            fontSize: 16,
          },
          formatter: (value) => {
            const vd = value.data;
            let res = null;
            if (vd !== undefined) {
              let cent = '';
              const per = vd.deathNum / vd.value * 100;
              if (per === 0) {
                cent = per.toFixed(0);
              } else {
                cent = per.toFixed(2);
              }
              res = `
                ${vd.name}<br>
                确诊：${vd.value}<br>
                死亡：${vd.deathNum}<br>
                死亡率：${cent}%<br>
              `;
            }
            return res;
          },
        },
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
              'rgba(247,229,190,1)',
              '#F5B491',
              '#D56F45',
              '#701F11',
            ],
          },
          textStyle: {
            color: 'rgba(144,143,143,1)',
            fontSize: 14,
          },
        },
        geo: {
          show: true,
          map: name,
          roam: true,
          zoom: this.zoom,
          center: this.center,
          layoutCenter: ['50%', '50%'],
          layoutSize: '120%',
          nameMap,
          label: {
            normal: {
              show: false, // 是否显示对应地名
              textStyle: {
                color: '#000',
                fontSize: 16,
              },
            },
          },
          itemStyle: {
            normal: {
              areaColor: '#F5F5F5',
              borderColor: 'rgba(0, 0, 0, 0.3)',
              // borderWidth: 1
            },
          },
        },
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
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077',
              },
              emphasis: {
                areaColor: '#2B91B7',
              },
            },
            animation: false,
            data,
          },
        ],
      });

      // this.worldChart.on('georoam', (params) => {
      //   // console.log(params);
      //   this.onDatazoom();
      // });
    },
    onDatazoom() {
      // const { detail, option } = this.state;
      const { zoom } = this.getZoom();
      const threshold = 2;
      this.saveZoom(); // 地图缩放后，将缩放值和center保存在状态中
      console.log('zoom', this.zoom);
      console.log('center', this.center);

      if (zoom >= threshold && !this.detail) {
        // 切换详细地图
        this.detail = true;
        this.initWorldChart('world', this.originData, usa);
      } else if (this.detail && zoom < threshold) {
        // 切换默认地图
        this.detail = false;
        this.initWorldChart('world', this.originData, world);
      }
    },
    getZoom() {
      if (this.worldChart) {
        const { zoom, center } = this.worldChart.getOption().geo[0];
        return { zoom, center };
      }
      return;
    },
    saveZoom() {
      const { zoom, center } = this.getZoom();
      this.zoom = zoom;
      this.center = center;
    },
  },
};
</script>

<style lang="stylus" scoped>
.map-box
  position relative
  width 800px
  height 600px
  margin auto

  .worldmap
    width 100%
    height 100%
    background-color rgba(255,240,245,1)
</style>
