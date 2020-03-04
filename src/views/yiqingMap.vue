<template>
  <div class="map-box">
    <div id="yiqingmap" class="yiqingmap"></div>
    <div v-show="level2" class="back" @click="backChina">返回</div>
  </div>
</template>

<script>
import echarts from 'echarts'; // 引入echarts
import 'echarts/map/js/china.js'; // 引入中国地图数据

export default {
  data() {
    return {
      myChart: null,
      originData: [],
      mapName: 'china',
      mapFeatures: '',
      level2: false,
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
    backChina() {
      this.disposeMap();
      this.getData();
    },
    getData() {
      // 此处省略请求数据
      this.originData = window.chinaData;
      // 初始化地图
      this.initChart('china', this.originData, 1);
    },
    initChart(name, data, level) {
      if (level === 1) {
        this.level2 = false;
      } else {
        this.level2 = true;
      }
      // 获取dom
      this.myChart = echarts.init(document.getElementById('yiqingmap'));
      // 获取中国地图
      this.mapFeatures = echarts.getMap(name).geoJson.features;
      // echarts配置
      this.myChart.setOption({
        // 悬浮框
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          alwaysShowContent: false,
          enterable: true,
          backgroundColor: 'rgba(70,92,105,0.7)',
          textStyle: {
            color: 'rgba(149,211,255,1)',
            fontSize: 20,
          },
          formatter: (value) => {
            const vd = value.data;
            let res = null;
            if (vd !== undefined) {
              res = `
                ${level === 1 ? '省份' : '市'}：${vd.name}<br>
                确诊：${vd.value}<br>
              `;
            }
            return res;
          },
        },
        // 数据-颜色映射关系
        visualMap: {
          show: true,
          type: 'piecewise',
          itemHeight: 14,
          itemGap: 8,
          pieces: [
            {
              min: 1000,
            }, // 不指定 max，表示 max 为无限大（Infinity）。
            {
              min: 500,
              max: 999,
            },
            {
              min: 100,
              max: 499,
            },
            {
              min: 10,
              max: 99,
            },
            {
              min: 1,
              max: 9,
            },
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
              'rgba(237,183,111,1)',
              'rgba(229,142,104,1)',
              'rgba(207,82,78,1)',
            ],
          },
          textStyle: {
            color: 'rgba(144,143,143,1)',
            fontSize: 16,
          },
        },
        // 地图
        geo: {
          show: true,
          map: name,
          roam: false,
          layoutCenter: ['50%', '50%'],
          layoutSize: level === 1 ? '120%' : '95%',
          label: {
            normal: {
              show: true, // 是否显示对应地名
              textStyle: {
                color: '#000',
                fontSize: 16,
              },
            },
          },
          itemStyle: {
            normal: {
              areaColor: 'rgba(255,255,255,1)',
              borderColor: 'rgba(0, 0, 0, 0.3)',
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
                show: true,
              },
            },
            roam: true,
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
      this.myChart.on('click', this.echartsMapClick);
    },
    echartsMapClick(params) {
      if (params.data && params.data.city.length > 0) {
        const mname = '浙江';
        let geoname = 'zhejiang';
        geoname = geoname.toLowerCase();
        const cityData = params.data.city;
        // eslint-disable-next-line import/no-dynamic-require
        require(`echarts/map/js/province/${geoname}.js`);
        this.disposeMap();
        this.initChart(mname, cityData, 2);
      }
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

  .yiqingmap
    width 100%
    height 100%
    background-color rgba(255,240,245,1)

  .back {
    position: absolute;
    font-size: 14px;
    top: 5%;
    left: 5%;
    width: 40px;
    height: 20px;
    line-height: 20px;
    border: 2px solid #4E4FE1;
    border-radius: 8px;
    text-align: center;
    color: #4E4FE1;
  }
</style>
